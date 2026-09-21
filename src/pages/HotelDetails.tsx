import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotel, type Hotel } from '../api/hotels';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, Star, Building2, Loader2, ArrowLeft, Check, 
  Wifi, Wind, Zap, Utensils, BellConcierge, Droplets, Dumbbell, 
  Car, Shield, Info, Map, Dog, Clock, X, BedDouble, Airplay, Coffee, Sun,
  Timer, AlertCircle
} from 'lucide-react';

// Extended mock data for UI
const MOCK_EXTRAS = {
  images: [
    'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40eb591394?q=80&w=600&auto=format&fit=crop'
  ],
  reviewsCount: 1284,
  ratingText: 'Very Good',
  address: 'Prime Location, City Center, Near Landmark',
  allAmenities: [
    { name: 'Free Wifi', icon: Wifi, available: true },
    { name: 'Air conditioning', icon: Wind, available: true },
    { name: 'Power backup', icon: Zap, available: true },
    { name: 'Restaurant', icon: Utensils, available: true },
    { name: 'Room service', icon: BellConcierge, available: true },
    { name: 'Swimming pool', icon: Droplets, available: true },
    { name: 'Gym', icon: Dumbbell, available: false },
    { name: 'Parking', icon: Car, available: true },
    { name: 'Laundry', icon: Utensils, available: false },
    { name: 'Elevator', icon: Building2, available: true },
    { name: '24-hr front desk', icon: Clock, available: true },
    { name: 'CCTV', icon: Shield, available: true },
  ],
  nearby: [
    { name: 'International Airport', dist: '12 km' },
    { name: 'Central Railway Station', dist: '4.5 km' },
    { name: 'City Mall', dist: '1.2 km' },
    { name: 'Historical Monument', dist: '3.0 km' },
  ]
};

const MOCK_REVIEWS = [
  { id: '1', author: 'Rahul S.', date: 'Oct 2023', roomType: 'Premium Double', type: 'Couples', score: 5, text: 'Absolutely wonderful stay. The staff went above and beyond.', helpful: 12, unhelpful: 0 },
  { id: '2', author: 'Priya K.', date: 'Sep 2023', roomType: 'Standard Single', type: 'Solo', score: 4, text: 'Great location, but the AC was a bit noisy at night.', helpful: 4, unhelpful: 1 },
  { id: '3', author: 'Amit V.', date: 'Sep 2023', roomType: 'Family Suite', type: 'Families', score: 3, text: 'Decent place. Food was average. Pool was crowded.', helpful: 8, unhelpful: 2 },
  { id: '4', author: 'Sneha R.', date: 'Aug 2023', roomType: 'Premium Double', type: 'Business', score: 5, text: 'Perfect for business. Wifi was blazing fast and room service was prompt.', helpful: 15, unhelpful: 0 },
  { id: '5', author: 'Vikram M.', date: 'Aug 2023', roomType: 'Standard Double', type: 'Couples', score: 2, text: 'Check-in took forever. Room wasn\'t ready at 2 PM.', helpful: 22, unhelpful: 3 },
  { id: '6', author: 'Neha J.', date: 'Jul 2023', roomType: 'Standard Single', type: 'Solo', score: 4, text: 'Clean and safe. Loved the breakfast spread.', helpful: 5, unhelpful: 0 },
  { id: '7', author: 'Rohan D.', date: 'Jul 2023', roomType: 'Family Suite', type: 'Families', score: 5, text: 'Kids loved the pool. Will definitely come back.', helpful: 9, unhelpful: 1 },
  { id: '8', author: 'Pooja T.', date: 'Jun 2023', roomType: 'Premium Double', type: 'Couples', score: 4, text: 'Beautiful view from the room. Slightly overpriced though.', helpful: 7, unhelpful: 2 },
  { id: '9', author: 'Arjun N.', date: 'Jun 2023', roomType: 'Standard Double', type: 'Business', score: 3, text: 'Average stay. Gym is very small.', helpful: 3, unhelpful: 1 },
  { id: '10', author: 'Sunita P.', date: 'May 2023', roomType: 'Standard Single', type: 'Solo', score: 5, text: 'Exceptional hospitality. The manager upgraded my room for free!', helpful: 31, unhelpful: 0 },
  { id: '11', author: 'Karan G.', date: 'May 2023', roomType: 'Family Suite', type: 'Families', score: 1, text: 'Terrible experience. Found cockroaches in the bathroom. Never again.', helpful: 45, unhelpful: 5 },
  { id: '12', author: 'Anjali C.', date: 'Apr 2023', roomType: 'Premium Double', type: 'Couples', score: 5, text: 'Romantic getaway made perfect. The spa is a must-try.', helpful: 11, unhelpful: 0 },
  { id: '13', author: 'Manish B.', date: 'Apr 2023', roomType: 'Standard Double', type: 'Business', score: 4, text: 'Good location for meetings in the tech park.', helpful: 2, unhelpful: 0 },
  { id: '14', author: 'Divya H.', date: 'Mar 2023', roomType: 'Standard Single', type: 'Solo', score: 2, text: 'Very noisy at night due to the street outside. Could not sleep.', helpful: 14, unhelpful: 1 },
  { id: '15', author: 'Ravi S.', date: 'Mar 2023', roomType: 'Family Suite', type: 'Families', score: 4, text: 'Spacious rooms, good for large families.', helpful: 6, unhelpful: 0 },
  { id: '16', author: 'Meera L.', date: 'Feb 2023', roomType: 'Premium Double', type: 'Couples', score: 5, text: 'The bathtub was amazing. Really luxurious feel.', helpful: 8, unhelpful: 1 },
  { id: '17', author: 'Rajesh K.', date: 'Feb 2023', roomType: 'Standard Double', type: 'Business', score: 3, text: 'Basic amenities. Nothing fancy.', helpful: 1, unhelpful: 0 },
  { id: '18', author: 'Swati A.', date: 'Jan 2023', roomType: 'Standard Single', type: 'Solo', score: 5, text: 'Felt very secure as a solo female traveler. Highly recommend.', helpful: 28, unhelpful: 0 },
  { id: '19', author: 'Tarun Y.', date: 'Jan 2023', roomType: 'Family Suite', type: 'Families', score: 4, text: 'Good value for money. Breakfast could have more variety.', helpful: 4, unhelpful: 0 },
  { id: '20', author: 'Geeta W.', date: 'Dec 2022', roomType: 'Premium Double', type: 'Couples', score: 5, text: 'A memorable stay to ring in the New Year.', helpful: 10, unhelpful: 0 },
];

const NAV_ITEMS = [
  { id: 'gallery', label: 'Overview' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'policies', label: 'Policies' },
  { id: 'location', label: 'Location' },
  { id: 'reviews', label: 'Reviews' },
];

// Room Grid Types
type RoomStatus = 'available' | 'occupied' | 'premium';
interface RoomTile {
  id: string;
  number: string;
  floor: number;
  status: RoomStatus;
}
interface RoomConfig {
  roomId: string;
  bedSetup: '1 single' | '1 double' | '2 singles' | '2 doubles';
  isAc: boolean;
  mealPlan: 'room_only' | 'breakfast' | 'breakfast_dinner' | 'all_meals';
  extraMattress: boolean;
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
  price: number;
  holdExpiresAt?: number;
}

export const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeSection, setActiveSection] = useState('gallery');

  // Room Grid State
  const [roomsGrid, setRoomsGrid] = useState<RoomTile[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<Record<string, RoomConfig>>({});
  const [activeConfigRoom, setActiveConfigRoom] = useState<RoomTile | null>(null);
  const [tempConfig, setTempConfig] = useState<RoomConfig | null>(null);

  // Reviews State
  const [reviewFilter, setReviewFilter] = useState('All');
  const [reviewSort, setReviewSort] = useState('Most helpful');
  const [reviewLimit, setReviewLimit] = useState(6);
  const [starFilter, setStarFilter] = useState<number | null>(null);

  // Check-in / Check-out global state for base calculation
  const [nights, setNights] = useState(1); // Defaulting to 1 night for pricing demo

  // Live State
  const [pollingError, setPollingError] = useState(false);
  const [flashedRooms, setFlashedRooms] = useState<string[]>([]);
  const [holdExpiredWarning, setHoldExpiredWarning] = useState(false);
  const [, setTick] = useState(0);

  // Initialize rooms once
  useEffect(() => {
    const generated: RoomTile[] = [];
    for (let f = 1; f <= 4; f++) {
      for (let r = 1; r <= 8; r++) {
        // Deterministic mock generation for stable UI
        const isOccupied = (f * r) % 3 === 0; 
        const isPremium = !isOccupied && (f + r) % 5 === 0;
        generated.push({
          id: `f${f}-r${r}`,
          number: `${f}0${r}`,
          floor: f,
          status: isOccupied ? 'occupied' : isPremium ? 'premium' : 'available'
        });
      }
    }
    setRoomsGrid(generated);
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchHotel = async () => {
      try {
        const res = await getHotel(id);
        setHotel(res.data);
      } catch (err) {
        console.error('Failed to fetch hotel details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  // Live Polling Effect (30s)
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      // 20% failure chance
      if (Math.random() < 0.2) {
        setPollingError(true);
        setTimeout(() => setPollingError(false), 5000);
        return;
      }
      setPollingError(false);

      setRoomsGrid(prev => {
        const available = prev.filter(r => r.status === 'available');
        if (available.length === 0) return prev;
        
        const numToFlip = Math.floor(Math.random() * 2) + 1;
        const toFlip = available.sort(() => 0.5 - Math.random()).slice(0, numToFlip).map(r => r.id);
        
        setFlashedRooms(toFlip);
        setTimeout(() => setFlashedRooms([]), 2000);

        return prev.map(r => toFlip.includes(r.id) ? { ...r, status: 'occupied' } : r);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [loading]);

  // Hold Timer Effect (1s)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let hasExpired = false;
      setSelectedRooms(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(roomId => {
          if (next[roomId].holdExpiresAt && next[roomId].holdExpiresAt! <= now) {
            delete next[roomId];
            changed = true;
            hasExpired = true;
          }
        });
        return changed ? next : prev;
      });
      if (hasExpired) {
        setHoldExpiredWarning(true);
        setTimeout(() => setHoldExpiredWarning(false), 8000);
      }
      setTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => document.getElementById(item.id));
      const scrollPos = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  // Pricing Logic
  const baseRate = hotel?.price_per_night || 5000;
  
  const calculateRoomPrice = (config: RoomConfig) => {
    let rate = baseRate;
    if (!config.isAc) rate -= 600;
    
    // Meal plans
    if (config.mealPlan === 'breakfast') rate += 400;
    if (config.mealPlan === 'breakfast_dinner') rate += 1200;
    if (config.mealPlan === 'all_meals') rate += 1800;
    
    // Add-ons (one time fee usually, but let's make them per night for simplicity or flat)
    let addOns = 0;
    if (config.extraMattress) addOns += 500 * nights;
    if (config.earlyCheckIn) addOns += 800;
    if (config.lateCheckOut) addOns += 800;

    return (rate * nights) + addOns;
  };

  // Update tempConfig price live
  useEffect(() => {
    if (tempConfig) {
      setTempConfig(prev => prev ? { ...prev, price: calculateRoomPrice(prev) } : null);
    }
  }, [tempConfig?.isAc, tempConfig?.mealPlan, tempConfig?.extraMattress, tempConfig?.earlyCheckIn, tempConfig?.lateCheckOut, nights, baseRate]);

  const openConfig = (room: RoomTile) => {
    if (room.status === 'occupied') return;
    setActiveConfigRoom(room);
    
    if (selectedRooms[room.id]) {
      setTempConfig(selectedRooms[room.id]);
    } else {
      // Default config
      const isPremium = room.status === 'premium';
      setTempConfig({
        roomId: room.id,
        bedSetup: isPremium ? '1 double' : '1 single',
        isAc: true,
        mealPlan: 'room_only',
        extraMattress: false,
        earlyCheckIn: false,
        lateCheckOut: false,
        price: calculateRoomPrice({
          roomId: room.id,
          bedSetup: isPremium ? '1 double' : '1 single',
          isAc: true,
          mealPlan: 'room_only',
          extraMattress: false,
          earlyCheckIn: false,
          lateCheckOut: false,
          price: 0
        })
      });
    }
  };

  const saveRoomConfig = () => {
    if (tempConfig && activeConfigRoom) {
      // 10 minute hold timer
      const configToSave = { ...tempConfig, holdExpiresAt: Date.now() + 10 * 60 * 1000 };
      setSelectedRooms(prev => ({ ...prev, [activeConfigRoom.id]: configToSave }));
      setActiveConfigRoom(null);
      setTempConfig(null);
    }
  };

  const removeSelectedRoom = (roomId: string) => {
    setSelectedRooms(prev => {
      const next = { ...prev };
      delete next[roomId];
      return next;
    });
  };

  // Grand Total Calculation
  const selectedRoomsArray = Object.values(selectedRooms);
  const subtotal = selectedRoomsArray.reduce((acc, r) => acc + r.price, 0);
  const gst = subtotal * 0.12;
  const grandTotal = subtotal + gst;

  if (loading) return (
    <div className="min-h-screen bg-[#F2F4F7] font-sans pb-32">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm w-full h-[54px] flex items-center px-8">
        <div className="w-96 h-4 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-5xl space-y-8 mt-8">
        <div className="w-24 h-4 bg-gray-300 animate-pulse rounded mb-6"></div>
        {/* Gallery Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden shadow-sm h-[300px] md:h-[400px]">
          <div className="bg-gray-200 animate-pulse h-full w-full"></div>
          <div className="hidden md:grid grid-cols-2 gap-2 h-full">
             <div className="bg-gray-200 animate-pulse h-full w-full"></div>
             <div className="bg-gray-200 animate-pulse h-full w-full"></div>
             <div className="bg-gray-200 animate-pulse h-full w-full"></div>
             <div className="bg-gray-200 animate-pulse h-full w-full"></div>
          </div>
        </div>
        {/* Header Skeleton */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <div className="flex justify-between items-start">
             <div className="w-1/2">
               <div className="w-24 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
               <div className="w-3/4 h-8 bg-gray-300 animate-pulse rounded mb-4"></div>
               <div className="w-1/2 h-4 bg-gray-200 animate-pulse rounded"></div>
             </div>
             <div className="w-24 h-16 bg-gray-200 animate-pulse rounded"></div>
           </div>
           <div className="w-full h-4 bg-gray-100 animate-pulse rounded mt-6"></div>
           <div className="w-5/6 h-4 bg-gray-100 animate-pulse rounded mt-2"></div>
        </div>
      </div>
    </div>
  );

  if (!hotel) return <div className="p-8 text-center bg-gray-50 min-h-screen"><h2 className="text-2xl font-bold">Hotel not found</h2><button onClick={() => navigate('/dashboard/hotels')} className="mt-4 text-blue-600 hover:underline">Return to search</button></div>;

  const mainImage = hotel.image_url || MOCK_EXTRAS.images[0];
  const galleryImages = [mainImage, ...MOCK_EXTRAS.images.slice(1, 4)];
  const ratingNum = hotel.rating || 4.5;

  return (
    <div className="min-h-screen bg-[#F2F4F7] font-sans pb-32 relative overflow-x-hidden">
      
      {/* Scroll Spy Nav */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {NAV_ITEMS.map(item => (
              <button 
                key={item.id} onClick={() => scrollToSection(item.id)}
                className={`whitespace-nowrap px-4 py-4 text-sm font-bold border-b-2 transition-colors ${activeSection === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Banners */}
      {pollingError && (
        <div className="fixed top-[60px] left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm flex items-center gap-2 animate-in slide-in-from-top-4 fade-in">
          <AlertCircle className="w-4 h-4" /> Couldn't refresh availability — retry
        </div>
      )}
      {holdExpiredWarning && (
        <div className="fixed top-[60px] left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm flex items-center gap-2 animate-in slide-in-from-top-4 fade-in">
          <AlertCircle className="w-4 h-4" /> Your hold expired — reselect room(s)
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button onClick={() => navigate('/dashboard/hotels')} className="flex items-center text-sm font-bold text-blue-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Hotels
        </button>

        {/* Removed right sidebar, full width content */}
        <div className="space-y-8 max-w-5xl">
            
          {/* Layer 1: Gallery */}
          <div id="gallery" className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden shadow-sm">
            <div className="h-[300px] md:h-[400px]">
              <img src={galleryImages[0]} alt="Hero" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:grid grid-cols-2 gap-2 h-[400px]">
              {galleryImages.slice(1, 4).map((img, idx) => (
                <div key={idx} className="relative h-full">
                  <img src={img} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover" />
                  {idx === 2 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                      <span className="text-white font-bold">View all 28 photos</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Layer 2: Header Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: Math.floor(ratingNum) }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">{hotel.name}</h1>
                <div className="flex items-center text-blue-600 font-medium text-sm hover:underline cursor-pointer mb-4">
                  <MapPin className="w-4 h-4 mr-1" /> {MOCK_EXTRAS.address}
                </div>
              </div>
              <div className="flex flex-col items-end text-right flex-shrink-0">
                <div className="bg-blue-600 text-white px-3 py-1.5 rounded-t-lg rounded-br-lg text-lg font-bold flex items-center gap-1">
                  {ratingNum} <span className="text-sm font-normal">/ 5</span>
                </div>
                <div className="text-sm font-bold text-[#1a1a1a] mt-1">{MOCK_EXTRAS.ratingText}</div>
                <div className="text-xs text-gray-500">{MOCK_EXTRAS.reviewsCount} reviews</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mt-4">
              {hotel.description || 'Experience world-class service and luxury at our esteemed property.'}
            </p>
          </div>

          {/* Layer: Room Selection (Interactive Grid) */}
          <div id="rooms" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1a1a1a]">Select your Rooms</h2>
                <p className="text-sm text-gray-500">Pick from our real-time floor plan.</p>
              </div>
              <div className="hidden sm:flex gap-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-50 border border-blue-200"></div> Available</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-50 border border-amber-200"></div> Premium</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-600"></div> Selected</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></div> Occupied</div>
              </div>
            </div>

            <div className="space-y-4">
              {[4, 3, 2, 1].map(floor => (
                <div key={floor} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-16 text-sm font-bold text-gray-500 uppercase tracking-wide">Floor {floor}</div>
                  <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 w-full no-scrollbar">
                    {roomsGrid.filter(r => r.floor === floor).map(room => {
                      const isSelected = !!selectedRooms[room.id];
                      let bgClass = '';
                      let textClass = 'text-gray-700';
                      let cursorClass = 'cursor-pointer hover:shadow-md hover:-translate-y-0.5';

                      if (isSelected) {
                        bgClass = 'bg-blue-600 border-blue-600';
                        textClass = 'text-white';
                      } else if (room.status === 'occupied') {
                        bgClass = 'bg-gray-100 border-gray-200 opacity-60';
                        textClass = 'text-gray-400';
                        cursorClass = 'cursor-not-allowed';
                      } else if (room.status === 'premium') {
                        bgClass = 'bg-amber-50 border-amber-200';
                        textClass = 'text-amber-700';
                      } else {
                        bgClass = 'bg-blue-50 border-blue-200';
                        textClass = 'text-blue-800';
                      }

                      if (flashedRooms.includes(room.id)) {
                        bgClass = 'bg-amber-400 border-amber-500 animate-pulse duration-1000';
                        textClass = 'text-white';
                      }

                      return (
                        <button 
                          key={room.id}
                          onClick={() => openConfig(room)}
                          className={`w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center rounded-xl border-2 font-bold transition-all ${bgClass} ${textClass} ${cursorClass}`}
                        >
                          {room.number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 3: Amenities */}
          <div id="amenities" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-6 gap-x-4">
              {MOCK_EXTRAS.allAmenities.map((am, idx) => {
                const Icon = am.icon;
                return (
                  <div key={idx} className={`flex items-center gap-3 ${am.available ? 'text-[#1a1a1a]' : 'text-gray-300 line-through'}`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{am.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Layer 4: Policies Panel */}
          <div id="policies" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">Property Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-bold text-[#1a1a1a] mb-1">Check-in / Check-out</div>
                  <p className="text-sm text-gray-600">Check-in from 2:00 PM<br/>Check-out till 11:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-bold text-[#1a1a1a] mb-1">Couple Friendly</div>
                  <p className="text-sm text-gray-600">Unmarried couples are welcome. Local IDs are accepted.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 5: Location */}
          <div id="location" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">Location & Nearby</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 rounded-xl overflow-hidden h-[250px] relative bg-gray-100 border border-gray-200 flex items-center justify-center">
                <Map className="w-12 h-12 text-gray-300" />
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                  <button className="bg-white px-4 py-2 rounded-lg font-bold text-sm shadow-md text-blue-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> View on Map
                  </button>
                </div>
              </div>
              <div className="w-full md:w-64 space-y-4">
                <h3 className="font-bold text-sm text-[#1a1a1a] uppercase tracking-wide">What's Nearby</h3>
                <div className="space-y-3">
                  {MOCK_EXTRAS.nearby.map((n, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                      <span className="text-gray-600">{n.name}</span>
                      <span className="font-bold text-[#1a1a1a]">{n.dist}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Layer 6: Reviews */}
          <div id="reviews" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">Guest Reviews</h2>
            
            {/* Reviews Header / Stats */}
            <div className="flex flex-col md:flex-row gap-8 mb-8 border-b border-gray-100 pb-8">
              {/* Overall Score */}
              <div className="flex flex-col items-center justify-center bg-blue-50 rounded-xl p-6 md:w-1/3">
                <div className="text-5xl font-bold text-blue-600 mb-1">4.3<span className="text-2xl text-blue-400">/5</span></div>
                <div className="font-bold text-blue-800 text-lg">Very Good</div>
                <div className="text-sm text-blue-500 mt-1">Based on {MOCK_EXTRAS.reviewsCount} reviews</div>
              </div>

              {/* Category Breakdown */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {[
                  { label: 'Cleanliness', score: 4.5 },
                  { label: 'Staff', score: 4.7 },
                  { label: 'Location', score: 4.8 },
                  { label: 'Value for money', score: 3.9 },
                  { label: 'Amenities', score: 4.2 },
                  { label: 'Food', score: 3.8 },
                ].map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium w-28">{cat.label}</span>
                    <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(cat.score / 5) * 100}%` }}></div>
                    </div>
                    <span className="font-bold text-[#1a1a1a] w-6 text-right">{cat.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Histogram & Filters */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <div className="lg:w-1/3 space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-3">Rating Distribution</h3>
                {[
                  { stars: 5, pct: 65, count: 834 },
                  { stars: 4, pct: 20, count: 256 },
                  { stars: 3, pct: 8, count: 102 },
                  { stars: 2, pct: 4, count: 51 },
                  { stars: 1, pct: 3, count: 41 },
                ].map(row => (
                  <button 
                    key={row.stars} 
                    onClick={() => setStarFilter(starFilter === row.stars ? null : row.stars)}
                    className={`w-full flex items-center gap-3 text-sm p-1.5 rounded-lg transition-colors hover:bg-gray-50 ${starFilter === row.stars ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}
                  >
                    <span className="font-medium text-gray-600 w-4">{row.stars}★</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${row.pct}%` }}></div>
                    </div>
                    <span className="text-gray-500 text-xs w-8 text-right">{row.count}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Families', 'Couples', 'Business', 'Solo'].map(tab => (
                      <button 
                        key={tab} 
                        onClick={() => { setReviewFilter(tab); setReviewLimit(6); }}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${reviewFilter === tab ? 'bg-[#1a1a1a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <select 
                    value={reviewSort} 
                    onChange={e => setReviewSort(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-sm font-bold text-gray-700 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                  >
                    <option>Most helpful</option>
                    <option>Most recent</option>
                    <option>Highest</option>
                    <option>Lowest</option>
                  </select>
                </div>

                <div className="space-y-6">
                  {(() => {
                    let filtered = [...MOCK_REVIEWS];
                    if (reviewFilter !== 'All') filtered = filtered.filter(r => r.type === reviewFilter);
                    if (starFilter) filtered = filtered.filter(r => r.score === starFilter);
                    
                    if (reviewSort === 'Most helpful') filtered.sort((a,b) => b.helpful - a.helpful);
                    if (reviewSort === 'Highest') filtered.sort((a,b) => b.score - a.score);
                    if (reviewSort === 'Lowest') filtered.sort((a,b) => a.score - b.score);
                    
                    const visible = filtered.slice(0, reviewLimit);
                    
                    if (visible.length === 0) return <div className="text-gray-500 text-center py-8">No reviews match your filters.</div>;

                    return visible.map(review => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                              {review.author.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-[#1a1a1a]">{review.author}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span>{review.date}</span>
                                <span>•</span>
                                <span>{review.type}</span>
                                <span>•</span>
                                <span>{review.roomType}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200 font-bold text-sm">
                            {review.score} <Star className="w-3 h-3 fill-current" />
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">"{review.text}"</p>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                          <span>Helpful?</span>
                          <button className="flex items-center gap-1 hover:text-blue-600"><Check className="w-3 h-3" /> Yes ({review.helpful})</button>
                          <button className="flex items-center gap-1 hover:text-red-600"><X className="w-3 h-3" /> No ({review.unhelpful})</button>
                        </div>
                      </div>
                    ));
                  })()}
                  
                  {reviewLimit < MOCK_REVIEWS.length && (
                     <button 
                       onClick={() => setReviewLimit(prev => prev + 6)} 
                       className="w-full py-3 border border-gray-200 rounded-xl font-bold text-sm text-blue-600 hover:bg-gray-50"
                     >
                       Load more reviews
                     </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Side Panel for Room Configuration */}
      {activeConfigRoom && tempConfig && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-[#1a1a1a]">Configure Room {activeConfigRoom.number}</h3>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-bold">{activeConfigRoom.status} class</p>
              </div>
              <button onClick={() => setActiveConfigRoom(null)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Bed Setup */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">Bed Setup</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['1 single', '1 double', '2 singles', '2 doubles'] as const).map(bed => (
                    <button key={bed} onClick={() => setTempConfig({...tempConfig, bedSetup: bed})} className={`py-3 px-2 border rounded-xl flex flex-col items-center gap-2 transition-colors ${tempConfig.bedSetup === bed ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>
                      <BedDouble className="w-5 h-5" />
                      <span className="text-xs font-bold">{bed}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AC Preference */}
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">Climate Control</label>
                 <div className="flex gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                   <button onClick={() => setTempConfig({...tempConfig, isAc: true})} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${tempConfig.isAc ? 'bg-white shadow-sm border border-gray-200 text-[#1a1a1a]' : 'text-gray-500'}`}>AC</button>
                   <button onClick={() => setTempConfig({...tempConfig, isAc: false})} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${!tempConfig.isAc ? 'bg-white shadow-sm border border-gray-200 text-[#1a1a1a]' : 'text-gray-500'}`}>Non-AC (-₹600)</button>
                 </div>
              </div>

              {/* Meal Plan */}
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">Meal Plan</label>
                 <div className="space-y-3">
                   <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${tempConfig.mealPlan === 'room_only' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                     <div className="flex items-center gap-3">
                       <input type="radio" checked={tempConfig.mealPlan === 'room_only'} onChange={() => setTempConfig({...tempConfig, mealPlan: 'room_only'})} className="accent-blue-600 w-4 h-4" />
                       <span className="font-bold text-[#1a1a1a] text-sm">Room Only</span>
                     </div>
                     <span className="text-sm font-bold text-gray-500">+₹0</span>
                   </label>
                   <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${tempConfig.mealPlan === 'breakfast' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                     <div className="flex items-center gap-3">
                       <input type="radio" checked={tempConfig.mealPlan === 'breakfast'} onChange={() => setTempConfig({...tempConfig, mealPlan: 'breakfast'})} className="accent-blue-600 w-4 h-4" />
                       <div className="flex flex-col"><span className="font-bold text-[#1a1a1a] text-sm">Breakfast</span><span className="text-xs text-gray-500">Buffet included</span></div>
                     </div>
                     <span className="text-sm font-bold text-blue-600">+₹400</span>
                   </label>
                   <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${tempConfig.mealPlan === 'breakfast_dinner' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                     <div className="flex items-center gap-3">
                       <input type="radio" checked={tempConfig.mealPlan === 'breakfast_dinner'} onChange={() => setTempConfig({...tempConfig, mealPlan: 'breakfast_dinner'})} className="accent-blue-600 w-4 h-4" />
                       <div className="flex flex-col"><span className="font-bold text-[#1a1a1a] text-sm">Half Board</span><span className="text-xs text-gray-500">Breakfast + Dinner</span></div>
                     </div>
                     <span className="text-sm font-bold text-blue-600">+₹1200</span>
                   </label>
                 </div>
              </div>

              {/* Add-ons */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">Extra Add-ons</label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2"><input type="checkbox" checked={tempConfig.extraMattress} onChange={e => setTempConfig({...tempConfig, extraMattress: e.target.checked})} className="accent-blue-600 w-4 h-4"/> <span className="text-sm font-medium">Extra Mattress</span></div>
                    <span className="text-sm font-bold text-gray-500">+₹500</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2"><input type="checkbox" checked={tempConfig.earlyCheckIn} onChange={e => setTempConfig({...tempConfig, earlyCheckIn: e.target.checked})} className="accent-blue-600 w-4 h-4"/> <span className="text-sm font-medium">Early Check-in (10 AM)</span></div>
                    <span className="text-sm font-bold text-gray-500">+₹800</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2"><input type="checkbox" checked={tempConfig.lateCheckOut} onChange={e => setTempConfig({...tempConfig, lateCheckOut: e.target.checked})} className="accent-blue-600 w-4 h-4"/> <span className="text-sm font-medium">Late Check-out (4 PM)</span></div>
                    <span className="text-sm font-bold text-gray-500">+₹800</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 text-sm font-bold">Total for this room</span>
                <span className="text-2xl font-bold text-[#1a1a1a]">₹ {tempConfig.price.toLocaleString('en-IN')}</span>
              </div>
              <button onClick={saveRoomConfig} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors">
                Save Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Selection Summary Bar */}
      {selectedRoomsArray.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-40 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              
              <div className="flex-1 flex flex-col md:flex-row items-center gap-4 w-full">
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Your Selection</div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                  {selectedRoomsArray.map(config => {
                    const timeLeft = Math.max(0, Math.floor((config.holdExpiresAt! - Date.now()) / 1000));
                    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
                    const secs = (timeLeft % 60).toString().padStart(2, '0');
                    const isUrgent = timeLeft < 60; // Less than 1 min left

                    return (
                      <div key={config.roomId} className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-lg flex items-center gap-2 flex-shrink-0">
                        <span className="font-bold">{roomsGrid.find(r => r.id === config.roomId)?.number}</span>
                        <div className={`text-xs px-2 border-l border-r border-blue-200 font-medium flex items-center gap-1 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                          <Timer className="w-3 h-3" /> {mins}:{secs}
                        </div>
                        <span className="text-xs font-bold pl-1">₹{config.price}</span>
                        <button onClick={() => removeSelectedRoom(config.roomId)} className="text-blue-400 hover:text-blue-800 ml-1"><X className="w-3 h-3"/></button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-4 md:pt-0 border-gray-100">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">Grand Total (inc. 12% GST)</div>
                  <div className="text-2xl font-bold text-[#1a1a1a]">₹ {grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                </div>
                <button onClick={() => navigate('/dashboard/checkout', { state: { hotel, selectedRooms: selectedRoomsArray, total: grandTotal, nights } })} className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 transition-transform hover:scale-105 whitespace-nowrap shadow-lg shadow-green-600/30">
                  Guest Details →
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
