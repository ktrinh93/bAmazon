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

    inquirer.prompt([
        {
            type: "list",
            message: "Which managerial task would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "menuOption"
        }
    ]).then(function (answer) {
        switch (answer.menuOption) {
            case "View Products for Sale":
                viewProducts(true);
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            default:
                console.log("Invalid selection made, exiting...");
                connection.end();
        }
    });
});

function viewProducts(terminate) {
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        for (var i = 0; i < response.length; i++) {
            var item = response[i];
            console.log("ID: " + item.item_id + "\tPrice: $" + item.price + "\tQuantity: " + item.stock_quantity + "\tProduct: " + item.product_name);
        }

        if (terminate) {
            connection.end();
        }
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, response) {
        if (err) throw err;
        for (var i = 0; i < response.length; i++) {
            var item = response[i];
            console.log("ID: " + item.item_id + "\tPrice: $" + item.price + "\tQuantity: " + item.stock_quantity + "\tProduct: " + item.product_name);
        }
        connection.end();
    });
}

function addToInventory() {

    viewProducts(false);
    console.log();

    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        var inventory = [];
        var ids = [];

        for (var i = 0; i < response.length; i++) {
            inventory.push(response[i]);
            ids.push(response[i].item_id.toString());
        }

        inquirer.prompt([
            {
                type: "list",
                message: "Which item would you like to add inventory to?",
                choices: ids,
                name: "id"
            },
            {
                type: "input",
                message: "How many of this item would you like to add?",
                name: "quantityToAdd",
                validate: function validateQuantity(name) {
                    return !isNaN(name);
                }
            }
        ])
            .then(function (answers) {
                var userID = answers.id;
                var userQuantity = parseInt(answers.quantityToAdd);

                connection.query("SELECT * FROM products WHERE item_id = " + userID, function (err, response) {
                    if (err) throw err;

                    var item = response[0];

                    connection.query("UPDATE products SET ? WHERE ?",
                        [{
                            stock_quantity: item.stock_quantity + userQuantity
                        },
                        {
                            item_id: userID
                        }],
                        function (err, response) {
                            if (err) throw err;
                            console.log("You've successfully added " + userQuantity + " to " + item.product_name + "'s inventory.");

                            connection.query("SELECT stock_quantity FROM products WHERE item_id = " + userID, function (err, response) {
                                if (err) throw err;
                                console.log(item.product_name + " now has an updated quantity of " + response[0].stock_quantity);
                                connection.end();
                            })
                        });

                });
            });


    })
}

function addNewProduct() {

    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the product you'd like to add?",
            name: "name"
        },
        {
            type: "input",
            message: "What department does this product belong in?",
            name: "department"
        },
        {
            type: "input",
            message: "What is the unit price for this product?",
            name: "price",
            validate: function validateQuantity(name) {
                return !isNaN(name) && parseFloat(name) > 0;
            }
        },
        {
            type: "input",
            message: "How many would you like to add to the stock quantity?",
            name: "quantity",
            validate: function validateQuantity(name) {
                return !isNaN(name) && parseInt(name) > 0;
            }
        }
    ]).then(function (response) {

        connection.query("INSERT INTO products SET ?",
            {
                product_name: response.name,
                department_name: response.department,
                price: parseFloat(response.price).toFixed(2),
                stock_quantity: parseInt(response.quantity)
            },
            function (err, res) {
                if (err) throw err;
                console.log("You have successfully added an item.");
                connection.end();
            });

    });
}