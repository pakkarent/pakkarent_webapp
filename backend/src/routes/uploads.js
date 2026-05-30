const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../models/db');
const { authenticate, adminOnly } = require('../middleware/auth');
const { uploadBuffer, removeObject } = require('../utils/storage');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ok =
      allowed.test(path.extname(file.originalname).toLowerCase()) &&
      allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only image files are allowed'));
  },
});

function parseImages(value) {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ── POST /api/uploads/products/:id ──────────────────────────────────────────
router.post('/products/:id', authenticate, adminOnly, upload.array('images', 10), async (req, res) => {
  try {
    const prod = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!prod.rows.length) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!req.files?.length) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const catRes = await pool.query('SELECT name FROM categories WHERE id = $1', [prod.rows[0].category_id]);
    const catName = (catRes.rows[0]?.name || 'misc')
      .toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const slug = prod.rows[0].name
      .toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    const newUrls = [];
    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 6)}${ext}`;
      const storageKey = `products/${catName}/${slug}/${filename}`;
      const { publicUrl } = await uploadBuffer(storageKey, file.buffer, file.mimetype);
      newUrls.push(publicUrl);
    }

    const existing = parseImages(prod.rows[0].images);
    const merged = [...existing, ...newUrls];

    await pool.query(
      'UPDATE products SET images = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(merged), req.params.id]
    );

    res.json({ success: true, images: merged, added: newUrls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/uploads/products/:id/image ───────────────────────────────────
router.delete('/products/:id/image', authenticate, adminOnly, async (req, res) => {
  const { imagePath } = req.body;
  if (!imagePath) {
    return res.status(400).json({ success: false, message: 'imagePath required' });
  }

  try {
    const prod = await pool.query('SELECT images FROM products WHERE id = $1', [req.params.id]);
    if (!prod.rows.length) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const images = parseImages(prod.rows[0].images);
    const updated = images.filter(img => img !== imagePath);

    if (imagePath.includes('pakkarent_images') || imagePath.startsWith('/uploads/')) {
      await removeObject(imagePath);
    }

    await pool.query(
      'UPDATE products SET images = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(updated), req.params.id]
    );

    res.json({ success: true, images: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
