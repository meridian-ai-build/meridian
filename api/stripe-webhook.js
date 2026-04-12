const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Collect raw request body — required for Stripe signature verification
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderIds = (session.metadata?.order_ids || '').split(',').filter(Boolean);

    for (const orderId of orderIds) {
      const { error } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'paid',
          stripe_session_id: session.id,
        })
        .eq('id', orderId);

      if (error) console.error(`Failed to update order ${orderId}:`, error);
    }

    console.log(`✓ Orders paid: ${orderIds.join(', ')}`);
  }

  res.status(200).json({ received: true });
}

// Disable Vercel's default body parsing so we get the raw bytes for Stripe
handler.config = { api: { bodyParser: false } };

module.exports = handler;
