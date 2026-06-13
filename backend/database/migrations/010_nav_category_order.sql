-- Nav menu order: Event & Backdrop first; Camping & Home Appliances last.

UPDATE categories SET sort_order = 1 WHERE name = 'Event Rental' AND parent_id IS NULL;
UPDATE categories SET sort_order = 2 WHERE name = 'Backdrop Rental' AND parent_id IS NULL;
UPDATE categories SET sort_order = 3 WHERE name = 'Birthday Rental' AND parent_id IS NULL;
UPDATE categories SET sort_order = 4 WHERE name = 'Baby Props Rental' AND parent_id IS NULL;
UPDATE categories SET sort_order = 5 WHERE name = 'Kids Toys on Rent' AND parent_id IS NULL;
UPDATE categories SET sort_order = 6 WHERE name = 'Games Rental' AND parent_id IS NULL;
UPDATE categories SET sort_order = 7 WHERE name = 'Camping Rental' AND parent_id IS NULL;
UPDATE categories SET sort_order = 8 WHERE name = 'Home Appliances Rental' AND parent_id IS NULL;
