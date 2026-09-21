import React, { useState, useEffect } from 'react';
import { Plane, ArrowRight, Clock, Check, CreditCard, Download, ShieldCheck, User, Plus, Trash2, Printer } from 'lucide-react';

type Step = 'search' | 'passengers' | 'payment' | 'processing' | 'receipt';

interface MockFlight {
  id: string;
  airline: string;
  flightNum: string;
  departure: { time: string; code: string; name: string };
  arrival: { time: string; code: string; name: string };
  duration: string;
  stops: string;
  baggage: string;
  refundPolicy: string;
  price: number;
  color: string;
}

const MOCK_FLIGHTS: MockFlight[] = [
  { id: 'f1', airline: 'IndiGo', flightNum: '6E-101', departure: { time: '06:30', code: 'DEL', name: 'New Delhi' }, arrival: { time: '08:45', code: 'BOM', name: 'Mumbai' }, duration: '2h 15m', stops: 'Non-stop', baggage: '15kg Check-in', refundPolicy: 'Partially Refundable', price: 85, color: 'bg-blue-600' },
  { id: 'f2', airline: 'Air India', flightNum: 'AI-220', departure: { time: '09:00', code: 'DEL', name: 'New Delhi' }, arrival: { time: '11:15', code: 'BOM', name: 'Mumbai' }, duration: '2h 15m', stops: 'Non-stop', baggage: '25kg Check-in', refundPolicy: 'Fully Refundable', price: 95, color: 'bg-red-600' },
  { id: 'f3', airline: 'Vistara', flightNum: 'UK-910', departure: { time: '10:15', code: 'DEL', name: 'New Delhi' }, arrival: { time: '12:35', code: 'BOM', name: 'Mumbai' }, duration: '2h 20m', stops: 'Non-stop', baggage: '15kg Check-in', refundPolicy: 'Partially Refundable', price: 110, color: 'bg-purple-800' },
  { id: 'f4', airline: 'SpiceJet', flightNum: 'SG-110', departure: { time: '14:20', code: 'DEL', name: 'New Delhi' }, arrival: { time: '16:40', code: 'BOM', name: 'Mumbai' }, duration: '2h 20m', stops: 'Non-stop', baggage: '15kg Check-in', refundPolicy: 'Non-Refundable', price: 72, color: 'bg-orange-600' },
  { id: 'f5', airline: 'Akasa', flightNum: 'QP-130', departure: { time: '17:00', code: 'DEL', name: 'New Delhi' }, arrival: { time: '19:15', code: 'BOM', name: 'Mumbai' }, duration: '2h 15m', stops: 'Non-stop', baggage: '15kg Check-in', refundPolicy: 'Partially Refundable', price: 80, color: 'bg-orange-500' },
  { id: 'f6', airline: 'Air India Express', flightNum: 'IX-450', departure: { time: '19:45', code: 'DEL', name: 'New Delhi' }, arrival: { time: '22:00', code: 'BOM', name: 'Mumbai' }, duration: '2h 15m', stops: 'Non-stop', baggage: '20kg Check-in', refundPolicy: 'Partially Refundable', price: 88, color: 'bg-red-500' },
  { id: 'f7', airline: 'IndiGo', flightNum: '6E-404', departure: { time: '22:15', code: 'DEL', name: 'New Delhi' }, arrival: { time: '00:30', code: 'BOM', name: 'Mumbai' }, duration: '2h 15m', stops: 'Non-stop', baggage: '15kg Check-in', refundPolicy: 'Partially Refundable', price: 78, color: 'bg-blue-600' }
];

const ADDON_PRICES = {
  legroom: 15,
  baggage: 25,
  meal: 10,
};

export const Flights = () => {
  const [step, setStep] = useState<Step>('search');
  const [selectedFlight, setSelectedFlight] = useState<MockFlight | null>(null);
  
  // Passenger Details
  const [passengers, setPassengers] = useState([{ firstName: '', lastName: '', gender: 'Male', age: '' }]);
  const [addOns, setAddOns] = useState({ extraLegroom: false, extraBag: false, meal: false });

  // Payment Details
  const [paymentTab, setPaymentTab] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Fare Calculation
  const baseFare = (selectedFlight?.price || 0) * passengers.length;
  const taxes = baseFare * 0.12; // 12% tax
  const addonsTotal = ((addOns.extraLegroom ? ADDON_PRICES.legroom : 0) + 
                       (addOns.extraBag ? ADDON_PRICES.baggage : 0) + 
                       (addOns.meal ? ADDON_PRICES.meal : 0)) * passengers.length;
  const platformFee = 5;
  const totalFare = baseFare + taxes + addonsTotal + platformFee;

  // Handlers
  const handleSelectFlight = (f: MockFlight) => {
    setSelectedFlight(f);
    setStep('passengers');
  };

  const handleCardNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
    if (formatted.length <= 19) setCardNum(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4);
    }
    if (val.length <= 5) setExpiry(val);
  };

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      setStep('receipt');
    }, 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Views
  const renderStepRail = () => {
    const steps = ['Search', 'Passengers', 'Payment', 'E-Ticket'];
    const currentIndex = ['search', 'passengers', 'payment', 'processing', 'receipt'].indexOf(step);
    
    return (
      <div className="w-full max-w-4xl mx-auto mb-8 px-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
          {steps.map((s, i) => {
            let activeIndex = currentIndex;
            if (step === 'processing' || step === 'receipt') activeIndex = 3;
            const isActive = i <= activeIndex;
            return (
              <div key={s} className="flex flex-col items-center gap-2 bg-[#FBF6F0] px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isActive ? 'bg-[#8B1A3A] text-white' : 'bg-white border-2 border-gray-300 text-gray-400'}`}>
                  {isActive && i < activeIndex ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium uppercase tracking-wider ${isActive ? 'text-[#1A1A2E]' : 'text-gray-400'}`}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSearchResults = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-display font-semibold text-[#1A1A2E]">Select your departure</h2>
          <p className="text-gray-600 mt-1">New Delhi (DEL) to Mumbai (BOM) • {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        </div>
        <div className="text-sm font-medium text-gray-500">{MOCK_FLIGHTS.length} flights found</div>
      </div>

      <div className="space-y-4">
        {MOCK_FLIGHTS.map((flight) => (
          <div key={flight.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow relative">
            {/* Left section: Flight Info */}
            <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 relative">
              {/* Logo / Airline */}
              <div className="flex items-center md:flex-col md:items-start md:w-32 gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${flight.color}`}>
                  {flight.airline.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#1A1A2E]">{flight.airline}</div>
                  <div className="text-xs text-gray-500">{flight.flightNum}</div>
                </div>
              </div>

              {/* Timing & Route */}
              <div className="flex-1 flex items-center justify-between">
                <div className="text-center md:text-left">
                  <div className="text-xl font-bold text-[#1A1A2E]">{flight.departure.time}</div>
                  <div className="text-sm font-medium text-gray-500">{flight.departure.code}</div>
                </div>

                <div className="flex-1 px-4 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {flight.duration}
                  </div>
                  <div className="w-full flex items-center relative">
                    <div className="h-px bg-gray-300 w-full"></div>
                    <Plane className="w-4 h-4 text-gray-400 absolute left-1/2 -translate-x-1/2" />
                  </div>
                  <div className="text-[10px] uppercase text-gray-400 mt-1 tracking-wider font-semibold">{flight.stops}</div>
                </div>

                <div className="text-center md:text-right">
                  <div className="text-xl font-bold text-[#1A1A2E]">{flight.arrival.time}</div>
                  <div className="text-sm font-medium text-gray-500">{flight.arrival.code}</div>
                </div>
              </div>
            </div>

            {/* Dashed divider line */}
            <div className="hidden md:flex flex-col justify-between items-center w-px relative">
              <div className="w-4 h-4 bg-[#FBF6F0] rounded-full absolute -top-2 left-1/2 -translate-x-1/2 border-b border-gray-200"></div>
              <div className="w-full h-full border-l-2 border-dashed border-gray-200"></div>
              <div className="w-4 h-4 bg-[#FBF6F0] rounded-full absolute -bottom-2 left-1/2 -translate-x-1/2 border-t border-gray-200"></div>
            </div>

            {/* Right section: Price & Action */}
            <div className="bg-gray-50 p-6 md:w-56 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200">
              <div className="flex justify-between md:block items-center mb-4">
                <div className="text-2xl font-bold text-[#8B1A3A]">${flight.price}</div>
                <div className="text-xs text-gray-500">per adult</div>
              </div>
              <div className="space-y-1 mb-4 hidden md:block">
                <div className="text-[11px] text-gray-500 flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> {flight.baggage}</div>
                <div className="text-[11px] text-gray-500 flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> {flight.refundPolicy}</div>
              </div>
              <button onClick={() => handleSelectFlight(flight)} className="w-full bg-[#8B1A3A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#6c142c] transition-colors">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPassengerDetails = () => (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 animate-in slide-in-from-right-8">
      {/* Left Column: Form */}
      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-semibold text-[#1A1A2E]">Traveller Details</h3>
            <button 
              onClick={() => setPassengers([...passengers, { firstName: '', lastName: '', gender: 'Male', age: '' }])}
              className="text-[#8B1A3A] text-sm font-medium flex items-center gap-1 hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Traveller
            </button>
          </div>
          
          <div className="space-y-6">
            {passengers.map((p, idx) => (
              <div key={idx} className="bg-[#FBF6F0] p-5 rounded-xl border border-gray-200 relative">
                {idx > 0 && (
                  <button 
                    onClick={() => setPassengers(passengers.filter((_, i) => i !== idx))}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="font-semibold text-sm mb-4 text-[#1A1A2E] flex items-center gap-2">
                  <User className="w-4 h-4" /> Traveller {idx + 1}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs uppercase text-gray-500 font-medium mb-1">Gender</label>
                    <select 
                      value={p.gender}
                      onChange={e => { const newP = [...passengers]; newP[idx].gender = e.target.value; setPassengers(newP); }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-[#8B1A3A] outline-none bg-white"
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs uppercase text-gray-500 font-medium mb-1">Age</label>
                    <input 
                      type="number" placeholder="e.g. 28" 
                      value={p.age} onChange={e => { const newP = [...passengers]; newP[idx].age = e.target.value; setPassengers(newP); }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#8B1A3A] outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs uppercase text-gray-500 font-medium mb-1">First Name</label>
                    <input 
                      type="text" placeholder="John" 
                      value={p.firstName} onChange={e => { const newP = [...passengers]; newP[idx].firstName = e.target.value; setPassengers(newP); }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#8B1A3A] outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs uppercase text-gray-500 font-medium mb-1">Last Name</label>
                    <input 
                      type="text" placeholder="Doe" 
                      value={p.lastName} onChange={e => { const newP = [...passengers]; newP[idx].lastName = e.target.value; setPassengers(newP); }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#8B1A3A] outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-display font-semibold text-[#1A1A2E] mb-4">Add-ons</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={`cursor-pointer rounded-xl border p-4 transition-all ${addOns.extraLegroom ? 'border-[#8B1A3A] bg-red-50' : 'border-gray-200 hover:border-[#8B1A3A]/50'}`}>
              <div className="flex items-center gap-3 mb-2">
                <input type="checkbox" checked={addOns.extraLegroom} onChange={e => setAddOns({...addOns, extraLegroom: e.target.checked})} className="accent-[#8B1A3A]" />
                <span className="font-semibold text-sm text-[#1A1A2E]">Extra Legroom</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">Select seats with extra space</div>
              <div className="text-sm font-bold text-[#8B1A3A]">+${ADDON_PRICES.legroom}/pax</div>
            </label>

            <label className={`cursor-pointer rounded-xl border p-4 transition-all ${addOns.extraBag ? 'border-[#8B1A3A] bg-red-50' : 'border-gray-200 hover:border-[#8B1A3A]/50'}`}>
              <div className="flex items-center gap-3 mb-2">
                <input type="checkbox" checked={addOns.extraBag} onChange={e => setAddOns({...addOns, extraBag: e.target.checked})} className="accent-[#8B1A3A]" />
                <span className="font-semibold text-sm text-[#1A1A2E]">Extra Baggage</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">Add +15kg check-in bag</div>
              <div className="text-sm font-bold text-[#8B1A3A]">+${ADDON_PRICES.baggage}/pax</div>
            </label>

            <label className={`cursor-pointer rounded-xl border p-4 transition-all ${addOns.meal ? 'border-[#8B1A3A] bg-red-50' : 'border-gray-200 hover:border-[#8B1A3A]/50'}`}>
              <div className="flex items-center gap-3 mb-2">
                <input type="checkbox" checked={addOns.meal} onChange={e => setAddOns({...addOns, meal: e.target.checked})} className="accent-[#8B1A3A]" />
                <span className="font-semibold text-sm text-[#1A1A2E]">In-flight Meal</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">Pre-book hot meal & beverage</div>
              <div className="text-sm font-bold text-[#8B1A3A]">+${ADDON_PRICES.meal}/pax</div>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Summary */}
      <div className="w-full lg:w-80">
        <aside className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-[#1A1A2E] text-white">
            <h4 className="font-bold">Fare Summary</h4>
            <div className="text-sm text-gray-300 mt-1">{selectedFlight?.departure.code} to {selectedFlight?.arrival.code} • {passengers.length} Traveller(s)</div>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Fare ({passengers.length} × ${selectedFlight?.price})</span>
              <span className="font-medium">${baseFare.toFixed(2)}</span>
            </div>
            
            {addonsTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Add-ons</span>
                <span className="font-medium">${addonsTotal.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes & Fees (12%)</span>
              <span className="font-medium">${taxes.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform Fee</span>
              <span className="font-medium">${platformFee.toFixed(2)}</span>
            </div>
            
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-[#1A1A2E]">Total</span>
              <span className="text-2xl font-bold text-[#8B1A3A]">${totalFare.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-5 bg-gray-50 border-t border-gray-100">
            <button 
              onClick={() => setStep('payment')}
              className="w-full bg-[#8B1A3A] text-white py-3 rounded-xl font-medium hover:bg-[#6c142c] transition-all flex items-center justify-center gap-2"
            >
              Continue to Payment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 animate-in slide-in-from-right-8">
      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-display font-semibold text-[#1A1A2E] mb-6">Payment Method</h3>
          
          <div className="flex border-b border-gray-200 mb-6">
            <button onClick={() => setPaymentTab('card')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${paymentTab === 'card' ? 'border-[#8B1A3A] text-[#8B1A3A]' : 'border-transparent text-gray-500 hover:text-[#1A1A2E]'}`}>Credit/Debit Card</button>
            <button onClick={() => setPaymentTab('upi')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${paymentTab === 'upi' ? 'border-[#8B1A3A] text-[#8B1A3A]' : 'border-transparent text-gray-500 hover:text-[#1A1A2E]'}`}>UPI</button>
            <button onClick={() => setPaymentTab('netbanking')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${paymentTab === 'netbanking' ? 'border-[#8B1A3A] text-[#8B1A3A]' : 'border-transparent text-gray-500 hover:text-[#1A1A2E]'}`}>Net Banking</button>
          </div>

          <form onSubmit={submitPayment} className="space-y-4">
            {paymentTab === 'card' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs uppercase text-gray-500 font-medium mb-1">Card Number</label>
                  <div className="relative">
                    <input 
                      type="text" required placeholder="0000 0000 0000 0000" 
                      value={cardNum} onChange={handleCardNumChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-[#8B1A3A] outline-none tracking-widest font-mono"
                    />
                    <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs uppercase text-gray-500 font-medium mb-1">Expiry Date</label>
                    <input 
                      type="text" required placeholder="MM/YY" 
                      value={expiry} onChange={handleExpiryChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-[#8B1A3A] outline-none font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs uppercase text-gray-500 font-medium mb-1">CVV</label>
                    <input 
                      type="password" required placeholder="***" maxLength={3}
                      value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-[#8B1A3A] outline-none font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-500 font-medium mb-1">Name on Card</label>
                  <input type="text" required placeholder="John Doe" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-[#8B1A3A] outline-none" />
                </div>
              </div>
            )}
            {paymentTab === 'upi' && (
              <div className="p-8 text-center animate-in fade-in border border-dashed border-gray-300 rounded-xl bg-gray-50">
                <p className="text-gray-600 mb-4">Enter your UPI ID to receive a payment request.</p>
                <input type="text" required placeholder="username@upi" className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-[#8B1A3A] outline-none text-center" />
              </div>
            )}
            {paymentTab === 'netbanking' && (
              <div className="p-8 text-center animate-in fade-in border border-dashed border-gray-300 rounded-xl bg-gray-50">
                <p className="text-gray-600 mb-4">Select your bank from the list below.</p>
                <select className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-[#8B1A3A] outline-none bg-white">
                  <option>HDFC Bank</option>
                  <option>State Bank of India</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <ShieldCheck className="w-5 h-5" /> 100% Secure Transaction
              </div>
              <button type="submit" className="bg-[#1A1A2E] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black transition-all">
                Pay ${totalFare.toFixed(2)}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Re-use Sticky Summary */}
      <div className="w-full lg:w-80">
        <aside className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-[#1A1A2E] text-white">
            <h4 className="font-bold">Fare Breakdown</h4>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between text-sm"><span className="text-gray-600">Base Fare</span><span className="font-medium">${baseFare.toFixed(2)}</span></div>
            {addonsTotal > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Add-ons</span><span className="font-medium">${addonsTotal.toFixed(2)}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-gray-600">Taxes</span><span className="font-medium">${taxes.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Fee</span><span className="font-medium">${platformFee.toFixed(2)}</span></div>
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center"><span className="font-bold text-[#1A1A2E]">Total to Pay</span><span className="text-xl font-bold text-[#8B1A3A]">${totalFare.toFixed(2)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="max-w-md mx-auto text-center py-20 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 rounded-full border-4 border-[#8B1A3A]/20 border-t-[#8B1A3A] animate-spin mx-auto mb-8"></div>
      <h2 className="text-2xl font-display font-semibold text-[#1A1A2E] mb-2">Processing Payment...</h2>
      <p className="text-gray-500">Please don't refresh or close this window.</p>
    </div>
  );

  const renderReceipt = () => (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-center mb-6 px-4 md:px-0">
        <h2 className="text-2xl font-display font-semibold text-green-600 flex items-center gap-2"><Check className="w-8 h-8" /> Booking Confirmed!</h2>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm">
          <Printer className="w-4 h-4" /> Print Ticket
        </button>
      </div>

      {/* Boarding Pass UI */}
      <div className="bg-white rounded-[24px] shadow-xl overflow-hidden border border-gray-200 flex flex-col md:flex-row relative">
        {/* Left Side: Flight Info */}
        <div className="flex-1 p-8 relative border-r-2 border-dashed border-gray-200">
          {/* Top Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Airline</div>
              <div className="text-xl font-bold text-[#1A1A2E]">{selectedFlight?.airline}</div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Flight Number</div>
              <div className="text-xl font-bold text-[#8B1A3A]">{selectedFlight?.flightNum}</div>
            </div>
          </div>

          {/* Route & Timing */}
          <div className="flex items-center justify-between mb-8 bg-[#FBF6F0] p-6 rounded-2xl">
            <div>
              <div className="text-4xl font-display font-bold text-[#1A1A2E]">{selectedFlight?.departure.code}</div>
              <div className="text-xs font-medium text-gray-500 uppercase mt-1">{selectedFlight?.departure.name}</div>
              <div className="text-xl font-bold mt-2">{selectedFlight?.departure.time}</div>
            </div>
            <div className="flex flex-col items-center px-4 flex-1">
              <Plane className="w-6 h-6 text-[#8B1A3A] mb-2" />
              <div className="w-full h-px bg-gray-300 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FBF6F0] px-2 text-[10px] uppercase font-bold text-gray-400">Direct</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">{selectedFlight?.duration}</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-display font-bold text-[#1A1A2E]">{selectedFlight?.arrival.code}</div>
              <div className="text-xs font-medium text-gray-500 uppercase mt-1">{selectedFlight?.arrival.name}</div>
              <div className="text-xl font-bold mt-2">{selectedFlight?.arrival.time}</div>
            </div>
          </div>

          {/* Passenger Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-xs uppercase font-bold text-gray-400">Passenger</div>
              <div className="font-semibold text-sm truncate">{passengers[0].firstName} {passengers[0].lastName} {passengers.length > 1 ? `+${passengers.length - 1}` : ''}</div>
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-gray-400">Date</div>
              <div className="font-semibold text-sm">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-gray-400">Gate</div>
              <div className="font-semibold text-sm">TBA</div>
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-gray-400">Seat</div>
              <div className="font-semibold text-sm">Check-in</div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#FBF6F0] rounded-full"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#FBF6F0] rounded-full"></div>
        </div>

        {/* Right Side: Stub & QR */}
        <div className="w-full md:w-64 bg-[#1A1A2E] text-white p-8 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-1">PNR Number</div>
            <div className="text-2xl font-mono font-bold tracking-widest mb-6">X7M9LQ</div>
            
            <div className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-1">Total Paid</div>
            <div className="text-xl font-bold">${totalFare.toFixed(2)}</div>
          </div>

          <div className="mt-8 flex justify-center bg-white p-4 rounded-xl">
            <div className="w-full h-[80px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute w-[150%] border-t-2 border-dashed border-[#1A1A2E]/20 left-0 top-1/2 -translate-y-1/2 -rotate-12"></div>
              <Plane className="w-14 h-14 text-[#1A1A2E] z-10 transform rotate-[33deg]" strokeWidth={1.5} fill="#1A1A2E" fillOpacity={0.1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF6F0] pt-8 pb-24 font-sans">
      {step !== 'processing' && step !== 'receipt' && renderStepRail()}
      
      <div className="px-4">
        {step === 'search' && renderSearchResults()}
        {step === 'passengers' && renderPassengerDetails()}
        {step === 'payment' && renderPayment()}
        {step === 'processing' && renderProcessing()}
        {step === 'receipt' && renderReceipt()}
      </div>
    </div>
  );
};
