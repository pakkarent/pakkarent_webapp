const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../models/db');
const { authenticate, adminOnly } = require('../middleware/auth');

const UPLOADS_ROOT = path.join(__dirname, '../../uploads');

// ── Storage config ──────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { category = 'misc', slug = 'product' } = req.params;
    const dir = path.join(UPLOADS_ROOT, 'products', category, slug);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const name = `img_${Date.now()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
               allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only image files are allowed'));
  }
});

// ── POST /api/uploads/products/:id ──────────────────────────────────────────
// Upload one or more images for a product (admin only)
router.post('/products/:id', authenticate, adminOnly, async (req, res) => {
  try {
    // Fetch product to determine category slug
    const prod = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!prod.rows.length) return res.status(404).json({ success: false, message: 'Product not found' });

    const catRes = await pool.query('SELECT name FROM categories WHERE id = $1', [prod.rows[0].category_id]);
    const catName = (catRes.rows[0]?.name || 'misc')
      .toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const slug = prod.rows[0].name
      .toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    // Patch multer params for dynamic folder
    req.params.category = catName;
    req.params.slug = slug;

    const uploadMiddleware = multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const dir = path.join(UPLOADS_ROOT, 'products', catName, slug);
          fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
          cb(null, `img_${Date.now()}_${Math.random().toString(36).slice(2, 6)}${ext}`);
        }
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
                   allowed.test(file.mimetype);
        ok ? cb(null, true) : cb(new Error('Only image files are allowed'));
      }
    }).array('images', 10);

    uploadMiddleware(req, res, async (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });

      const newPaths = (req.files || []).map(
        f => `/uploads/products/${catName}/${slug}/${f.filename}`
      );

      if (!newPaths.length) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
      }

      // Merge with existing images
      const existing = Array.isArray(prod.rows[0].images)
        ? prod.rows[0].images
        : JSON.parse(prod.rows[0].images || '[]');
      const merged = [...existing, ...newPaths];

      await pool.query(
        'UPDATE products SET images = $1, updated_at = NOW() WHERE id = $2',
        [JSON.stringify(merged), req.params.id]
      );

      res.json({ success: true, images: merged, added: newPaths });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/uploads/products/:id/image ───────────────────────────────────
// Remove a specific image from a product
router.delete('/products/:id/image', authenticate, adminOnly, async (req, res) => {
  const { imagePath } = req.body;
  if (!imagePath) return res.status(400).json({ success: false, message: 'imagePath required' });

  try {
    const prod = await pool.query('SELECT images FROM products WHERE id = $1', [req.params.id]);
    if (!prod.rows.length) return res.status(404).json({ success: false, message: 'Product not found' });

    const images = Array.isArray(prod.rows[0].images)
      ? prod.rows[0].images
      : JSON.parse(prod.rows[0].images || '[]');

    const updated = images.filter(img => img !== imagePath);

    // Delete physical file if it's a local upload
    if (imagePath.startsWith('/uploads/')) {
      const relativePath = imagePath.replace(/^\/+/, '');
      const fullPath = path.join(__dirname, '../../', relativePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
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
