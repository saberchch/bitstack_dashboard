import { useState, useEffect } from 'react';
import { bookPrivateSession } from '../utils/enrollmentStorage';
import { addRequestConvo } from '../utils/messagesStorage';
import { getBalance, deductBalance, checkAffordability } from '../utils/balanceStorage';

export default function BookingModal({ 
  isOpen, 
  onClose, 
  mentor, 
  preselectedDate, 
  preselectedSlot 
}) {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(1);
  const [date, setDate] = useState(preselectedDate || 3);
  const [slot, setSlot] = useState(preselectedSlot || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Live balance – re-read on every render so it stays current after deductions
  const userBalance = getBalance();

  // Sync state with props when modal opens or inputs change
  useEffect(() => {
    if (isOpen) {
      setDate(preselectedDate || 3);
      setSlot(preselectedSlot || (mentor?.slots.find(s => s.available)?.time || ""));
      setTopic("");
      setDescription("");
      setDuration(1);
      setIsSuccess(false);
      setIsSubmitting(false);
      setError("");
    }
  }, [isOpen, preselectedDate, preselectedSlot, mentor]);

  if (!isOpen || !mentor) return null;

  const totalCost = duration * mentor.rate;
  const { affordable: hasEnoughBalance } = checkAffordability(totalCost);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please specify the session topic.");
      return;
    }
    if (!slot) {
      setError("Please select a time slot.");
      return;
    }
    if (!hasEnoughBalance) {
      setError("Insufficient BTS balance to book this session.");
      return;
    }

    // Re-check balance just before submitting (may have changed between renders)
    const deduction = deductBalance(totalCost, `Private session with ${mentor.name}`);
    if (!deduction.ok) {
      setError(deduction.error);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await bookPrivateSession({
        mentorId: mentor.id,
        mentorName: mentor.name,
        mentorAvatar: mentor.avatar,
        date: date,
        slot: slot,
        topic: topic,
        duration: duration,
        cost: totalCost
      });

      // Spawn a new Requests message thread in storage
      addRequestConvo({
        mentorName: mentor.name,
        mentorAvatar: mentor.avatar,
        topic: topic,
        price: `${totalCost} BTS`,
        date: `May ${date}, 2026 at ${slot}`,
        duration: `${duration} Hour${duration > 1 ? 's' : ''}`,
        message: description || `Hi ${mentor.name}, I would like to request a private session on "${topic}" on May ${date} at ${slot}.`
      });

      setIsSuccess(true);
    } catch (err) {
      console.error('[BookingModal] Failed to create booking:', err);
      setError('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative flex flex-col transition-all transform scale-100"
        data-purpose="booking-modal"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
            <span className="material-symbols-outlined text-bts-gold">menu_book</span>
            {isSuccess ? "Booking Confirmed" : "Request Private Session"}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-brand-dark p-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined !text-lg">close</span>
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 bg-green-50 rounded-full border border-green-200 flex items-center justify-center text-green-500 shadow-sm animate-bounce">
              <span className="material-symbols-outlined !text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-brand-dark">Session Request Sent!</h4>
              <p className="text-xs text-gray-500 mt-2 max-w-sm leading-relaxed mx-auto">
                Your request for a session with <strong className="text-brand-dark font-bold">{mentor.name}</strong> on <strong className="text-brand-dark font-bold">May {date}</strong> at <strong className="text-brand-dark font-bold">{slot}</strong> has been submitted.
              </p>
            </div>

            <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-left divide-y divide-gray-100 space-y-2.5">
              <div className="flex justify-between items-center text-xs pb-2.5">
                <span className="text-gray-400 font-semibold">Reserved Amount</span>
                <span className="font-extrabold text-bts-gold">{totalCost} BTS</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2.5">
                <span className="text-gray-400 font-semibold">New Balance</span>
                <span className="font-bold text-brand-dark">{(userBalance - totalCost).toLocaleString()} BTS</span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-brand-dark text-white py-3 rounded-xl font-bold text-xs hover:bg-bts-gold transition-colors shadow-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Mentor Short Info */}
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
              <img 
                src={mentor.avatar} 
                alt={mentor.name} 
                className="w-12 h-12 rounded-lg object-cover border border-yellow-50"
              />
              <div className="flex-1">
                <h4 className="font-bold text-sm text-brand-dark leading-tight">{mentor.name}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{mentor.role}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-bold bg-yellow-50 text-bts-gold px-1.5 py-0.5 rounded border border-yellow-100">
                    {mentor.rate} BTS/hr
                  </span>
                  <div className="flex items-center text-bts-gold">
                    <span className="material-symbols-outlined !text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-[10px] font-bold ml-0.5">{mentor.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined !text-base shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Topic Input */}
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                Session Topic *
              </label>
              <input 
                type="text"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:ring-1 focus:ring-bts-gold focus:border-bts-gold outline-none"
                placeholder="e.g. Smart Contract Security Audit review"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Date and Time selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                  Select Date
                </label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:ring-1 focus:ring-bts-gold outline-none"
                  value={date}
                  onChange={(e) => setDate(Number(e.target.value))}
                  disabled={isSubmitting}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12].map(day => (
                    <option key={day} value={day}>May {day}, 2026</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                  Select Slot *
                </label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:ring-1 focus:ring-bts-gold outline-none"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Choose slot...</option>
                  {mentor.slots.map((s, idx) => (
                    <option key={idx} value={s.time} disabled={!s.available}>
                      {s.time} {!s.available ? "(Booked)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration and Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                  Duration
                </label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-dark focus:ring-1 focus:ring-bts-gold outline-none"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  disabled={isSubmitting}
                >
                  <option value={1}>1 Hour</option>
                  <option value={2}>2 Hours</option>
                  <option value={3}>3 Hours</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                  Learning Goals
                </label>
                <textarea 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-medium text-brand-dark focus:ring-1 focus:ring-bts-gold focus:border-bts-gold outline-none h-[42px] resize-none"
                  placeholder="What would you like to achieve?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Pricing Summary */}
            <div className={`border rounded-xl p-4 divide-y space-y-2.5 ${
              hasEnoughBalance
                ? 'bg-gray-50 border-gray-100 divide-gray-200/50'
                : 'bg-red-50 border-red-100 divide-red-100'
            }`}>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-semibold">Your Balance</span>
                <span className="font-bold text-brand-dark">{userBalance.toLocaleString()} BTS</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2.5">
                <span className="text-gray-400 font-semibold">Session Cost ({duration} hr × {mentor.rate} BTS)</span>
                <span className="font-extrabold text-bts-gold">-{totalCost.toLocaleString()} BTS</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2.5">
                <span className="text-gray-400 font-semibold">Remaining Balance</span>
                <span className={`font-bold ${
                  hasEnoughBalance ? 'text-brand-dark' : 'text-red-600 font-extrabold'
                }`}>
                  {hasEnoughBalance
                    ? `${(userBalance - totalCost).toLocaleString()} BTS`
                    : `Shortfall: ${(totalCost - userBalance).toLocaleString()} BTS`
                  }
                </span>
              </div>
            </div>

            {/* Insufficient funds banner */}
            {!hasEnoughBalance && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3.5 text-xs text-red-600">
                <span className="material-symbols-outlined !text-base shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                <span>
                  <strong>Insufficient BTS balance.</strong> You need {(totalCost - userBalance).toLocaleString()} more BTS to book this session.
                  Top up your wallet via the <strong>BTS Credit</strong> section.
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-200 text-brand-dark py-3 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer text-center"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className={`flex-1 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-2 ${
                  isSubmitting 
                    ? 'bg-bts-gold/70' 
                    : 'bg-bts-gold hover:bg-opacity-95'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
