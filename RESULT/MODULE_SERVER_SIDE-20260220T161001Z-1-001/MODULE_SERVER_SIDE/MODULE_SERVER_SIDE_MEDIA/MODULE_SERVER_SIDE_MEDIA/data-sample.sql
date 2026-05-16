INSERT INTO categories (name, description) VALUES
('Elektronik', 'Produk elektronik seperti HP dan Laptop'),
('Makanan', 'Produk makanan dan minuman'),
('Fashion', 'Pakaian dan aksesoris');

INSERT INTO products (category_id, name, description, price, stock) VALUES
(1, 'Laptop Asus ROG', 'Laptop gaming 16GB RAM', 15000000, 5),
(1, 'Smartphone Samsung S23', 'HP Android terbaru', 12000000, 8),
(2, 'Snack Kentang', 'Snack rasa original 100gr', 10000, 100),
(2, 'Minuman Soda', 'Minuman bersoda 330ml', 7000, 120),
(3, 'Kaos Polos', 'Kaos polos cotton combed', 75000, 50);

INSERT INTO transactions (transaction_code, transaction_date, total_amount, payment_method) VALUES
('TRX-20260211-001', '2026-02-11 10:15:00', 15020000, 'Cash'),
('TRX-20260211-002', '2026-02-11 11:00:00', 170000, 'Transfer'),
('TRX-20260211-003', '2026-02-11 13:30:00', 12000000, 'QRIS');

INSERT INTO transaction_details (transaction_id, product_id, quantity, price, subtotal) VALUES
(1, 1, 1, 15000000, 15000000),
(1, 3, 2, 10000, 20000);

INSERT INTO transaction_details (transaction_id, product_id, quantity, price, subtotal) VALUES
(2, 5, 2, 75000, 150000),
(2, 4, 3, 7000, 21000);

INSERT INTO transaction_details (transaction_id, product_id, quantity, price, subtotal) VALUES
(3, 2, 1, 12000000, 12000000);