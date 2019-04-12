DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

DROP TABLE IF EXISTS products;
CREATE TABLE products(
	item_id integer(10) auto_increment primary key,
    product_name varchar(50),
    department_name varchar(50),
    price float,
    stock_quantity integer(10)
);

INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES
("Light bulbs", "Tools & Home Improvement", 25.19, 24),
("Jolly Rancher Hard Candy", "Hard Candy", 7.86, 360),
("Tracing Pad", "Drawing", 17.49, 24),
("Security Camera System", "Home Security", 139.99, 28),
("Video Camera", "Camcorders", 49.99, 2),
("Smartphone Mount", "Car Cradles & Mounts", 12.63, 2),
("Popcorn Popper", "Popcorn Poppers", 11.90, 1),
("Sharpies", "Markers & Highlighters", 6.50, 10);