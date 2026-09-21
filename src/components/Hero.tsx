import React, { useRef } from 'react';
import { Upload, MapPin, Plane, Hotel, Bus, Car } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Testimonials } from './Testimonials';
import { SmokeBackground } from './effects/SmokeBackground';
import { Navbar } from './layout/Navbar';

export const Hero = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePlanTripClick = () => {
    navigate("/login");
  };

  return (
    <main className="w-full bg-[#FBF6F0]">
      {/* Hero Section */}
      <section className="relative h-[700px] w-full overflow-hidden bg-[#FBF6F0]">
        {/* Background image (z-0) */}
        <img
          src="/hero-illustration.jpg"
          alt="Traveler illustration"
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] z-0"
        />

        {/* Smoke effect */}
        <SmokeBackground intensity="medium" />

        {/* Left-to-right cream gradient overlay (z-[1]) */}
        <div 
          className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-r from-[#FBF6F0] via-[#FBF6F0]/90 to-transparent"
        />

        {/* Content wrapper (z-[2]) */}
        <div className="relative z-[2] max-w-7xl mx-auto h-full flex flex-col">
          <Navbar />

          {/* Hero body */}
          <div className="flex-1 relative flex flex-col justify-center items-start px-6 pt-12 pb-16 text-left">
            
            {/* Handwritten Doodle (Hidden below lg) */}
            <div className="hidden lg:flex absolute top-12 right-12 flex-col items-center rotate-[-6deg] opacity-80">
              <span className="font-handwritten text-4xl text-[#8B1A3A] mb-2 tracking-wide">
                More Journeys More Stories
              </span>
              <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1 translate-x-12">
                <path d="M10 50 Q 50 10 110 30" stroke="#8B1A3A" strokeWidth="2" strokeDasharray="6 6" fill="none" />
                <path d="M110 30 L100 20 L105 35 Z" fill="#8B1A3A" />
              </svg>
            </div>

            <h1 className="font-display text-[clamp(40px,6vw,68px)] font-medium text-[#1a1a1a] leading-[1.1] tracking-[-0.02em] max-w-[720px] mb-6 text-left">
              Your <span className="text-[#8B1A3A] italic">Yatra</span> Beyond<br />
              Limits with Endless<br />
              Possibilities
            </h1>
            <p className="font-sans text-xl font-medium text-gray-500 leading-relaxed max-w-[500px] mb-10 text-left">
              Tell our AI where you're going and what you love. We'll create a personalized itinerary for you.
            </p>

            {/* Search Bar */}
            <div className="flex items-center w-full max-w-[701px] bg-white rounded-full p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 mt-2">
              
              <div className="flex items-center flex-1 px-4">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Where do you want to go?" 
                  className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-lg font-sans focus:ring-0"
                />
              </div>

              <div className="flex items-center gap-2 pr-1">
                <button 
                  onClick={handleUploadClick}
                  aria-label="Upload inspiration"
                  className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                </button>

                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/*,.pdf" 
                  className="hidden" 
                />

                <button 
                  onClick={handlePlanTripClick}
                  className="flex items-center px-6 py-3 bg-[#8B1A3A] hover:bg-[#6e142e] text-white rounded-full font-medium transition-colors whitespace-nowrap"
                >
                  <span className="mr-2">✦</span>
                  Plan My Trip
                  <span className="ml-2">→</span>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:flex md:items-center gap-4 mt-8 w-full max-w-[701px] bg-white/40 backdrop-blur-sm rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-white/50">
              <Link to="/dashboard/flights" className="flex items-center gap-3 flex-1 group no-underline">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Plane className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-[#8B1A3A] transition-colors">Flights</span>
                  <span className="text-xs text-gray-600">best prices & deals</span>
                </div>
              </Link>

              <div className="w-px h-10 bg-gray-300/50 hidden md:block" />

              <Link to="/dashboard/hotels" className="flex items-center gap-3 flex-1 group no-underline">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Hotel className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-[#8B1A3A] transition-colors">Hotels</span>
                  <span className="text-xs text-gray-600">comfortable stays</span>
                </div>
              </Link>

              <div className="w-px h-10 bg-gray-300/50 hidden md:block" />

              <Link to="/dashboard/buses" className="flex items-center gap-3 flex-1 group no-underline">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Bus className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-[#8B1A3A] transition-colors">Buses</span>
                  <span className="text-xs text-gray-600">safe & reliable</span>
                </div>
              </Link>

              <div className="w-px h-10 bg-gray-300/50 hidden md:block" />

              <Link to="/dashboard/auto" className="flex items-center gap-3 flex-1 group no-underline">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Car className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-[#8B1A3A] transition-colors">Taxis</span>
                  <span className="text-xs text-gray-600">one click booking</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[#8B1A3A] text-sm font-bold uppercase tracking-wider mb-2 block">Popular Destinations</span>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-gray-900">Explore the Best of India</h2>
          </div>
          <Link to="/destinations" className="inline-flex items-center px-6 py-2.5 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors mt-6 md:mt-0 whitespace-nowrap text-gray-700 no-underline">
            View All Destinations <span className="ml-2">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'goa', name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop' },
            { id: 'delhi', name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop' },
            { id: 'mumbai', name: 'Mumbai', image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?q=80&w=600&auto=format&fit=crop' },
            { id: 'jaipur', name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600&auto=format&fit=crop' }
          ].map(dest => (
            <Link key={dest.id} to={`/destinations/${dest.id}`} className="group relative h-[400px] rounded-3xl overflow-hidden shadow-sm no-underline block">
              <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <h3 className="absolute bottom-6 left-6 text-2xl font-display text-white font-medium">{dest.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </main>
  );
};
