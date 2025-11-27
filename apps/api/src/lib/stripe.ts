import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY || '';

if (!key) {
  console.warn('STRIPE_SECRET_KEY not set — stripe client will not be initialized');
}

const stripe = key ? new Stripe(key, { apiVersion: '2022-11-15' }) : null;

export default stripe;
