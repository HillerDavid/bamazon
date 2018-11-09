const mysql = require('mysql')
const inquirer = require('inquirer')
const Table = require('cli-table')
const chalk = require('chalk')

//Global array to store product objects
let productArray = []

//Database connection
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hambone7&',
    port: 3306,
    database: 'bamazon'
})

start()

//Connect to Database
function start() {
    connection.connect(err => {
        if (err) throw err
        displayProducts()
    })
}

//Display items available for sale(id, name, price)
function displayProducts() {
    connection.query("SELECT item_id, product_name, FORMAT(price, 2) price, stock_quantity FROM products WHERE stock_quantity > 0", function (err, results) {
        if (err) throw err
        const table = new Table({
            head: [chalk.blue('ID'), chalk.green('Product'), chalk.yellow('Price')]
            , colWidths: [10, 60, 10]
        })
        results.forEach(item => {
            productArray.push(item)
            table.push(
                [item.item_id, item.product_name, item.price]
            )
        })
        console.log(table.toString())
        userPrompt()
    })
}

//Find out what user wants to purchase
function userPrompt() {

    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter ID of product you would like to purchase: ',
            name: 'id',
            validate: requireNumber
        }
    ]).then(answer => {
        let id = answer.id
        let productChoice = productArray[id - 1]
        orderQuantity(id, productChoice)
    })
}

//Function to test appropriate value is entered
function requireNumber(value) {
    if (/^\d+$/.test(value)) {
        return true
    }
    return `Please enter a number`
}

//Find out how many of the item the user wants to purchase
function orderQuantity(id, productChoice) {
    inquirer.prompt([
        {
            type: 'input',
            message: `How many ${productChoice.product_name} would you like to purchase? `,
            name: 'quantity',
            validate: requireNumber
        }
    ]).then(answer => {
        //If stock is less than quantity requested inform user insufficient quantity available
        if (productChoice.stock_quantity < answer.quantity) {
            console.log('Insufficient quantity!')
            orderMorePrompt()
        }
        //If stock is more or = to quantity requested update stock in database and display total cost of purchase
        else {
            let totalCost = productChoice.price * answer.quantity
            connection.query(`UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?`, [answer.quantity, productArray[id].item_id - 1], function (err, results) {
                if (err) throw err
                console.log(`Total cost: $${totalCost.toFixed(2)}`)
                orderMorePrompt() 
            })
        }
    })
}

//Determine if user wants to order another product
function orderMorePrompt() {
    inquirer.prompt([
        {
            type: 'confirm',
            message: '\r\nWould you like to place another order?',
            name: 'confirm'
        }
    ]).then(answer => {
        if (answer.confirm) {
            displayProducts()
        } else {
            connection.end()
        }
    })
}