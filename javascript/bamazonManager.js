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


function menuOptions() {
    inquirer.prompt([
        {
            name: "selection",
            type: "list",
            message: "Which do you need?",
            choices: ["View Products for Sale", "View Low Inventory", "Add To Inventory", "Add New Product"]

        }
    ]).then(function (response) {
        if (response.selection === "View Products for Sale") {
            console.log("add to inventory");
            let query = "Select * from Products";
            connection.query(
                query,
                { title: "View Products" },
                function (err, response, fields) {
                    // let response = [];
                    // response.push(response);
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(response);
                        for (i = 0; i < response.length; i++) {
                            console.log("ID : " + response[i].id);
                            console.log("Product Name : " + response[i].product_name);
                            console.log("Department : " + response[i].department_name);
                            console.log("Price : $" + response[i].price);
                            console.log("Store Quantity : " + response[i].stock_quantity);
                            console.log("--------------------------------------------")
                        }
                    }
                }
            )
        } else if (response.selection === "View Low Inventory") {
            console.log("add to inventory");
            let query = "Select * from Products WHERE stock_quantity < 5";
            connection.query(
                query,
                { title: "View Products" },
                function (err, response, fields) {
                    // let response = [];
                    // response.push(response);
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(response);
                        for (i = 0; i < response.length; i++) {
                            console.log("ID : " + response[i].id);
                            console.log("Product Name : " + response[i].product_name);
                            console.log("Department : " + response[i].department_name);
                            console.log("Price : $" + response[i].price);
                            console.log("Store Quantity : " + response[i].stock_quantity);
                            console.log("--------------------------------------------")
                        }
                    }
                }
            )
        } else if (response.selection === "Add To Inventory") {
            console.log("add to inventory");
            inquirer.prompt([
                {
                    name: "id",
                    message: "Select an update to update its inventory",
                    type: "list",
                    choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",]
                },
                {
                    name: "newInventory",
                    message: "Set item's new inventory (E.g. Enter 50 to set item's inventory to 50)",
                    type: "input"
                }
            ]).then(function (inventoryData) {
                // console.log(inventoryData);
                let query = "UPDATE products SET stock_quantity = " + inventoryData.newInventory + " WHERE id = " + inventoryData.id;
                connection.query(
                    query,
                    { title: "View Products" },
                    function (err, response, fields) {
                        // let response = [];
                        // response.push(response);
                        if (err) {
                            console.log("error " + err);
                            menuOptions();
                        } else {
                            
                            console.log("--------------------------------------------");
                            console.log("ID : " + inventoryData.id);
                            console.log("Store Quantity : " + inventoryData.newInventory);
                            console.log("--------------------------------------------");

                        }
                        connection.end();
                    }
                )
            })

        } else if (response.selection === "Add New Product") {
            inquirer.prompt([
                {
                    name: "productName",
                    message: "Enter name of new product",
                    type: "input"
                },
                {
                    name: "departmentName",
                    message: "Enter item's department name",
                    type: "input"
                },
                {
                    name: "price",
                    message: "Set item price",
                    type: "input"
                },
                {
                    name: "quantity",
                    message: "Enter item quantity",
                    type: "input"
                }
            ]).then(function(addInvResponse){
                let query = "INSERT into products (product_name, department_name, price, stock_quantity) VALUES ('" + addInvResponse.productName + "','" + addInvResponse.departmentName + "'," + addInvResponse.price + "," + addInvResponse.quantity + ")"; 
                connection.query(
                    query,
                    {title: "New Product"},
                    function(err, resp, fields){
                        if(err){
                            console.log(err);
                        } else {
                            console.log('\n')
                            console.log("New Item Added To Your Store");
                            console.log("------------------------------");
                            console.log("Item : " + addInvResponse.productName);
                            console.log("Department : " + addInvResponse.departmentName);
                            console.log("Price : $" + addInvResponse.price);
                            console.log("Initial Quantity : " + addInvResponse.quantity);
                            
                        }
                    }
                )
            })
        } else {
            console.log("Not a valid response");
        }
    }
    )
};

menuOptions();