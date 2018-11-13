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

//Display items available for sale(id, name, price, stock quantity)
function displayProducts() {
    productArray = []
    console.log(chalk.green.bold('Welcome to Bamazon!'))
    connection.query("SELECT item_id, product_name, FORMAT(price, 2) price, stock_quantity FROM products WHERE stock_quantity > 0", function (err, results) {
        if (err) throw err
        const table = new Table({
            head: [chalk.magenta.bold('ID'), chalk.blue.bold('Product'), chalk.blue.bold('Price')]
            , colWidths: [10, 60, 10]
        })
        results.forEach(item => {
            productArray.push(item)
            table.push(
                [chalk.magenta(item.item_id), item.product_name, chalk.yellow(`$${item.price}`)]
            )
        })
        console.log(table.toString())
        userPrompt()
    })
}

//Function to test appropriate value is entered for product number
function productNumberCheck(value) {
    if (/^\d+$/.test(value) && value < productArray.length + 1 && value > 0) {
        return true
    }
    return chalk.red('Please enter a valid number')
}

//Function to test appropriate value is entered for quantity
function quantityNumberCheck(value) {
    if (/^\d+$/.test(value)) {
        return true
    }
    return chalk.red('Please enter a valid number')
}

//Find out what user wants to purchase
function userPrompt() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter ID of product you would like to purchase: ',
            name: 'id',
            validate: productNumberCheck
        }
    ]).then(answer => {
        let id = answer.id
        let productChoice = productArray[id - 1]
        orderQuantity(id, productChoice)
    })
}

//Find out how many of the item the user wants to purchase
function orderQuantity(id, productChoice) {
    inquirer.prompt([
        {
            type: 'input',
            message: `How many ${productChoice.product_name} would you like to purchase? `,
            name: 'quantity',
            validate: quantityNumberCheck
        }
    ]).then(answer => {
        //If stock is less than quantity requested inform user insufficient quantity available
        if (productChoice.stock_quantity < answer.quantity) {
            console.log('Insufficient quantity!')
            orderMorePrompt()
        }
        //If stock is greater than = to quantity requested update stock in database and display total cost of purchase
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
            console.log(chalk.red('Shutting down Bamazon.'))
            connection.end()
        }
    })
}