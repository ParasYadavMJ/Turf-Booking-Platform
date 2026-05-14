/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  LogOut, 
  ChevronRight, 
  Star,
  Activity,
  History,
  X,
  Filter,
  Check,
  RotateCcw,
  ChevronDown,
  ArrowLeft,
  ShieldCheck,
  Droplets,
  Zap,
  Quote,
  Users,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Menu,
  Car,
  Wifi,
  Coffee,
  ShowerHead,
  Shirt
} from 'lucide-react';
import { auth, signInWithGoogle, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, getDocs, doc, setDoc, getDoc, addDoc, serverTimestamp, orderBy, where } from 'firebase/firestore';
import { seedTurfs, INITIAL_TURFS } from './seed';
import { Turf, Booking, UserProfile } from './types';

// Components
const Navbar = ({ user, onLogin, onLogout, setView }: any) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="bg-brand p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6 text-dark" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">TURFTOWN</span>
        </div>
        
        <div className="flex items-center gap-4 lg:gap-6">
          <button 
            onClick={() => setView('home')}
            className="hidden md:block text-sm font-medium hover:text-brand transition-colors"
          >
            Explore
          </button>
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => setView('bookings')}
                className="flex items-center gap-2 text-sm font-medium hover:text-brand transition-colors"
              >
                <History className="w-4 h-4" />
                My Bookings
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                 <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-white/20" />
                 <button onClick={onLogout} className="text-white/60 hover:text-white transition-colors">
                   <LogOut className="w-5 h-5" />
                 </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="hidden md:block bg-white text-dark px-6 py-2 rounded-full font-bold hover:bg-brand transition-all active:scale-95"
            >
              Login
            </button>
          )}

          {/* Hamburger Menu Toggle */}
          <button 
            onClick={() => setMenuOpen(true)}
            className="bg-surface border border-white/10 p-2 rounded-lg hover:border-brand hover:text-brand transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Fullscreen Mobile/Hamburger Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-dark flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-2">
                <div className="bg-brand p-1.5 rounded-lg">
                  <Trophy className="w-6 h-6 text-dark" />
                </div>
                <span className="font-display text-2xl font-bold tracking-tight">TURFTOWN</span>
              </div>
              <button 
                onClick={() => setMenuOpen(false)}
                className="bg-surface border border-white/10 p-2 rounded-lg hover:bg-white/5 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6 text-2xl font-display font-medium px-4">
              <button 
                onClick={() => { setView('home'); setMenuOpen(false); }}
                className="text-left hover:text-brand transition-colors flex items-center justify-between group"
              >
                Explore <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              {user && (
                <button 
                  onClick={() => { setView('bookings'); setMenuOpen(false); }}
                  className="text-left hover:text-brand transition-colors flex items-center justify-between group"
                >
                  My Bookings <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
              <div className="w-full h-px bg-white/10 my-2" />
              <button onClick={() => { setView('about'); setMenuOpen(false); }} className="text-left text-white/60 hover:text-white transition-colors">About Us</button>
              <button onClick={() => { setView('contact'); setMenuOpen(false); }} className="text-left text-white/60 hover:text-white transition-colors">Contact</button>
              <button onClick={() => { setView('safety'); setMenuOpen(false); }} className="text-left text-white/60 hover:text-white transition-colors">Safety Guidelines</button>
              <button onClick={() => { setView('partner'); setMenuOpen(false); }} className="text-left text-white/60 hover:text-white transition-colors">Partner with Us</button>

              <div className="flex-1" />

              {!user ? (
                <button 
                  onClick={() => { onLogin(); setMenuOpen(false); }}
                  className="bg-brand text-dark w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm mt-8"
                >
                  Sign In / Register
                </button>
              ) : (
                <button 
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                  className="bg-surface border border-white/10 text-white w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm mt-8 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HeroSlideshow = ({ turfs, onSelectTurf }: { turfs: Turf[], onSelectTurf?: (t: Turf) => void }) => {
  const [index, setIndex] = useState(0);
  const slides = turfs.slice(0, 5);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const current = slides[index];

  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full mt-24 mb-16 rounded-[2rem] overflow-hidden border border-white/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img src={current.imageUrls[0]} alt={current.name} className="w-full h-full object-cover grayscale-[0.2]" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-transparent to-transparent" />
          
          <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end max-w-3xl">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex gap-2">
                {current.sports.map(s => (
                  <span key={s} className="px-3 py-1 bg-brand text-dark text-xs font-bold rounded-lg uppercase tracking-wider">{s}</span>
                ))}
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-lg uppercase tracking-wider">₹{current.pricePerHour}/hr</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.9] uppercase italic tracking-tighter">
                {current.name}
              </h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                {current.description}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <button 
                  onClick={() => onSelectTurf?.(current)}
                  className="bg-brand text-dark px-8 py-4 rounded-full font-bold hover:scale-105 transition-all"
                >
                  Book Slot Now
                </button>
                <div className="flex items-center gap-2 text-white/40 font-mono text-sm">
                  <Star className="w-4 h-4 text-brand fill-brand" />
                  {current.rating} Rating
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 right-8 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-12 bg-white' : 'w-4 bg-white/20'}`}
          />
        ))}
      </div>
    </section>
  );
};

const FeaturedSlideshow = ({ turfs, onSelectTurf }: { turfs: Turf[], onSelectTurf?: (t: Turf) => void }) => {
  const [index, setIndex] = useState(0);
  const featured = turfs.slice(0, 4);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const current = featured[index];

  return (
    <div className="mt-12 space-y-4 cursor-pointer" onClick={() => onSelectTurf?.(current)}>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand italic">Featured Pitches</h3>
      <div className="relative h-[340px] w-full rounded-2xl overflow-hidden bg-surface border border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute inset-0"
          >
            <div className="relative h-full w-full">
              <img src={current.imageUrls[0]} alt={current.name} className="h-full w-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 space-y-3">
                <div className="flex gap-1">
                  {current.sports.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-brand text-dark text-[8px] font-bold rounded uppercase">{s}</span>
                  ))}
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg leading-tight">{current.name}</h4>
                  <div className="flex items-center gap-2 text-white/40 text-[10px] mt-1">
                    <MapPin className="w-3 h-3" />
                    {current.pitchArea || "N/A"} Area
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 line-through">₹{current.originalPrice || current.pricePerHour + 400}</span>
                    <span className="text-lg font-mono font-bold text-brand">₹{current.pricePerHour}</span>
                  </div>
                  <div className="text-[10px] font-bold text-brand/60 uppercase tracking-tighter">
                    Best for {current.sports[0]}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Indicators */}
        <div className="absolute top-4 right-4 flex gap-1 z-10">
          {featured.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-4 bg-brand' : 'w-1 bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FilterSidebar = ({ 
  amenities, 
  priceRange, 
  setPriceRange, 
  selectedAmenities, 
  setSelectedAmenities,
  resetFilters,
  turfs,
  onSelectTurf
}: any) => (
  <div className="w-full lg:w-72 flex-shrink-0 space-y-8">
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Price Range (₹)</h3>
      <div className="px-2">
        <input 
          type="range" 
          min="0" 
          max="5000" 
          step="100"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full accent-brand bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2 text-xs font-mono text-white/40">
          <span>₹{priceRange[0]}</span>
          <span className="text-brand">Up to ₹{priceRange[1]}</span>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Amenities</h3>
      <div className="flex flex-wrap gap-2">
        {amenities.map((amenity: string) => (
          <button 
            key={amenity}
            onClick={() => {
              if (selectedAmenities.includes(amenity)) {
                setSelectedAmenities(selectedAmenities.filter((a: string) => a !== amenity));
              } else {
                setSelectedAmenities([...selectedAmenities, amenity]);
              }
            }}
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${selectedAmenities.includes(amenity) ? 'bg-brand text-dark border-brand' : 'bg-surface border-white/5 text-white/40 hover:border-white/10'}`}
          >
            {amenity}
          </button>
        ))}
      </div>
    </div>

    <button 
      onClick={resetFilters}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-dashed border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all text-sm font-bold"
    >
      <RotateCcw className="w-4 h-4" />
      Reset All Filters
    </button>

    {/* Featured Slideshow replaces the previous whitespace/rect area */}
    <FeaturedSlideshow turfs={turfs} onSelectTurf={onSelectTurf} />
  </div>
);

const getAmenityIcon = (amenity: string) => {
  const am = amenity.toLowerCase();
  if (am.includes('light') || am.includes('flood')) return <Zap className="w-5 h-5 text-brand" />;
  if (am.includes('park') || am.includes('car')) return <Car className="w-5 h-5 text-brand" />;
  if (am.includes('shower')) return <ShowerHead className="w-5 h-5 text-brand" />;
  if (am.includes('chang') || am.includes('room')) return (
    <div className="flex -space-x-1">
      <Shirt className="w-5 h-5 text-brand fill-brand" />
      <Shirt className="w-5 h-5 text-brand" />
    </div>
  );
  if (am.includes('water') || am.includes('cool')) return <Droplets className="w-5 h-5 text-brand" />;
  if (am.includes('cafe') || am.includes('food') || am.includes('refresh')) return <Coffee className="w-5 h-5 text-brand" />;
  if (am.includes('wifi') || am.includes('internet')) return <Wifi className="w-5 h-5 text-brand" />;
  if (am.includes('aid') || am.includes('medic') || am.includes('safety')) return <ShieldCheck className="w-5 h-5 text-brand" />;
  return <Check className="w-5 h-5 text-brand" />;
};

const TurfDetail = ({ turf, user, onBack, onBookingSuccess, onLogin }: { turf: Turf, user: any, onBack: () => void, onBookingSuccess: () => void, onLogin: () => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedImage, setSelectedImage] = useState(turf.imageUrls[0]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Explore
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Gallery Section */}
        <div className="space-y-4">
          <motion.div 
            layoutId={`turf-img-${turf.id}`}
            className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10"
          >
            <img src={selectedImage} alt={turf.name} className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {turf.imageUrls.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-brand' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={img} alt={`${turf.name} ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {turf.sports.map(sport => (
                <span key={sport} className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {sport}
                </span>
              ))}
              <div className="ml-auto bg-white/5 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <Star className="w-3 h-3 text-brand fill-brand" />
                {turf.rating}
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">{turf.name}</h1>
            <div className="flex items-center gap-2 text-white/40">
              <MapPin className="w-4 h-4" />
              {turf.location}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-surface border border-white/10 rounded-2xl gap-4">
            <div>
              <div className="text-xs text-white/40 mb-1 uppercase tracking-widest font-bold">Standard Rate</div>
              <div className="flex flex-row items-baseline gap-3">
                <span className="text-2xl font-mono font-bold text-white/40 line-through decoration-red-500 w-fit">₹{turf.originalPrice || turf.pricePerHour + 400}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-mono font-bold text-brand">₹{turf.pricePerHour}</span>
                  <span className="text-white/40 text-sm">/ hour</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                if (user) setShowBookingModal(true);
                else onLogin();
              }}
              className="w-full sm:w-auto whitespace-nowrap bg-brand text-dark px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,0,0.2)] text-center flex-shrink-0"
            >
              Book This Pitch
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand mb-4">Description</h3>
            <p className="text-white/70 leading-relaxed">
              {turf.description || "Experience top-tier sports facilities at this premier location. Our pitch is maintained with the highest standards to ensure the best playing experience for athletes of all levels."}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Included Amenities</h3>
            <div className="grid grid-cols-2 gap-4">
              {turf.amenities.map(amenity => (
                <div key={amenity} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                    {getAmenityIcon(amenity)}
                  </div>
                  <span className="text-sm font-medium text-white/80">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Community Uploads</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
              {[
                {
                  id: 1,
                  name: "Rohan & Squad",
                  image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop",
                  avatar: "https://i.pravatar.cc/150?u=r1"
                },
                {
                  id: 2,
                  name: "Mumbai FC",
                  image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=600&auto=format&fit=crop",
                  avatar: "https://i.pravatar.cc/150?u=m2"
                },
                {
                  id: 3,
                  name: "Weekend Warriors",
                  image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=600&auto=format&fit=crop",
                  avatar: "https://i.pravatar.cc/150?u=w3"
                }
              ].map(post => (
                <div key={post.id} className="min-w-[280px] sm:min-w-[320px] snap-center rounded-2xl overflow-hidden bg-surface border border-white/10 shrink-0">
                  <div className="h-48 w-full relative">
                    <img src={post.image} alt={post.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex items-center gap-3">
                    <img src={post.avatar} alt={post.name} className="w-10 h-10 rounded-full border border-white/20" />
                    <span className="font-medium text-white/90">{post.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Location</h3>
            <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-white/10 relative bg-white/5">
              <iframe
                title="Google Maps Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(turf.name + ' ' + turf.location)}&output=embed`}
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showBookingModal && (
          <BookingModal 
            turf={turf}
            user={user}
            onClose={() => setShowBookingModal(false)}
            onBookingSuccess={onBookingSuccess}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AboutSection = () => (
  <section className="py-24 border-t border-white/5">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-6">
        <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
          REDEFINING THE <span className="text-brand">GRASSROOTS</span> GAME.
        </h2>
        <p className="text-lg text-white/60 leading-relaxed">
          TurfTown was born from a simple frustration: it shouldn't be harder to book a pitch than it is to play the game. 
          We've built a ecosystem that connects athletes with the highest quality sports facilities in the city.
        </p>
        <div className="grid grid-cols-2 gap-8 pt-6">
          <div>
            <div className="text-3xl font-mono font-bold text-brand mb-1">50+</div>
            <div className="text-xs uppercase tracking-widest text-white/40 font-bold">Premium Turfs</div>
          </div>
          <div>
            <div className="text-3xl font-mono font-bold text-brand mb-1">10k+</div>
            <div className="text-xs uppercase tracking-widest text-white/40 font-bold">Active Players</div>
          </div>
        </div>
      </div>
      <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group">
        <img 
          src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=1200" 
          alt="Sports Action" 
          className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-brand/10 mix-blend-overlay" />
      </div>
    </div>
  </section>
);

const WhyTurfTown = () => {
  const perks = [
    { 
      icon: <Zap className="w-6 h-6" />, 
      title: "Instant Confirmation", 
      desc: "No more waiting for callbacks. Book your slot in 30 seconds." 
    },
    { 
      icon: <Droplets className="w-6 h-6" />, 
      title: "Pro-Grade Surfaces", 
      desc: "We only partner with turfs that meet our strict quality standards." 
    },
    { 
      icon: <Users className="w-6 h-6" />, 
      title: "Community Events", 
      desc: "Join weekly league matches and connect with fellow enthusiasts." 
    }
  ];

  return (
    <section className="py-24 border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="font-display text-4xl font-bold mb-4 uppercase tracking-tighter italic">Why Champions Choose Us</h2>
        <p className="text-white/40">The difference is in the details. We prioritize your playing experience over everything else.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {perks.map((perk, i) => (
          <div key={i} className="p-8 bg-surface border border-white/5 rounded-3xl hover:border-brand/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-6 group-hover:scale-110 transition-transform">
              {perk.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{perk.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{perk.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const FoundersSection = () => (
  <section className="py-24 border-t border-white/5">
    <h2 className="font-display text-3xl font-bold mb-12 text-center uppercase">Meet the Captains</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
      {[
        { 
          name: "Arjun Mehra", 
          role: "CEO & Striker", 
          img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
          bio: "National level footballer with a vision to digitize every sports ground in India."
        },
        { 
          name: "Priya Sharma", 
          role: "COO & All-rounder", 
          img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
          bio: "Ex-tech lead and cricket enthusiast obsessed with seamless user experiences."
        }
      ].map((founder, i) => (
        <div key={i} className="flex items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-3xl">
          <img src={founder.img} alt={founder.name} className="w-24 h-24 rounded-2xl object-cover grayscale" />
          <div>
            <h4 className="font-bold text-lg mb-1">{founder.name}</h4>
            <div className="text-brand text-xs font-mono mb-2">{founder.role}</div>
            <p className="text-xs text-white/50 leading-relaxed italic">"{founder.bio}"</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Footer = ({ setView }: { setView: (v: string) => void }) => (
  <footer className="mt-24 pt-24 pb-12 border-t border-white/10">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-brand" />
          <span className="font-display text-xl font-bold tracking-tight">TURFTOWN</span>
        </div>
        <p className="text-white/40 text-sm leading-relaxed">
          Book your victory. The premier platform for sports facility management and discovery.
        </p>
        <div className="flex gap-4">
          {[Instagram, Twitter, Facebook].map((Icon, i) => (
            <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand hover:text-dark transition-all">
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-brand">Quick Links</h4>
        <ul className="space-y-4 text-white/50 text-sm">
          <li><button onClick={() => setView('home')} className="hover:text-white transition-colors">Explore Turfs</button></li>
          <li><button onClick={() => setView('about')} className="hover:text-white transition-colors">About Us</button></li>
          <li><button onClick={() => setView('partner')} className="hover:text-white transition-colors">Partner with Us</button></li>
          <li><button onClick={() => setView('safety')} className="hover:text-white transition-colors">Safety Guidelines</button></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-brand">Support</h4>
        <ul className="space-y-4 text-white/50 text-sm">
          <li><button onClick={() => setView('contact')} className="hover:text-white transition-colors">Contact</button></li>
          <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-brand">Contact</h4>
        <ul className="space-y-4 text-white/50 text-sm">
          <li className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            hello@turftown.com
          </li>
          <li className="flex items-center gap-2 leading-relaxed">
            <MapPin className="w-4 h-4" />
            104, Victory Tower, Sports Enclave, New Delhi
          </li>
        </ul>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-[10px] font-mono tracking-widest uppercase">
      <div>© 2024 TURFTOWN INTL. ALL RIGHTS RESERVED.</div>
      <div className="flex gap-6">
        <span>EST. 2024</span>
        <span>MADE IN INDIA</span>
      </div>
    </div>
  </footer>
);

const CricketLoader = () => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    {/* Ball */}
    <motion.div 
      className="absolute w-4 h-4 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] z-20"
      animate={{ 
        x: [-60, 20, 150],
        y: [0, 0, -20],
        opacity: [0, 1, 0],
        scale: [0.8, 1, 1.2]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        times: [0, 0.4, 1],
        ease: "easeOut" 
      }}
    />
    
    {/* Bat */}
    <motion.div 
      className="relative w-3 h-16 bg-[#D2B48C] rounded-sm origin-top"
      animate={{ 
        rotate: [0, -45, 90, 0]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        times: [0, 0.2, 0.4, 1],
        ease: "easeInOut"
      }}
    >
      {/* Handle */}
      <div className="absolute -top-6 left-0 w-full h-6 bg-black rounded-t-full border-b border-white/20" />
      {/* Bat Texture Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
    </motion.div>

    {/* Impact Effect */}
    <motion.div 
      className="absolute w-8 h-8 rounded-full border-2 border-brand"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 2],
        opacity: [0, 0.5, 0]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        at: 0.4, // Match impact timing
        times: [0, 0.4, 0.6]
      }}
    />
  </div>
);

const TurfCard = ({ turf, onClick }: { turf: Turf, onClick: () => void }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8 }}
    className="bg-surface border border-white/10 rounded-2xl overflow-hidden cursor-pointer group"
    onClick={onClick}
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={turf.imageUrls[0]} 
        alt={turf.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
      />
      <div className="absolute top-4 left-4 flex gap-2">
        {turf.sports.map(sport => (
          <span key={sport} className="bg-brand text-dark px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {sport}
          </span>
        ))}
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
         <div className="bg-dark/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-xs flex items-center gap-1">
            <Star className="w-3 h-3 text-brand fill-brand" />
            {turf.rating}
         </div>
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-display text-xl font-bold mb-1">{turf.name}</h3>
      <div className="flex items-center gap-1 text-white/60 text-sm mb-4">
        <MapPin className="w-4 h-4" />
        {turf.location}
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <div>
          <span className="text-2xl font-mono font-bold text-brand">₹{turf.pricePerHour}</span>
          <span className="text-white/40 text-xs ml-1">/ hour</span>
        </div>
        <button className="bg-white/5 hover:bg-brand hover:text-dark px-4 py-2 rounded-lg text-sm font-bold transition-all">
          Book Now
        </button>
      </div>
    </div>
  </motion.div>
);

const BookingModal = ({ turf, user, onClose, onBookingSuccess }: { turf: Turf, user: any, onClose: () => void, onBookingSuccess: () => void }) => {
  const [selectedSport, setSelectedSport] = useState(turf.sports[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const slots = ["06:00 AM", "07:00 AM", "08:00 AM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"];

  const handleBook = async () => {
    if (!selectedSlot || !user) return;
    setLoading(true);
    const path = 'bookings';
    try {
      const bookingData = {
        userId: user.uid,
        turfId: turf.id,
        turfName: turf.name,
        sport: selectedSport,
        startTime: `${date} ${selectedSlot}`,
        endTime: `${date} ${selectedSlot}`, // Simplified for demo
        totalPrice: turf.pricePerHour,
        status: 'confirmed',
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, path), bookingData);
      onBookingSuccess();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark/95 backdrop-blur-xl"
    >
       <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-surface border border-white/10 p-8 rounded-3xl max-w-lg w-full relative"
       >
          <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          
          <h2 className="font-display text-3xl font-bold mb-6">Booking Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-brand mb-2 block">Select Sport</label>
              <div className="flex gap-3">
                {turf.sports.map(sport => (
                  <button 
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${selectedSport === sport ? 'bg-brand text-dark border-brand shadow-[0_0_20px_rgba(0,255,0,0.3)]' : 'border-white/10 hover:border-white/20'}`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-brand mb-2 block">Date</label>
              <input 
                type="date" 
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-brand mb-2 block">Choose Slot</label>
              <div className="grid grid-cols-4 gap-2">
                {slots.map(slot => (
                  <button 
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 rounded-lg text-[10px] font-mono font-bold border transition-all ${selectedSlot === slot ? 'bg-brand text-dark border-brand' : 'border-white/5 hover:border-white/10'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
               <div className="flex justify-between items-center mb-6">
                  <span className="text-white/60">Total Cost</span>
                  <span className="text-2xl font-mono font-bold text-brand">₹{turf.pricePerHour}</span>
               </div>
               <button 
                onClick={handleBook}
                disabled={!selectedSlot || loading}
                className="w-full bg-white text-dark py-4 rounded-2xl font-bold text-lg hover:bg-brand transition-all active:scale-[0.98] disabled:opacity-50"
               >
                 {loading ? 'Processing...' : 'Confirm Booking'}
               </button>
            </div>
          </div>
       </motion.div>
    </motion.div>
  );
};

const SimplePage = ({ title, children }: any) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-24 px-6 relative z-10"
    >
      <div className="mb-12">
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">{title}</h1>
        <div className="w-24 h-1 bg-brand"></div>
      </div>
      <div className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
};

const AboutPage = () => (
  <SimplePage title="ABOUT US">
    <p>TurfTown was born out of a simple necessity: finding a good place to play should not be harder than the game itself.</p>
    <p>We believe in the power of sports to bring people together. Whether you are a weekend warrior or training for the leagues, we provide an ecosystem that connects athletes with the highest quality sports facilities.</p>
  </SimplePage>
);

const ContactPage = () => (
  <SimplePage title="CONTACT">
    <div className="grid md:grid-cols-2 gap-12 text-base">
      <div>
        <h3 className="text-xl font-bold mb-4 text-brand uppercase tracking-widest text-sm">Get in Touch</h3>
        <p className="text-white/70 mb-8">Have questions about a booking or want to report an issue? We're here to help.</p>
        <div className="space-y-4">
          <p className="flex items-center gap-3 text-white/50"><strong className="text-white">Email:</strong> support@turftown.app</p>
          <p className="flex items-center gap-3 text-white/50"><strong className="text-white">Phone:</strong> +91 98765 43210</p>
          <p className="flex items-center gap-3 text-white/50"><strong className="text-white">Address:</strong> TurfTown HQ, Sports Complex, Mumbai</p>
        </div>
      </div>
      <div className="bg-surface p-8 rounded-2xl border border-white/10 flex items-center justify-center">
        <p className="text-white/40 italic text-center">Contact form integration coming soon.</p>
      </div>
    </div>
  </SimplePage>
);

const SafetyPage = () => (
  <SimplePage title="SAFETY GUIDELINES">
    <h3 className="text-lg font-bold mb-6 text-brand uppercase tracking-widest">Your Safety is our Priority</h3>
    <ul className="space-y-4 mb-8">
      <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand mt-2 shrink-0" /> <span className="text-white/70">All partner facilities are regularly inspected for structural safety and proper lighting.</span></li>
      <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand mt-2 shrink-0" /> <span className="text-white/70">First aid kits are mandated to be available at every venue.</span></li>
      <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-brand mt-2 shrink-0" /> <span className="text-white/70">Players must wear appropriate non-marking gear on specific turfs.</span></li>
    </ul>
  </SimplePage>
);

const PartnerPage = () => (
  <SimplePage title="PARTNER WITH US">
    <p className="text-xl font-medium mb-8 text-white">Own a sports facility? Join the TurfTown network and maximize your pitch utilization.</p>
    <div className="bg-surface p-8 rounded-2xl border border-white/10">
      <h3 className="text-brand font-bold mb-6 uppercase tracking-widest text-sm">Benefits</h3>
      <div className="grid sm:grid-cols-3 gap-6 mb-8">
         <div>
            <div className="text-4xl font-mono text-white mb-2">3x</div>
            <div className="text-xs text-white/40 uppercase font-bold tracking-widest">More Bookings</div>
         </div>
         <div>
            <div className="text-4xl font-mono text-white mb-2">0</div>
            <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Setup Cost</div>
         </div>
         <div>
            <div className="text-4xl font-mono text-white mb-2">100%</div>
            <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Payment Security</div>
         </div>
      </div>
      <button className="bg-brand text-dark px-8 py-4 rounded-xl font-bold w-full sm:w-auto hover:bg-white transition-colors">Apply Now</button>
    </div>
  </SimplePage>
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [view, setView] = useState<string>('home');
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [view, selectedTurf]);

  // Advanced Filters State
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
      const init = async () => {
        const path = 'turfs';
        try {
          let snapshot = await getDocs(collection(db, path));
          if (snapshot.empty) {
            // Only attempt seeding if empty, and expect possible permission error if not logged in
            await seedTurfs().catch(e => console.warn("Seeding skipped or failed:", e.message));
            snapshot = await getDocs(collection(db, path));
          }
          
          if (snapshot.empty) {
             const localTurfs = INITIAL_TURFS.map((t, i) => ({ id: `local-${i}`, ...t }));
             setTurfs(localTurfs as Turf[]);
          } else {
             setTurfs(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Turf)));
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.LIST, path);
        }
      };
      init();

      onAuthStateChanged(auth, async (u) => {
        if (u) {
          const userDocRef = doc(db, 'users', u.uid);
          try {
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
              await setDoc(userDocRef, {
                uid: u.uid,
                email: u.email,
                displayName: u.displayName,
                photoURL: u.photoURL,
                role: 'user',
                createdAt: serverTimestamp()
              });
            }
          } catch (e) {
            console.error("Error syncing user:", e);
          }
          setUser(u);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    }, []);

  const fetchBookings = async () => {
    if (!user) return;
    const path = 'bookings';
    const q = query(collection(db, path), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    try {
      const snapshot = await getDocs(q);
      setBookings(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  };

  useEffect(() => {
    if (view === 'bookings') fetchBookings();
  }, [view, user]);

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView('home');
  };

  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedAmenities([]);
    setSearch('');
  };

  const uniqueAmenities = Array.from(new Set(turfs.flatMap(t => t.amenities)));

  const filteredTurfs = turfs.filter(t => {
    const matchesSearch = (t.location || '').toLowerCase().includes(search.toLowerCase()) || 
                          (t.sports || []).some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesPrice = (t.pricePerHour || 0) >= priceRange[0] && (t.pricePerHour || 0) <= priceRange[1];
    const matchesAmenities = selectedAmenities.every(a => (t.amenities || []).includes(a));
    
    return matchesSearch && matchesPrice && matchesAmenities;
  });

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-8 bg-dark">
      <CricketLoader />
      <div className="flex flex-col items-center gap-2">
        <div className="font-display font-bold tracking-[0.2em] text-sm text-brand uppercase italic">
          Preparing the ground
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <motion.div 
              key={i}
              className="w-1.5 h-1.5 bg-brand rounded-full"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 lg:px-12 bg-dark text-white selection:bg-brand selection:text-dark relative">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} setView={setView} />
      
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto"
          >
            <HeroSlideshow turfs={turfs} onSelectTurf={(t) => { setSelectedTurf(t); setView('detail'); }} />

            {/* Discover Header */}
            <header className="mb-12">
              <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-4">
                FIND YOUR <br />
                <span className="text-brand">PERFECT PITCH.</span>
              </h1>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                 <div className="relative flex-1 w-full max-w-xl">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                   <input 
                    type="text" 
                    placeholder="Search by location or sport (e.g. Football)" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-surface border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                   />
                 </div>
                 <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                      {['All', 'Football', 'Cricket'].map(tag => (
                        <button 
                          key={tag}
                          onClick={() => setSearch(tag === 'All' ? '' : tag)}
                          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${search === tag || (tag === 'All' && search === '') ? 'bg-brand text-dark border-brand' : 'bg-transparent border-white/10 text-white/60 hover:text-white'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setShowMobileFilters(!showMobileFilters)}
                      className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${showMobileFilters ? 'bg-brand text-dark border-brand' : 'bg-surface border-white/10 text-white/60'}`}
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                 </div>
              </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Desktop Filter Sidebar */}
              <div className="hidden lg:block">
                <FilterSidebar 
                  amenities={uniqueAmenities}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedAmenities={selectedAmenities}
                  setSelectedAmenities={setSelectedAmenities}
                  resetFilters={resetFilters}
                  turfs={turfs}
                  onSelectTurf={(t: Turf) => { setSelectedTurf(t); setView('detail'); }}
                />
              </div>

              {/* Mobile Filter Overlay */}
              <AnimatePresence>
                {showMobileFilters && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden overflow-hidden border-b border-white/10 pb-8"
                  >
                    <FilterSidebar 
                      amenities={uniqueAmenities}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      selectedAmenities={selectedAmenities}
                      setSelectedAmenities={setSelectedAmenities}
                      resetFilters={resetFilters}
                      turfs={turfs}
                      onSelectTurf={(t: Turf) => { 
                        setSelectedTurf(t); 
                        setView('detail'); 
                        setShowMobileFilters(false);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Turf Grid */}
              <div className="flex-1">
                {filteredTurfs.length === 0 ? (
                  <div className="text-center py-24 bg-surface/50 border border-dashed border-white/10 rounded-3xl">
                    <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40">No pitches match your filters.</p>
                    <div className="flex flex-col items-center gap-4 mt-8">
                      <button 
                        onClick={resetFilters}
                        className="text-brand font-bold hover:underline"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredTurfs.map(turf => (
                      <TurfCard 
                        key={turf.id} 
                        turf={turf} 
                        onClick={() => {
                          setSelectedTurf(turf);
                          setView('detail');
                        }} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* New Informational Sections */}
            <AboutSection />
            <WhyTurfTown />
            <FoundersSection />
          </motion.div>
        ) : view === 'detail' && selectedTurf ? (
          <TurfDetail 
            turf={selectedTurf}
            user={user}
            onBack={() => setView('home')}
            onLogin={handleLogin}
            onBookingSuccess={() => {
              setView('bookings');
            }}
          />
        ) : view === 'about' ? (
          <AboutPage />
        ) : view === 'contact' ? (
          <ContactPage />
        ) : view === 'safety' ? (
          <SafetyPage />
        ) : view === 'partner' ? (
          <PartnerPage />
        ) : view === 'bookings' ? (
          <motion.div 
            key="bookings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-4xl font-bold">My Bookings</h2>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Clock className="w-4 h-4" />
                Latest first
              </div>
            </div>

            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-24 bg-surface border border-dashed border-white/10 rounded-3xl">
                  <Activity className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/40">No bookings yet. Time to get out there!</p>
                  <button 
                    onClick={() => setView('home')}
                    className="mt-4 text-brand font-bold hover:underline"
                  >
                    Browse Turfs
                  </button>
                </div>
              ) : (
                bookings.map(booking => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={booking.id}
                    className="bg-surface border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-brand" />
                       </div>
                       <div>
                          <h4 className="font-bold text-lg">{booking.turfName}</h4>
                          <div className="flex items-center gap-2 text-white/40 text-xs">
                             <Activity className="w-3 h-3" />
                             {booking.sport}
                             <span className="mx-1">•</span>
                             {booking.startTime}
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                       <div className="text-right">
                          <div className="text-xs text-white/40 mb-1">Status</div>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-brand/20 text-brand' : 'bg-red-500/20 text-red-500'}`}>
                            {booking.status}
                          </span>
                       </div>
                       <div className="text-right font-mono text-xl font-bold text-brand">
                         ₹{booking.totalPrice}
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {/* Global modals can be triggered here if needed, currently using inline component state for detail/booking */}
      </AnimatePresence>

      <Footer setView={setView} />
    </div>
  );
}
