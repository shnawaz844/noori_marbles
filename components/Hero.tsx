
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image with Parallax-like effect */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000"
          alt="Premium Interior"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <span className="inline-block text-amber-500 font-semibold tracking-widest uppercase mb-4 animate-fadeIn">
            Redefining Luxury Interiors
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white font-bold leading-tight mb-6 animate-slideUp">
            Exquisite Spaces <br />
            Start With <span className="text-amber-500">Fine Selection.</span>
          </h1>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed animate-slideUp delay-200">
            From the finest Italian marbles to bespoke furniture and luxury bathroom fittings.
            Noori Marbels brings Bareilly the ultimate collection for your dream home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slideUp delay-400">
            <Link
              to="/products"
              className="px-8 py-4 bg-amber-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-amber-600 transition-all transform hover:scale-105"
            >
              Explore Collections
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-lg hover:bg-white/20 transition-all text-center"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Floating features */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:flex gap-12 text-white/80">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-serif font-bold text-amber-500">5000+</span>
          <span className="text-xs uppercase tracking-tighter">Designs Available</span>
        </div>
        <div className="w-px h-10 bg-white/20 self-center"></div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-serif font-bold text-amber-500">15+</span>
          <span className="text-xs uppercase tracking-tighter">Premium Brands</span>
        </div>
        <div className="w-px h-10 bg-white/20 self-center"></div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-serif font-bold text-amber-500">25Yrs</span>
          <span className="text-xs uppercase tracking-tighter">Of Excellence</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
