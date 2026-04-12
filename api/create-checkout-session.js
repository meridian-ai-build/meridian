const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cart, userId, userEmail } = req.body;

    if (!cart?.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Determine app base URL — works for local dev, Vercel preview, and production
    const appUrl = process.env.APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    // Save each item as a pending order in Supabase
    const orderIds = [];
    for (const item of cart) {
      const { data } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: userId || null,
          title: item.title,
          poster_config: item,
          print_type: item.printType,
          frame_id: item.frameId,
          price: item.price,
          status: 'pending',
        })
        .select('id')
        .single();
      if (data?.id) orderIds.push(data.id);
    }

    // Build Stripe line items
    const lineItems = cart.map(item => {
      const printLabel = item.printType === 'digital' ? 'Digital Download' : 'Print & Ship';
      const frameLabel = item.frameId !== 'none'
        ? ` · ${item.frameId.charAt(0).toUpperCase() + item.frameId.slice(1)} frame`
        : '';
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: `${item.sizeId} ${item.orientation} poster · ${printLabel}${frameLabel}`,
          },
          unit_amount: item.price * 100, // Stripe works in cents
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
      customer_email: userEmail || undefined,
      metadata: {
        order_ids: orderIds.join(','),
        user_id: userId || '',
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = handler;
