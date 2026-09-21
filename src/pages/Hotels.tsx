import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Users, Search, Star, Wifi, Coffee, Car, Wind, Droplets, 
  ChevronLeft, ChevronRight, X, Building2, Flame
} from 'lucide-react';

type Amenity = 'Wifi' | 'AC' | 'Breakfast' | 'Pool' | 'Parking';
type PropertyType = 'Hotel' | 'Resort' | 'Homestay' | 'Villa';

interface MockHotel {
  id: string;
  name: string;
  locality: string;
  distance: string;
  city: string;
  rating: number;
  reviews: number;
  ratingText: string;
  amenities: Amenity[];
  type: PropertyType;
  originalPrice: number;
  discountedPrice: number;
  taxes: number;
  images: string[];
}

const MOCK_HOTELS: MockHotel[] = [
  {
    id: 'h1', name: 'Taj Palace, New Delhi', locality: 'Diplomatic Enclave', distance: '4.5 km from city centre', city: 'Delhi',
    rating: 4.8, reviews: 2450, ratingText: 'Excellent', amenities: ['Wifi', 'AC', 'Breakfast', 'Pool', 'Parking'],
    type: 'Hotel', originalPrice: 18000, discountedPrice: 15500, taxes: 1800,
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?q=80&w=800&auto=format&fit=crop']
  },
  {
    id: 'h2', name: 'The Leela Ambience', locality: 'Gurugram', distance: '12 km from city centre', city: 'Delhi',
    rating: 4.6, reviews: 1840, ratingText: 'Very Good', amenities: ['Wifi', 'AC', 'Breakfast', 'Pool', 'Parking'],
    type: 'Hotel', originalPrice: 14000, discountedPrice: 11200, taxes: 1200,
    images: ['https://images.unsplash.com/photo-1551882547-ff40eb591394?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop']
  },
  {
    id: 'h3', name: 'W Goa', locality: 'Vagator', distance: '1.2 km from Vagator Beach', city: 'Goa',
    rating: 4.5, reviews: 3120, ratingText: 'Excellent', amenities: ['Wifi', 'AC', 'Pool', 'Parking'],
    type: 'Resort', originalPrice: 22000, discountedPrice: 18500, taxes: 2000,
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?q=80&w=800&auto=format&fit=crop']
  },
  {
    id: 'h4', name: 'Taj Exotica Resort & Spa', locality: 'Benaulim', distance: '0.5 km from Benaulim Beach', city: 'Goa',
    rating: 4.9, reviews: 4200, ratingText: 'Exceptional', amenities: ['Wifi', 'AC', 'Breakfast', 'Pool', 'Parking'],
    type: 'Resort', originalPrice: 25000, discountedPrice: 19500, taxes: 2100,
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop']
  },
  {
    id: 'h5', name: 'Casa de Goa Boutique Resort', locality: 'Calangute', distance: '0.8 km from Calangute Beach', city: 'Goa',
    rating: 4.2, reviews: 950, ratingText: 'Good', amenities: ['Wifi', 'AC', 'Pool'],
    type: 'Resort', originalPrice: 6500, discountedPrice: 4800, taxes: 600,
    images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1445991842772-097fea258e7b?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f6?q=80&w=800&auto=format&fit=crop']
  },
  {
    id: 'h6', name: 'Rambagh Palace', locality: 'Bhawani Singh Road', distance: '3.5 km from city centre', city: 'Jaipur',
    rating: 4.9, reviews: 5600, ratingText: 'Exceptional', amenities: ['Wifi', 'AC', 'Breakfast', 'Pool', 'Parking'],
    type: 'Hotel', originalPrice: 35000, discountedPrice: 28000, taxes: 3500,
    images: ['https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop']
  },
  {
    id: 'h7', name: 'Trident Jaipur', locality: 'Amer Fort Road', distance: '1.5 km from Jal Mahal', city: 'Jaipur',
    rating: 4.7, reviews: 2100, ratingText: 'Excellent', amenities: ['Wifi', 'AC', 'Breakfast', 'Pool', 'Parking'],
    type: 'Hotel', originalPrice: 12000, discountedPrice: 9500, taxes: 1100,
    images: ['https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1551882547-ff40eb591394?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop']
  },
  {
    id: 'h8', name: 'Jaipur Heritage Villa', locality: 'Civil Lines', distance: '2.5 km from city centre', city: 'Jaipur',
    rating: 4.4, reviews: 450, ratingText: 'Very Good', amenities: ['Wifi', 'AC', 'Breakfast', 'Parking'],
    type: 'Villa', originalPrice: 5000, discountedPrice: 3800, taxes: 400,
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?q=80&w=800&auto=format&fit=crop']
  },
  {
    id: 'h9', name: 'Mayfair Lagoon', locality: 'Jayadev Vihar', distance: '4 km from city centre', city: 'Bhubaneswar',
    rating: 4.6, reviews: 1800, ratingText: 'Excellent', amenities: ['Wifi', 'AC', 'Breakfast', 'Pool', 'Parking'],
    type: 'Resort', originalPrice: 9500, discountedPrice: 7800, taxes: 850,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop']
  },
  {
    id: 'h10', name: 'Welcomhotel by ITC', locality: 'Khandagiri', distance: '6 km from city centre', city: 'Bhubaneswar',
    rating: 4.5, reviews: 1120, ratingText: 'Very Good', amenities: ['Wifi', 'AC', 'Breakfast', 'Pool', 'Parking'],
    type: 'Hotel', originalPrice: 7500, discountedPrice: 6200, taxes: 700,
    images: ['https://images.unsplash.com/photo-1551882547-ff40eb591394?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?q=80&w=800&auto=format&fit=crop']
  },
  {
    id: 'h11', name: 'The Span Resort & Spa', locality: 'Kullu Manali Highway', distance: '14 km from Mall Road', city: 'Manali',
    rating: 4.7, reviews: 1560, ratingText: 'Excellent', amenities: ['Wifi', 'Breakfast', 'Pool', 'Parking'],
    type: 'Resort', originalPrice: 15000, discountedPrice: 12500, taxes: 1400,
    images: ['https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop']
  },
  {
    id: 'h12', name: 'Snow Valley Homestay', locality: 'Old Manali', distance: '2 km from Mall Road', city: 'Manali',
    rating: 4.3, reviews: 890, ratingText: 'Good', amenities: ['Wifi', 'Breakfast', 'Parking'],
    type: 'Homestay', originalPrice: 3500, discountedPrice: 2800, taxes: 300,
    images: ['https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f6?q=80&w=800&auto=format&fit=crop']
  },
];

const HotelSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4 flex flex-col sm:flex-row h-[220px]">
    <div className="w-full sm:w-[280px] h-[200px] sm:h-full bg-gray-200 animate-pulse flex-shrink-0" />
    <div className="flex-1 p-5 flex flex-col justify-between">
      <div>
        <div className="w-16 h-4 bg-gray-200 animate-pulse rounded mb-2" />
        <div className="w-3/4 h-6 bg-gray-200 animate-pulse rounded mb-2" />
        <div className="w-1/2 h-4 bg-gray-200 animate-pulse rounded mb-4" />
        <div className="flex gap-2">
          <div className="w-12 h-4 bg-gray-200 animate-pulse rounded" />
          <div className="w-12 h-4 bg-gray-200 animate-pulse rounded" />
          <div className="w-12 h-4 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
    <div className="w-full sm:w-[220px] bg-gray-50/50 p-5 flex flex-col justify-end border-t sm:border-t-0 sm:border-l border-gray-100 flex-shrink-0">
      <div className="w-16 h-4 bg-gray-200 animate-pulse rounded self-end mb-2" />
      <div className="w-24 h-8 bg-gray-200 animate-pulse rounded self-end mb-4" />
      <div className="w-full h-10 bg-gray-200 animate-pulse rounded-full" />
    </div>
  </div>
);

const HotelCard = ({ hotel }: { hotel: MockHotel }) => {
  const [imgIdx, setImgIdx] = useState(0);

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIdx((prev) => (prev + 1) % hotel.images.length);
  };
  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIdx((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  const renderAmenityIcon = (am: Amenity) => {
    switch (am) {
      case 'Wifi': return <Wifi className="w-4 h-4" />;
      case 'AC': return <Wind className="w-4 h-4" />;
      case 'Breakfast': return <Coffee className="w-4 h-4" />;
      case 'Pool': return <Droplets className="w-4 h-4" />;
      case 'Parking': return <Car className="w-4 h-4" />;
    }
  };

  const idNum = parseInt(hotel.id.replace('h', ''));
  const roomsLeft = (idNum % 4) + 1; // 1 to 4 rooms
  const views = (idNum * 7) + 12;

  return (
    <Link to={`/dashboard/hotels/${hotel.id}`} className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow no-underline mb-4 group/card">
      <div className="flex flex-col sm:flex-row h-full">
        {/* Carousel */}
        <div className="relative w-full sm:w-[280px] h-[200px] sm:h-auto flex-shrink-0 group">
          <img src={hotel.images[imgIdx]} alt={hotel.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4"></div>
          
          <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-gray-800">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-gray-800">
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {hotel.images.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`} />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-amber-400">
                    {Array.from({ length: Math.floor(hotel.rating) }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{hotel.type}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-1 leading-tight group-hover/card:text-blue-600 transition-colors">{hotel.name}</h3>
                <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer mb-2">
                  {hotel.locality} <span className="text-gray-500 font-normal">| {hotel.distance}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end text-right">
                <div className="bg-blue-600 text-white px-2 py-1 rounded-t-md rounded-br-md text-sm font-bold flex items-center gap-1">
                  {hotel.rating} <span className="text-xs font-normal">/ 5</span>
                </div>
                <div className="text-xs font-bold text-[#1a1a1a] mt-1">{hotel.ratingText}</div>
                <div className="text-[10px] text-gray-500">{hotel.reviews} reviews</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4 mt-2">
              {hotel.amenities.map(am => (
                <div key={am} className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                  {renderAmenityIcon(am)} {am}
                </div>
              ))}
            </div>
            
            <div className="flex flex-col gap-2 mt-1">
              <div className="self-start inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-200">
                Free cancellation till 24 hrs
              </div>
              <div className="self-start inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-bold px-2 py-1 rounded border border-red-100">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                Only {roomsLeft} rooms left at this price • {views} people viewed this in the last hour
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="w-full sm:w-[220px] bg-gray-50/50 p-5 flex flex-col justify-end border-t sm:border-t-0 sm:border-l border-gray-100 flex-shrink-0">
          <div className="text-right mb-4">
            <div className="text-sm text-gray-500 line-through mb-0.5">₹ {hotel.originalPrice.toLocaleString('en-IN')}</div>
            <div className="text-2xl font-bold text-[#1a1a1a]">₹ {hotel.discountedPrice.toLocaleString('en-IN')}</div>
            <div className="text-xs text-gray-500 mt-1">+ ₹ {hotel.taxes.toLocaleString('en-IN')} taxes & fees</div>
            <div className="text-xs text-gray-400 mt-0.5">Per Night</div>
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
            View details
          </button>
        </div>
      </div>
    </Link>
  );
};

export const Hotels = () => {
  const [loading, setLoading] = useState(true);

  // Search State
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  
  // Guests popover
  const [showGuests, setShowGuests] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  // Filters
  const [priceMax, setPriceMax] = useState(20000);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'rating_desc'>('popularity');

  // Result state
  const [filteredHotels, setFilteredHotels] = useState<MockHotel[]>(MOCK_HOTELS);

  // Close popover when clicking outside
  const popoverRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowGuests(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Logic
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [destination, priceMax, selectedStars, selectedTypes, selectedAmenities, sortBy]);

  useEffect(() => {
    let result = [...MOCK_HOTELS];

    if (destination) {
      result = result.filter(h => 
        h.city.toLowerCase().includes(destination.toLowerCase()) || 
        h.name.toLowerCase().includes(destination.toLowerCase()) ||
        h.locality.toLowerCase().includes(destination.toLowerCase())
      );
    }

    result = result.filter(h => h.discountedPrice <= priceMax);

    if (selectedStars.length > 0) {
      result = result.filter(h => selectedStars.includes(Math.floor(h.rating)));
    }

    if (selectedTypes.length > 0) {
      result = result.filter(h => selectedTypes.includes(h.type));
    }

    if (selectedAmenities.length > 0) {
      result = result.filter(h => selectedAmenities.every(a => h.amenities.includes(a)));
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortBy === 'rating_desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // popularity (reviews)
      result.sort((a, b) => b.reviews - a.reviews);
    }

    setFilteredHotels(result);
  }, [destination, priceMax, selectedStars, selectedTypes, selectedAmenities, sortBy]);

  const clearFilters = () => {
    setPriceMax(20000);
    setSelectedStars([]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSortBy('popularity');
    setDestination('');
  };

  const toggleArrayItem = <T,>(arr: T[], setArr: React.Dispatch<React.SetStateAction<T[]>>, item: T) => {
    if (arr.includes(item)) setArr(arr.filter(i => i !== item));
    else setArr([...arr, item]);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] pb-12 font-sans">
      
      {/* Top Search Header */}
      <div className="bg-gradient-to-b from-[#0a1128] to-[#121c3a] pt-8 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200 relative z-20">
            
            {/* Destination */}
            <div className="flex-1 p-4 md:p-3 relative hover:bg-blue-50/50 cursor-pointer rounded-t-xl md:rounded-l-xl md:rounded-tr-none transition-colors">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">City, Property name or Location</label>
              <input 
                type="text" 
                placeholder="Where are you going?" 
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full text-xl font-bold text-[#1a1a1a] outline-none bg-transparent placeholder-gray-300"
              />
            </div>

            {/* Check in & Out */}
            <div className="flex-1 p-4 md:p-3 hover:bg-blue-50/50 cursor-pointer transition-colors flex">
              <div className="flex-1 pr-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Check-in</label>
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full text-lg font-bold text-[#1a1a1a] outline-none bg-transparent" />
              </div>
              <div className="w-px h-full bg-gray-200"></div>
              <div className="flex-1 pl-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Check-out</label>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full text-lg font-bold text-[#1a1a1a] outline-none bg-transparent" />
              </div>
            </div>

            {/* Rooms & Guests */}
            <div className="flex-1 p-4 md:p-3 relative hover:bg-blue-50/50 cursor-pointer transition-colors" ref={popoverRef} onClick={() => !showGuests && setShowGuests(true)}>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Rooms & Guests</label>
              <div className="text-xl font-bold text-[#1a1a1a]">
                <span className="text-blue-600">{rooms}</span> Room, <span className="text-blue-600">{adults + children}</span> Guests
              </div>
              
              {showGuests && (
                <div className="absolute top-[105%] right-0 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 animate-in fade-in zoom-in-95 cursor-default" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b">
                    <span className="font-bold text-[#1a1a1a]">Rooms</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center font-bold disabled:opacity-30 disabled:border-gray-300 disabled:text-gray-400 hover:bg-blue-50" disabled={rooms <= 1}>-</button>
                      <span className="font-bold w-4 text-center">{rooms}</span>
                      <button onClick={() => setRooms(rooms + 1)} className="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center font-bold hover:bg-blue-50">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b">
                    <span className="font-bold text-[#1a1a1a]">Adults</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center font-bold disabled:opacity-30 disabled:border-gray-300 disabled:text-gray-400 hover:bg-blue-50" disabled={adults <= 1}>-</button>
                      <span className="font-bold w-4 text-center">{adults}</span>
                      <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center font-bold hover:bg-blue-50">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="font-bold block text-[#1a1a1a]">Children</span>
                      <span className="text-xs text-gray-500">0 - 12 Years</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center font-bold disabled:opacity-30 disabled:border-gray-300 disabled:text-gray-400 hover:bg-blue-50" disabled={children <= 0}>-</button>
                      <span className="font-bold w-4 text-center">{children}</span>
                      <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center font-bold hover:bg-blue-50">+</button>
                    </div>
                  </div>
                  <button onClick={() => setShowGuests(false)} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">Apply</button>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="p-2 md:w-40 flex">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg flex items-center justify-center shadow-lg transition-transform hover:scale-[1.02]">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="flex flex-col lg:flex-row gap-6 relative z-10">
          
          {/* Left Sidebar: Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-[#1a1a1a]">Filters</h3>
                <button onClick={clearFilters} className="text-sm font-bold text-blue-600 hover:underline">CLEAR ALL</button>
              </div>

              {/* Price */}
              <div className="mb-8">
                <h4 className="font-bold text-sm text-[#1a1a1a] mb-4">Price per night</h4>
                <div className="px-2">
                  <input 
                    type="range" min="500" max="20000" step="500" 
                    value={priceMax} onChange={e => setPriceMax(parseInt(e.target.value))} 
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-xs font-bold text-gray-600">
                    <span>₹500</span>
                    <span>Up to ₹{priceMax.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-8">
                <h4 className="font-bold text-sm text-[#1a1a1a] mb-3">Star Rating</h4>
                <div className="flex gap-2">
                  {[3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => toggleArrayItem(selectedStars, setSelectedStars, star)}
                      className={`flex-1 py-1.5 rounded border text-sm font-bold flex items-center justify-center gap-1 transition-colors ${selectedStars.includes(star) ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {star} <Star className="w-3 h-3 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-8">
                <h4 className="font-bold text-sm text-[#1a1a1a] mb-3">Property Type</h4>
                <div className="space-y-2">
                  {(['Hotel', 'Resort', 'Homestay', 'Villa'] as PropertyType[]).map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedTypes.includes(type) ? 'bg-blue-600 border-blue-600' : 'border-gray-400 group-hover:border-blue-600'}`}>
                        {selectedTypes.includes(type) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-bold text-sm text-[#1a1a1a] mb-3">Amenities</h4>
                <div className="space-y-2">
                  {(['Wifi', 'AC', 'Breakfast', 'Pool', 'Parking'] as Amenity[]).map(am => (
                    <label key={am} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedAmenities.includes(am) ? 'bg-blue-600 border-blue-600' : 'border-gray-400 group-hover:border-blue-600'}`}>
                        {selectedAmenities.includes(am) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-gray-700">{am}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Content: Sort & Results */}
          <div className="flex-1 mt-6 lg:mt-0">
            {/* Sort Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex flex-wrap gap-4 items-center justify-between">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Showing {filteredHotels.length} Properties</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Sort By:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button onClick={() => setSortBy('popularity')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${sortBy === 'popularity' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-[#1a1a1a]'}`}>Popularity</button>
                  <button onClick={() => setSortBy('price_asc')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${sortBy === 'price_asc' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-[#1a1a1a]'}`}>Price: Low to High</button>
                  <button onClick={() => setSortBy('rating_desc')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${sortBy === 'rating_desc' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-[#1a1a1a]'}`}>User Rating</button>
                </div>
              </div>
            </div>

            {/* Results List */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => <HotelSkeleton key={i} />)}
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">No properties found</h3>
                <p className="text-gray-500 mb-6 max-w-sm">We couldn't find any properties matching your current filters. Try adjusting them or clearing all filters.</p>
                <button onClick={clearFilters} className="px-6 py-2 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

// Simple Check icon for checkboxes
const Check = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
