import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';

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

// Session middleware: lets the server remember users between requests
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

function requireLogin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}

/*
app.get('/db-test', async (req, res) => {
    try {
        const orders = await pool.query('SELECT * FROM orders');
        res.send(orders[0]);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).send('Database Error');
    }

});  
*/

app.get ('/', (req, res) => {
    res.render('home');
})

// add a confirmed route to display the confirmed page
app.get('/confirm-order', (req, res) => {
    res.render('confirm');
});

// add a route to process the icecream order form submission
app.post('/submit-order', async(req, res) => {
    try {
        const order = req.body;
        order.timestamp = new Date();

        console.log('New order submitted: ', order);

        order.toppings = Array.isArray(order.toppings) ?
            order.toppings.join(", ") : "";

        
        const sql = 
            `INSERT INTO orders(customer, email, flavor, cone, toppings, comment)
            VALUES (?, ?, ?, ?, ?, ?);`;

        const params = [
            order.name,
            order.email,
            order.flavor,
            order.cone,
            order.toppings,
            order.comments
        ];

        const [result] = await pool.execute(sql, params);

        order.id = result.insertId;
        console.log('Order saved with ID: ', order.id);

        res.render('confirm', {order});

    } catch (err) {
        console.error('Error saving order: ', err);
        res.status(500).send(`Sorry, there was an error processing your order. Please try again.`);
    }
});

app.get('/login', (req, res) => {
    res.render('login', {error : false});
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Compare the form values to the values in .env
    if (username === process.env.ADMIN_USER && 
        password === process.env.ADMIN_PASSWORD) {
        req.session.loggedIn = true;
        res.redirect('/admin');
    } else {
        res.render('login', {error : 'Invalid username or password.'});
    }
});

// Add an admin route
app.get('/admin', async (req, res) => {

    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        res.render('admin', {orders});
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).send('Database Error Occured');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})