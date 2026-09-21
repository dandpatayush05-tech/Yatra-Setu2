import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, Wallet, Smartphone, Building, User, Mail, Phone, 
  Calendar, Download, CheckCircle2, QrCode, Tag, Hotel, ArrowRight, Loader2, Info
} from 'lucide-react';
import { createBooking } from '../api/bookings';

export const HotelCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // If no state is passed, redirect back to hotels
  useEffect(() => {
    if (!state || !state.hotel) {
      navigate('/dashboard/hotels');
    }
  }, [state, navigate]);

  if (!state || !state.hotel) return null;

  const { hotel, selectedRooms, total: initialTotal, nights } = state;

  const [step, setStep] = useState(2); // 2: Guest Details, 3: Payment, 4: Confirmation
  
  // Step 2: Guest Details State
  const [primaryGuest, setPrimaryGuest] = useState({ name: '', email: '', phone: '', requests: '', arrival: '14:00' });
  const [roomGuests, setRoomGuests] = useState<Record<string, string>>({});
  
  // Step 3: Payment State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Step 4: Confirmation State
  const [bookingId, setBookingId] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Calculations
  const discountAmount = isCouponApplied ? initialTotal * 0.2 : 0;
  const finalTotal = initialTotal - discountAmount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'YATRA20') {
      setIsCouponApplied(true);
    } else {
      setIsCouponApplied(false);
      alert('Invalid coupon code');
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newBookingId = `BKG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const newTxId = `TXN-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
    
    setBookingId(newBookingId);
    setTransactionId(newTxId);

    // Push to mock API / localStorage for Bookings dashboard
    try {
      await createBooking({
        id: newBookingId,
        type: 'hotel',
        title: hotel.name,
        subtitle: `${selectedRooms.length} Room(s) • ${nights} Night(s)`,
        status: 'confirmed',
        date: new Date().toISOString(),
        amount: finalTotal,
      });
    } catch (e) {
      console.warn("Failed to push to API, moving on", e);
    }

    setProcessing(false);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] font-sans pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm w-full h-[60px] flex items-center px-4 md:px-8 justify-between">
        <div className="flex items-center gap-4">
          {step < 4 && (
             <button onClick={() => step === 2 ? navigate(-1) : setStep(prev => prev - 1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
               <ArrowLeft className="w-5 h-5 text-gray-700" />
             </button>
          )}
          <h1 className="text-lg font-bold text-[#1a1a1a]">Complete your booking</h1>
        </div>
        
        {/* Stepper UI */}
        <div className="hidden md:flex items-center gap-2 text-sm font-bold">
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center"><CheckCircle2 className="w-4 h-4"/></div> <span className="text-gray-500">Rooms</span></div>
          <div className="w-8 h-0.5 bg-gray-200"></div>
          <div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div> <span className={step >= 2 ? 'text-[#1a1a1a]' : 'text-gray-400'}>Guest Details</span></div>
          <div className="w-8 h-0.5 bg-gray-200"></div>
          <div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div> <span className={step >= 3 ? 'text-[#1a1a1a]' : 'text-gray-400'}>Payment</span></div>
          <div className="w-8 h-0.5 bg-gray-200"></div>
          <div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>4</div> <span className={step >= 4 ? 'text-[#1a1a1a]' : 'text-gray-400'}>Confirmation</span></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* STEP 2: GUEST DETAILS */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold flex items-center gap-2"><User className="text-blue-600"/> Primary Guest Details</h2>
                <p className="text-gray-500 text-sm mt-1">This information will be used for booking confirmation and updates.</p>
              </div>
              <div className="p-6 space-y-6 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                    <input type="text" value={primaryGuest.name} onChange={e => setPrimaryGuest({...primaryGuest, name: e.target.value})} className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none border" placeholder="e.g. Rajdeep Singh" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <input type="email" value={primaryGuest.email} onChange={e => setPrimaryGuest({...primaryGuest, email: e.target.value})} className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none border" placeholder="name@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                    <input type="tel" value={primaryGuest.phone} onChange={e => setPrimaryGuest({...primaryGuest, phone: e.target.value})} className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none border" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estimated Arrival</label>
                    <select value={primaryGuest.arrival} onChange={e => setPrimaryGuest({...primaryGuest, arrival: e.target.value})} className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none border bg-white">
                      <option value="12:00">12:00 PM - 02:00 PM</option>
                      <option value="14:00">02:00 PM - 04:00 PM</option>
                      <option value="16:00">04:00 PM - 06:00 PM</option>
                      <option value="18:00">06:00 PM - 08:00 PM</option>
                      <option value="20:00">08:00 PM - 10:00 PM</option>
                      <option value="late">Late Check-in (After 10 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-bold mb-4 text-[#1a1a1a]">Room Guests</h3>
                  <div className="space-y-4">
                    {selectedRooms.map((room: any, index: number) => (
                      <div key={room.roomId} className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
                        <div className="w-32">
                          <div className="text-xs font-bold text-gray-500 uppercase">Room {index + 1}</div>
                          <div className="font-bold">{room.bedSetup}</div>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Guest Name for this room" 
                          value={roomGuests[room.roomId] || ''} 
                          onChange={e => setRoomGuests({...roomGuests, [room.roomId]: e.target.value})}
                          className="flex-1 border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-600 border text-sm" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Special Requests (Optional)</label>
                  <textarea value={primaryGuest.requests} onChange={e => setPrimaryGuest({...primaryGuest, requests: e.target.value})} rows={3} className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none border resize-none" placeholder="e.g. Quiet room, high floor..."></textarea>
                </div>
              </div>
              <div className="p-6 bg-white border-t border-gray-200 flex justify-end">
                <button 
                  onClick={() => setStep(3)} 
                  disabled={!primaryGuest.name || !primaryGuest.email || !primaryGuest.phone}
                  className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  Continue to Payment <ArrowRight className="w-4 h-4"/>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-right-8">
               <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="text-blue-600"/> Payment Options</h2>
                <p className="text-gray-500 text-sm mt-1">Select your preferred method to complete the booking securely.</p>
              </div>
              
              <div className="flex flex-col md:flex-row min-h-[400px]">
                {/* Tabs */}
                <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-200 flex flex-row md:flex-col p-4 gap-2 overflow-x-auto">
                  <button onClick={() => setPaymentMethod('card')} className={`flex items-center gap-3 p-4 rounded-xl font-bold text-sm transition-colors ${paymentMethod === 'card' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <CreditCard className="w-5 h-5"/> Credit / Debit Card
                  </button>
                  <button onClick={() => setPaymentMethod('upi')} className={`flex items-center gap-3 p-4 rounded-xl font-bold text-sm transition-colors ${paymentMethod === 'upi' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <Smartphone className="w-5 h-5"/> UPI (GPay, PhonePe)
                  </button>
                  <button onClick={() => setPaymentMethod('netbanking')} className={`flex items-center gap-3 p-4 rounded-xl font-bold text-sm transition-colors ${paymentMethod === 'netbanking' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <Building className="w-5 h-5"/> Net Banking
                  </button>
                  <button onClick={() => setPaymentMethod('pay_at_hotel')} className={`flex items-center gap-3 p-4 rounded-xl font-bold text-sm transition-colors ${paymentMethod === 'pay_at_hotel' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <Wallet className="w-5 h-5"/> Pay at Hotel
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-8">
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 max-w-sm animate-in fade-in">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none border font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry</label>
                          <input type="text" placeholder="MM/YY" className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none border font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVV</label>
                          <input type="password" placeholder="•••" className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none border font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name on Card</label>
                        <input type="text" placeholder="Full Name" className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none border" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in space-y-4">
                      <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                        <QrCode className="w-16 h-16 text-gray-400" />
                      </div>
                      <h3 className="font-bold text-lg">Scan to Pay</h3>
                      <p className="text-gray-500 text-sm max-w-xs">Open any UPI app and scan the QR code to securely pay ₹{finalTotal.toLocaleString('en-IN')}</p>
                      <div className="w-full flex items-center gap-4 my-4"><div className="flex-1 h-px bg-gray-200"></div><span className="text-xs text-gray-400 font-bold uppercase">OR</span><div className="flex-1 h-px bg-gray-200"></div></div>
                      <input type="text" placeholder="Enter UPI ID (e.g. name@okhdfcbank)" className="w-full max-w-sm border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none border text-center" />
                    </div>
                  )}

                  {paymentMethod === 'pay_at_hotel' && (
                    <div className="flex flex-col justify-center h-full animate-in fade-in max-w-sm">
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm mb-6 flex gap-3">
                        <Info className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
                        <p>No payment is required now. You will pay the full amount directly at the hotel desk upon check-in.</p>
                      </div>
                      <p className="font-bold text-gray-600 mb-2">Requirements for check-in:</p>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                        <li>Valid Government ID</li>
                        <li>Booking Voucher</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <button onClick={() => setStep(2)} className="text-gray-500 font-bold hover:text-gray-800 text-sm">← Back to Guest Details</button>
                <button 
                  onClick={handlePayment} 
                  disabled={processing}
                  className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center gap-2 min-w-[200px] justify-center"
                >
                  {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : `Pay ₹${finalTotal.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION VOUCHER */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8">
              {/* Success Banner */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h2>
                <p className="text-green-700">Your hotel reservation is confirmed. A copy of this voucher has been sent to {primaryGuest.email}</p>
              </div>

              {/* Boarding Pass Style Voucher */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row relative">
                {/* Left Side (Details) */}
                <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-dashed border-gray-300 relative">
                  {/* Decorative cutouts */}
                  <div className="hidden md:block absolute -right-4 top-0 w-8 h-8 bg-[#F2F4F7] rounded-full -mt-4"></div>
                  <div className="hidden md:block absolute -right-4 bottom-0 w-8 h-8 bg-[#F2F4F7] rounded-full -mb-4"></div>

                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Hotel Booking Voucher</div>
                      <h3 className="text-2xl font-bold text-[#1a1a1a]">{hotel.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Building className="w-4 h-4"/> {hotel.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Booking ID</div>
                      <div className="text-lg font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{bookingId}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check-in</div>
                      <div className="text-lg font-bold text-[#1a1a1a]">Today</div>
                      <div className="text-sm text-gray-500">From 2:00 PM</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check-out</div>
                      <div className="text-lg font-bold text-[#1a1a1a]">In {nights} day(s)</div>
                      <div className="text-sm text-gray-500">Till 11:00 AM</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Room Details</div>
                    <div className="space-y-4">
                      {selectedRooms.map((room: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                          <div>
                            <div className="font-bold text-[#1a1a1a]">{room.bedSetup} {room.isAc ? '• AC' : '• Non-AC'}</div>
                            <div className="text-sm text-gray-500">Guest: {roomGuests[room.roomId] || primaryGuest.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-[#1a1a1a] capitalize">{room.mealPlan.replace('_', ' ')}</div>
                            {room.extraMattress && <div className="text-xs text-gray-500">+ Extra Mattress</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm font-medium text-gray-600 bg-blue-50/50 p-4 rounded-xl">
                    <Phone className="w-5 h-5 text-blue-500" />
                    Hotel Front Desk: +91 12345 67890
                  </div>
                </div>

                {/* Right Side (Stub/QR) */}
                <div className="w-full md:w-72 bg-gray-50 p-8 flex flex-col justify-between items-center text-center relative">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Primary Guest</div>
                    <div className="font-bold text-[#1a1a1a] mb-6">{primaryGuest.name}</div>
                    
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Amount Paid</div>
                    <div className="text-3xl font-bold text-green-600 mb-1">₹{finalTotal.toLocaleString('en-IN')}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-6">{paymentMethod.replace(/_/g, ' ')}</div>
                  </div>

                  <div className="w-40 h-40 bg-white border border-gray-200 rounded-xl p-2 flex items-center justify-center">
                    {/* Placeholder QR */}
                    <div className="w-full h-full border-[8px] border-[#1a1a1a] flex flex-col justify-between p-2">
                      <div className="flex justify-between"><div className="w-4 h-4 bg-[#1a1a1a]"></div><div className="w-4 h-4 bg-[#1a1a1a]"></div></div>
                      <div className="flex justify-center"><QrCode className="w-12 h-12 text-[#1a1a1a]"/></div>
                      <div className="flex justify-between"><div className="w-4 h-4 bg-[#1a1a1a]"></div><div className="w-4 h-4 bg-[#1a1a1a]"></div></div>
                    </div>
                  </div>

                  <div className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest break-all">
                    {transactionId}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5"/> Download Voucher
                </button>
                <button onClick={() => navigate('/dashboard/bookings')} className="bg-[#1a1a1a] text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5"/> View in Bookings
                </button>
                <button className="bg-white border border-red-200 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center">
                  Cancel Booking
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Sticky Sidebar: Fare Summary (Steps 2 & 3 only) */}
        {step < 4 && (
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-[84px] overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-[#1a1a1a] text-lg">Fare Summary</h3>
                <p className="text-sm text-gray-500">{selectedRooms.length} Room(s) for {nights} Night(s)</p>
              </div>
              
              <div className="p-6 space-y-4">
                {selectedRooms.map((room: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium text-gray-800">Room {idx + 1} ({room.bedSetup})</div>
                      <div className="text-xs text-gray-500 capitalize">{room.mealPlan.replace(/_/g, ' ')}</div>
                    </div>
                    <div className="font-medium">₹{room.price.toLocaleString('en-IN')}</div>
                  </div>
                ))}

                <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                  <span>Taxes & Fees (12% GST included)</span>
                </div>

                {isCouponApplied && (
                  <div className="flex justify-between text-sm font-bold text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2">
                    <span className="flex items-center gap-1"><Tag className="w-4 h-4"/> YATRA20 Applied</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {step === 3 && !isCouponApplied && (
                <div className="px-6 pb-6">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Coupon Code" 
                      value={couponCode} 
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase outline-none focus:border-blue-600"
                    />
                    <button onClick={handleApplyCoupon} className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black">Apply</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Try YATRA20 for 20% off!</p>
                </div>
              )}

              <div className="p-6 bg-[#1a1a1a] text-white flex justify-between items-center">
                <span className="font-bold text-gray-300">Total Payable</span>
                <span className="text-2xl font-bold">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
