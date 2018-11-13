# bamazon
Amazon-like storefront CLI app

## Set up Bamazon
-----------------------------
**_Prerequisites_**
**In order to use Bamazon, ensure you have nodeJS installed.**
**Dependent node packages are listed in the package.json file.**

- Download files:
    - Download bamazon from https://github.com/HillerDavid/bamazon
    

- Install node packages:
    - Open a terminal.
    - Navigate to bamazon folder containing **bamazonCustomer.js**, **bamazonManager.js**.
    - Enter the command ```npm i```.

## How to use Bamazon
-----------------------------
**All commands should be entered looking in bamazon folder in a terminal.**

## Launch as Customer
- Enter ```node bamazonCustomer.js```
![CustomerStart](gifs/customer-start.gif)

### Place Order
- Enter id number of product you would like to purchase
- Enter quantity of item you would like to order
![CustomerPlaceOrder](gifs/customer-place-order.gif)

### Order More or Quit
- Enter ```y``` to go back to order selection
- Enter ```n``` to quit
![CustomerOrderMore](gifs/customer-restart.gif)

### Launch as Manager
- Enter ```node bamazonManager.js```
![ManagerStart](gifs/manager-start.gif)

### View Current Inventory
- Select ```View Products for Sale```
![ManagerCurrentInventory](gifs/manager-current-inventory.gif)

### View Low Inventory
- Select ```View Low Inventory```
![ManagerLowInventory](gifs/manager-low-inventory.gif)

### Restock Inventory
- Select ```Restock Inventory```
- Enter id number of product you wish to replenish inventory
- Enter quantity you would like to add to inventory
![ManagerRestock](gifs/manager-restock.gif)

### Add New Product to Inventory
- Select ```Add New Product```
![ManagerAddProduct](gifs/manager-add-product)