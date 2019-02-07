// requirer npm package 'inquirer'
var inquirer = require('inquirer');
// requirer npm package 'mysql'
var mysql = require('mysql');


var id = "";
var quantity = 0;

// Enter MySQL credentials to desired DB
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot1',
    database: 'bamazon'
});

// Establish MySQL Connection 
connection.connect(function (err) {
    if (err) {
        console.error("Error Connecting: " + err.stack);
        return;
    } else {
        console.log("Connection Successful");
    }
    console.log('connected as id ' + connection.threadId);

});

connection.query('select * from products', { title: 'test' }, function (error, results) {
    if (error) throw error;
    var arr = [];
    arr.push(results);

    console.log("\nID\tITEM\t\tPRICE\n");
    // console.log(fields);
    for (i = 0; i < results.length; i++) {
        console.log(results[i].id + "\t" + results[i].product_name + "\t" + "$" + results[i].price);
        console.log("-------------------------------");
    };
    takeOrder();
});


function checkInventory(id, quantity) {
    var stock_quantity = "SELECT stock_quantity FROM products WHERE id = " + id;

    connection.query(
        stock_quantity,
        { title: 'SufficientInventory' },
        function (err, results, fields) {
            let qtyChecker = results[0].stock_quantity - quantity;
            if (qtyChecker > 0) {
                console.log("Inventory is sufficient for order? : Yes");
                orderSuccess(id, quantity);
            }
            else if (qtyChecker < 0) {
                console.log("We currently have " + results[0].stock_quantity + " left in stock.  Please select a new quantity");
                takeOrder();
            }
            else {
                console.log("Check Inventory Error: " + err);
            }
        }
    );
};

function takeOrder() {

    inquirer.prompt([
        {
            name: "id",
            message: "Enter ID of the item you want to buy",
            type: "input"
        },
        {
            name: "quantity",
            message: "How many of this item do you want?",
            type: "input"
        }
    ]).then(function (response) {
        id = response.id;
        quantity = response.quantity;
        console.log("Item ID : " + id);
        console.log("Quantity selected for purchase : " + quantity);

        checkInventory(id, quantity);

    })
};

function orderSuccess(id, quantity) {
    var update = "UPDATE products SET stock_quantity = stock_quantity - " + quantity + " WHERE id = " + id;
    
    connection.query(
        update,
        { title: 'NewInventory' },
        function (err, results, fields) {
            if (err) {
                console.log("Error: " + err);
            } else {
                console.log("Order placed successfully! Thank you for shopping with us!")
                productSales(id, quantity);
            }
        }
    );
};

function productSales(id, quantity) {
    var total = "UPDATE products SET product_sales = + product_sales + price * " + quantity + " WHERE id = " + id;

    connection.query(
        total,
        { title: 'NewInventory' },
        function (err, results, fields) {
            if (err) {
                console.log("Error: " + err);
            } else {
                // console.log("Total Sales = " + JSON.stringify(results.message));
            }
        }
    );
    connection.end();
};




