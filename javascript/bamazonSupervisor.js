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

function supervisorOptions() {
    inquirer.prompt([
        {
            name: "selection",
            type: "list",
            message: "Which do you need?",
            choices: ["View Product Sales by Department", "Create New Department"]

        }
    ]).then(function (response) {
        var spvChoice = response.selection;
        console.log(spvChoice);
        if (spvChoice === "View Product Sales by Department") {
            console.log("DEPARTMENT CATALOG");
            console.log('\n');

            let query = "SELECT SUM(p.product_sales), d.department_id, d.department_name, SUM(p.product_sales - d.over_head_costs) AS Department_Profits FROM products p JOIN departments d on p.department_name = d.department_name GROUP BY d.department_id, d.department_name";
            connection.query(
                query,
                { title: "View Products" },
                function (err, response, fields) {
                    // let response = [];
                    // response.push(response)
                    if (err) {
                        console.log("Error : " + err);
                    } else {
                        
                        for (i = 0; i < response.length; i++) {
                            let re = response;

                            console.log("ID : " + re[i].department_id);
                            console.log("Department Name : " + re[i].department_name);
                            console.log("Overhead Cost : $" + JSON.stringify(re[i].over_head_costs));
                            console.log("Product Sales : $" + JSON.stringify(re[i].product_sales));
                            console.log("Total Profit : " + JSON.stringify(re));
                            console.log("--------------------------------------------");
                        }
                    }
                }
            )
        }
    })
};

supervisorOptions();