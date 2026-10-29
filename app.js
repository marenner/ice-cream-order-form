import express from 'express';

const app = express();

const PORT = 3001;

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

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})