// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
let stripe = Stripe('key');
let elements = stripe.elements();

// Set up Stripe.js and Elements to use in checkout form
let style = {
    base: {
        color: "#32325d",
    }
};

let card = elements.create("card", {style: style});
card.mount("#card-element");

card.addEventListener('change', ({error}) => {
    const displayError = document.getElementById('card-errors');
    if (error) {
        displayError.textContent = error.message;
    } else {
        displayError.textContent = '';
    }
});

let form = document.getElementById('payment-form');

form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    (async () => {
        const response = await fetch('/secret');
        const {client_secret: clientSecret} = await response.json();
        stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: 'Jenny Rosen'
                }
            }
        }).then(function (result) {
            if (result.error) {
                // Show error to your customer (e.g., insufficient funds)
                console.log(result.error.message);
            } else {
                // The payment has been processed!
                if (result.paymentIntent.status === 'succeeded') {
                    console.log("Success!");
                }
            }
        });
    })();
});
