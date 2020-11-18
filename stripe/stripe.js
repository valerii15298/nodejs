// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe/stripe')('confident_info');
const express = require('express');
const app = express();
var path = require('path');

app.get('/client.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/client.js'));
});


app.get('/secret', async (req, res) => {
    const intent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
    });
    res.json({client_secret: intent.client_secret});
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, () => {
    console.log('Running on port 3000');
});
