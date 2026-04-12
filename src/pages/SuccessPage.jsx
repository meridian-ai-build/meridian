import { Link } from 'react-router-dom';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0c0c12] flex items-center justify-center p-8">
      {/* Subtle dot grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative text-center max-w-md">
        {/* Check icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-8">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="mb-2 text-[10px] tracking-[0.3em] text-white/30 font-inter uppercase">
          Order Confirmed
        </div>
        <h1 className="font-playfair text-4xl text-white mb-4">
          Thank You
        </h1>
        <p className="text-white/40 font-inter text-sm leading-relaxed mb-10">
          Your order has been placed successfully. You'll receive a confirmation
          email with your order details shortly.
        </p>

        <div className="h-px bg-white/[0.06] mb-10" />

        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full py-3 bg-white text-black rounded font-inter text-sm font-medium tracking-wider hover:bg-white/90 transition-all active:scale-[0.98]"
          >
            Create Another Poster
          </Link>
          <p className="text-white/20 text-xs font-inter">
            Questions? Email us at{' '}
            <a href="mailto:hello@meridianposterstudio.com" className="text-white/40 hover:text-white/60 transition-colors">
              hello@meridianposterstudio.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
