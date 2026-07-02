import { useState } from 'react';

export default function MissionFAQ({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
      <h3 className="text-xs font-extrabold text-brand-dark uppercase tracking-widest">Frequently Asked Questions</h3>
      
      <div className="divide-y divide-gray-50">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-3">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs font-extrabold text-brand-dark hover:text-bts-gold transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="text-gray-300 font-bold ml-2">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
