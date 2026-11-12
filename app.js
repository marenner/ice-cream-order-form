import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// Create a connection pool to the MySQL database
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

const app = express();

const PORT = 3007;

const orders = [];

app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get ('/', (req, res) => {
    res.render('home');
})

// add a confirmed route to display the confirmed page
app.get('/confirm-order', (req, res) => {
    res.render('confirm');
});

// add a route to process the icecream order form submission
app.post('/submit-order', (req, res) => {
    const order = req.body;
    order['timestamp'] = new Date();

    console.log(order);

    orders.push(order);
    console.log(orders);

    res.render('confirm', {order});
});

// Add an admin route
app.get('/admin', (req, res) => {
    res.render('admin', {orders});
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})