var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bAmazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\nWelcome to bamazon! Here are the items currently for sale:\n");
    showInventory();
});

function showInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity > 0";
    connection.query(query, function (err, res) {
        if (err) throw err;

        var inventory = [];
        var itemIDs = [];

        for (var i = 0; i < res.length; i++) {
            var item = res[i];
            inventory.push(item);
            itemIDs.push(item.item_id.toString());
            console.log("ID: " + item.item_id + "\tPrice: $" + item.price + "\tProduct: " + item.product_name);
        }
        console.log();

        inquirer.prompt([
            {
                type: "list",
                message: "Which item would you like to buy? (Select an ID):",
                choices: itemIDs,
                name: "id"
            },
            {
                type: "input",
                message: "How many of this item would you like to buy?",
                name: "quantity",
                validate: function validateQuantity(name) {
                    return !isNaN(name) && parseInt(name) >= 0;
                }
            }
        ])
            .then(function (answers) {
                var userID = answers.id;
                var userQuantity = parseInt(answers.quantity);

                connection.query("SELECT * FROM products WHERE item_id = " + userID, function (err, response) {
                    if (err) throw err;

                    var item = response[0];

                    if (userQuantity <= item.stock_quantity) {
                        
                        console.log();

                        connection.query("UPDATE products SET ? WHERE ?",
                            [{
                                stock_quantity: item.stock_quantity - userQuantity
                            },
                            {
                                item_id: userID
                            }],
                            function (err, response) {
                                if(err) throw err;
                                console.log("Your purchase of " + userQuantity + " " + item.product_name + " will cost: $" + parseFloat((item.price*userQuantity).toFixed(2)));
                                console.log("Thank you for shopping at bamazon!");
                                connection.end();
                            });
                    }
                    else {
                        console.log("Insufficient quantity! Exiting..");
                        connection.end();
                    }
                });
            });
    });
}

