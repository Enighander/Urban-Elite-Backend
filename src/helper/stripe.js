const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_ENV)

module.exports = stripe;