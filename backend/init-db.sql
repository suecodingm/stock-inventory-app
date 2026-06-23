-- Create database if not exists
SELECT 'CREATE DATABASE stock_inventory' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'stock_inventory')\gexec

-- Connect to the stock_inventory database
\c stock_inventory;

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory table (product stock in stores)
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, store_id)
);

-- Create indexes for faster searches
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_store ON inventory(store_id);

-- Insert sample data
INSERT INTO stores (name, location) VALUES
    ('Downtown Store', '123 Main St'),
    ('Mall Store', '456 Shopping Center'),
    ('Airport Store', '789 Terminal Rd'),
    ('Suburban Store', '321 Oak Ave')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, sku, description) VALUES
    ('Laptop Pro 15', 'LP15-2024', 'High-performance laptop with 15" display'),
    ('Wireless Headphones', 'WH-BT-001', 'Bluetooth noise-canceling headphones'),
    ('USB-C Cable', 'USB-C-3M', '3-meter USB-C charging cable'),
    ('Phone Case', 'CASE-IP15', 'Protective case for iPhone 15'),
    ('Screen Protector', 'SCREEN-IP15', 'Tempered glass screen protector')
ON CONFLICT DO NOTHING;

INSERT INTO inventory (product_id, store_id, quantity) VALUES
    (1, 1, 5),
    (1, 2, 8),
    (1, 3, 2),
    (2, 1, 12),
    (2, 2, 7),
    (2, 4, 15),
    (3, 1, 50),
    (3, 2, 35),
    (3, 3, 28),
    (3, 4, 40),
    (4, 1, 20),
    (4, 2, 15),
    (4, 3, 10),
    (4, 4, 25),
    (5, 2, 18),
    (5, 3, 12),
    (5, 4, 22)
ON CONFLICT DO NOTHING;
