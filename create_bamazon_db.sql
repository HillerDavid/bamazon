CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS products (
	item_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price FLOAT(20, 2) NOT NULL,
    stock_quantity INT NOT NULL
)