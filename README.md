# bAmazon

This application (bamazon) is written as a node application that interfaces with a MySQL database to mimic a storefront.

SETUP:
* Using MySQL, run `bamazon.sql` to create, use, and initialize the databased needed for this application.
* `npm install` must be run prior to running the app to install relevant packages/modules.
* In `bAmazonCustomer.js` and `bAmazonManager.js`, you need to change the user and password to match your MySQL database login (line 8).

USAGE:

bAmazonCustomer allows you to see and buy what's available in the storefront's inventory.
* In your command line environment, run the following: `node bAmazonCustomer.js`. This will show all inventory items with quantity > 0.
* Select the ID that matches the item you wish to "purchase", and enter a valid integer. Decimal point numbers are rounded down.
* Select a quantity of that item that you wish to "purchase".
* The program will update the database table (`products`), and display the total cost of the transaction (sans tax).

bAmazonManager allows you to manage the storefront's inventory with one of four options:
1) View Products for Sale - this will show the database table (`products`) in a formatted manner.
    
2) View Low Inventory - this will show the database entries for which the inventory stock is lower than five.
    
3) Add to Inventory - this allows you to select an item in the inventory and add a specified quantity to it.
    
4) Add New Product - this allows you to enter in a completely new item to the inventory.

See `bamazonCustomer.mp4` and `bamazonManager.mp4` videos for example usage.
