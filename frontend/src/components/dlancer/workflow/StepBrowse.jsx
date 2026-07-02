import { useState } from 'react';

export default function StepBrowse({ mission, isInterested, onExpressInterest, isReadOnly }) {
  const [motivation, setMotivation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onExpressInterest(motivation);
    setSubmitted(true);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm max-w-3xl mx-auto">
      <h3 className="text-lg font-extrabold text-brand-dark mb-2">Expression of Interest</h3>
      <p className="text-xs text-gray-400 mb-6">
        Let the client know you are interested in this mission. Bids and proposals are disabled; simply express your interest to initiate connection.
      </p>

      {isInterested || submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-6 text-center">
          <svg className="w-10 h-10 text-emerald-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0" />
          </svg>
          <h4 className="text-sm font-extrabold mb-1">Interest Registered!</h4>
          <p className="text-xs text-emerald-600/80 max-w-sm mx-auto">
            Your profile has been shared with the client. You will be notified if they accept you for a Connection session.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
              Motivation (Optional)
            </label>
            <textarea
              rows="4"
              value={motivation}
              onChange={e => setMotivation(e.target.value)}
              disabled={isReadOnly}
              placeholder="Briefly mention why you're a good fit for this project..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isReadOnly}
              className="px-6 py-3 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all disabled:opacity-50 shadow-md"
            >
              I'm Interested
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
