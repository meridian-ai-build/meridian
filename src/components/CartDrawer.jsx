import { useState } from 'react';
import { PRINT_TYPES, FRAME_OPTIONS } from '../utils/pricing';
import { POSTER_SIZES } from '../utils/posterSizes';

export default function CartDrawer({ cart, onClose, onRemove, user }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  async function handleCheckout() {
    setIsCheckingOut(true);
    setCheckoutError('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          userId: user?.id || null,
          userEmail: user?.email || null,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || 'Checkout failed. Please try again.');
        setIsCheckingOut(false);
      }
    } catch (err) {
      setCheckoutError('Network error. Please try again.');
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-96 h-full bg-[#111118] border-l border-white/[0.08] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
          <div className="flex items-baseline gap-3">
            <span className="font-playfair text-lg tracking-widest text-white">Cart</span>
            {cart.length > 0 && (
              <span className="text-[10px] text-white/30 font-inter tracking-wide">{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors text-xl leading-none p-1">×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto sidebar-scroll">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full pb-16">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20">
                  <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p className="text-white/25 text-sm font-inter">Your cart is empty</p>
              <p className="text-white/15 text-xs font-inter mt-1">Configure and add a poster to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {cart.map((item, i) => (
                <CartItem key={item.id} item={item} onRemove={() => onRemove(i)} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-white/[0.06] space-y-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-sm font-inter">Subtotal</span>
              <span className="text-white/80 font-playfair text-lg">${total}</span>
            </div>
            {checkoutError && (
              <p className="text-red-400/80 text-xs font-inter">{checkoutError}</p>
            )}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`w-full py-3 rounded text-sm font-inter font-medium tracking-wider transition-all ${
                isCheckingOut
                  ? 'bg-white/[0.05] text-white/25 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'
              }`}
            >
              {isCheckingOut ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Redirecting to checkout…
                </span>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
            <p className="text-center text-white/20 text-[10px] font-inter">
              Secure checkout via Stripe · Free returns
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CartItem({ item, onRemove }) {
  const size = POSTER_SIZES.find(s => s.id === item.sizeId);
  const printType = PRINT_TYPES.find(p => p.id === item.printType);
  const frame = FRAME_OPTIONS.find(f => f.id === item.frameId);
  const orientationLabel = item.orientation === 'landscape' ? 'Landscape' : 'Portrait';

  return (
    <div className="px-6 py-4 flex gap-4">
      {/* Mini poster thumbnail */}
      <div
        className="flex-shrink-0 rounded-sm flex items-center justify-center"
        style={{
          width: item.orientation === 'landscape' ? 52 : 40,
          height: item.orientation === 'landscape' ? 40 : 52,
          backgroundColor: item.themeColors?.posterBg ?? '#0d1117',
          border: `1px solid ${item.themeColors?.posterBorder ?? '#d4af3740'}`,
        }}
      >
        <div className="w-full h-full opacity-60 flex flex-col items-center justify-center gap-0.5 px-1">
          <div className="w-full h-px" style={{ backgroundColor: item.themeColors?.posterAccent ?? '#d4af37', opacity: 0.5 }} />
          <div className="rounded-full" style={{ width: 4, height: 4, backgroundColor: item.themeColors?.pinColor ?? '#d4af37', opacity: 0.8 }} />
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-white/80 text-sm font-inter font-medium truncate">{item.title}</p>
        <p className="text-white/35 text-[11px] font-inter mt-0.5">
          {size?.label} · {orientationLabel}
        </p>
        <p className="text-white/35 text-[11px] font-inter">{printType?.label}</p>
        {frame && frame.id !== 'none' && (
          <p className="text-white/35 text-[11px] font-inter">{frame.label} frame</p>
        )}
        <p className="text-white/30 text-[11px] font-inter mt-1">
          {item.locations.length} location{item.locations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Price + Remove */}
      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <span className="text-white/70 text-sm font-inter">${item.price}</span>
        <button
          onClick={onRemove}
          className="text-white/20 hover:text-red-400/60 text-[11px] font-inter transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
