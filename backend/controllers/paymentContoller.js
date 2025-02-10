// eslint-disable-next-line no-undef
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntent(req, res) {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}