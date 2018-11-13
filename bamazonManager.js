const mysql = require('mysql')
const inquirer = require('inquirer')
const Table = require('cli-table')
const chalk = require('chalk')

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
        startPrompt()
    })
}

//Initial options
function startPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            message: '\n\rSelect an option:',
            choices: ['View Products for Sale', 'View Low Inventory', 'Restock Inventory', 'Add New Product'],
            name: 'choice'
        }
    ]).then(answer => {
        switch (answer.choice) {
            case 'View Products for Sale':
                viewProducts()
                break
            case 'View Low Inventory':
                viewLowProduct()
                break
            case 'Restock Inventory':
                restockInventory()
                break
            case 'Add New Product':
                addNewProduct()
        }
    })
}

//Display items available for sale(id, name, price, stock quantity)
function viewProducts() {
    productArray = []
    console.log(chalk.yellow.bold('\n\r==================='))
    console.log(chalk.green.bold('\n\rCurrent Inventory'))
    connection.query("SELECT item_id, product_name, FORMAT(price, 2) price, stock_quantity FROM products", function (err, results) {
        makeTable(err, results)
        startPrompt()
    })
}

//Displays items that have quantity less then 5(id, name, price, stock quantity)
function viewLowProduct() {
    productArray = []
    console.log(chalk.yellow.bold('\n\r==================='))
    console.log(chalk.green.bold('Low Inventory Items'))
    connection.query("SELECT item_id, product_name, FORMAT(price, 2) price, stock_quantity FROM products WHERE stock_quantity < 5", function (err, results) {
        makeTable(err, results)
        startPrompt()
    })
}

//Displays Current Inventory and allows manager to order more of a product
function restockInventory() {
    productArray = []
    console.log(chalk.yellow.bold('\n\r==================='))
    console.log(chalk.green.bold('\n\rCurrent Inventory'))
    connection.query("SELECT item_id, product_name, FORMAT(price, 2) price, stock_quantity FROM products", function (err, results) {
        makeTable(err, results)
        inquirer.prompt([
            {
                type: 'input',
                message: 'Enter the id for the item you wish to order: ',
                name: 'id',
                validate: productNumberCheck
            }
        ]).then(answer => {
            let id = answer.id
            let productChoice = productArray[id - 1]
            orderQuantity(id, productChoice)
        })
    })
}

//Asks manager how many of an item they would like to order, then places it.
function orderQuantity(id, productChoice) {
    inquirer.prompt([
        {
            type: 'input',
            message: `How many ${productChoice.product_name} would you like order? `,
            name: 'quantity',
            validate: quantityNumberCheck
        }
    ]).then(answer => {
        connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [answer.quantity, productArray[id].item_id - 1], (err, results) => {
            if (err) throw err
            console.log(`Restock order placed.`)
            startPrompt()
        })
    })
}

//Allows manager to add new product to inventory
function addNewProduct() {
    productArray = []
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter name of new item: ',
            name: 'item_name',
        },
        {
            type: 'list',
            message: 'Select department item belongs to: ',
            choices: [`Bamazon Gadgets`, `Automotive`, `Men's Apparel`, `Food & Beverages`, `Pets`, `Women's Apparel`],
            name: `department`
        },
        {
            type: 'input',
            message: 'Set item to price(00.00 format): ',
            name: 'price',
            validate: priceCheck
        },
        {
            type: 'input',
            message: 'Enter item starting quantity: ',
            name: 'stock',
            validate: quantityNumberCheck
        }
    ]).then(answer => {
        let newItem = {
            name: answer.item_name,
            department: answer.department,
            price: answer.price,
            stock: answer.stock
        }
        connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES(?, ?, ?, ?)', Object.values(newItem), (err, response) => {
            if (err) throw err
            console.log(`${newItem.name} added to inventory.`)
            startPrompt()
        })
    })
}

//Converts information into formatted table
function makeTable(err, results) {
    if (err) throw err
    const table = new Table({
        head: [chalk.magenta.bold('ID'), chalk.blue.bold('Product'), chalk.blue.bold('Price'), chalk.blue.bold('Quantity')]
        , colWidths: [10, 60, 10, 10]
    })
    results.forEach(item => {
        productArray.push(item)
        table.push(
            [chalk.magenta(item.item_id), item.product_name, chalk.yellow(`$${item.price}`), chalk.yellow(item.stock_quantity)]
        )
    })
    console.log(table.toString())
    console.log(chalk.yellow.bold('\n\r==================='))
}

//Checks if number entered is valid for item selection
function productNumberCheck(value) {
    if (/^\d+$/.test(value) && value < productArray.length + 1 && value > 0) {
        return true
    }
    return chalk.red('Please enter a valid number')
}

//Checks if number is valid for order quantity
function quantityNumberCheck(value) {
    if (/^\d+$/.test(value)) {
        return true
    }
    return chalk.red('Please enter a valid number')
}

//Checks if number works as a price value
function priceCheck(value) {
    if (/(\d+\.\d{1,2})/.test(value)) {
        return true
    }
    return chalk.red('Please enter a valid number')
}
