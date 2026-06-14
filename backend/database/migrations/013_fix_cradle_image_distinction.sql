-- Product-specific image fixes (avoid same thumbnail for different cradles in one category).

UPDATE products SET images = '[
  "https://rxfgnbshfhbvngmtezhs.supabase.co/storage/v1/object/public/pakkarent_images/products/event_rental/silver_cradle/img_1781187807016_8i7a.jpg"
]'::jsonb, updated_at = NOW()
WHERE name = 'Silver Cradle' AND is_active = true;

UPDATE products SET images = '[
  "https://rxfgnbshfhbvngmtezhs.supabase.co/storage/v1/object/public/pakkarent_images/products/event_rental/silver_cradle/img_1781187470312_z1s0.jpg",
  "https://rxfgnbshfhbvngmtezhs.supabase.co/storage/v1/object/public/pakkarent_images/products/event_rental/silver_cradle/img_1781187807016_8i7a.jpg"
]'::jsonb, updated_at = NOW()
WHERE name = 'Silver Grand Cradle' AND is_active = true;

-- Peacock variant uses dedicated folder (distinct from plain silver cradle)
UPDATE products SET images = '[
  "https://rxfgnbshfhbvngmtezhs.supabase.co/storage/v1/object/public/pakkarent_images/products/event_rental/peacock_silver_cradle/img_1781187445647_r0dy.jpeg"
]'::jsonb, updated_at = NOW()
WHERE name IN ('Silver Peacock Cradle', 'Peacock Silver Cradle') AND is_active = true;
