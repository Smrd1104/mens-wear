import express from 'express';
import Subscription from '../models/subscription.js'; // Make sure path and casing matches

const subscriptionRouter = express.Router();

// POST /api/subscribe
subscriptionRouter.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Invalid email' });
  }

  try {
    const existing = await Subscription.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Already subscribed' });
    }

    const newSubscription = new Subscription({ email });
    await newSubscription.save();

    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

export default subscriptionRouter;
