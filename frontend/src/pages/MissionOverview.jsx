import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDLancerState from '../hooks/useDLancerState';
import MissionHeader from '../components/dlancer/mission/MissionHeader';
import ClientCard from '../components/dlancer/mission/ClientCard';
import MissionDetails from '../components/dlancer/mission/MissionDetails';
import MissionFAQ from '../components/dlancer/mission/MissionFAQ';

export default function MissionOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const state = useDLancerState();
  const [motivation, setMotivation] = useState('');
  const [interested, setInterested] = useState(state.isInterested(id));

  const mission = state.getMissionById(id);

  if (!mission) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-gray-500">Mission not found</h2>
        <button onClick={() => navigate('/d-lancer')} className="mt-4 text-bts-gold font-bold">
          ➔ Back to D-Lancer
        </button>
      </div>
    );
  }

  const handleInterestSubmit = (e) => {
    e.preventDefault();
    state.handleExpressInterest(id);
    setInterested(true);
    alert('Registered interest successfully! Auto-transitioned to Connection stage.');
    navigate(`/d-lancer/workspace/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/d-lancer')}
          className="text-xs font-bold text-gray-400 hover:text-brand-dark transition-colors flex items-center gap-1.5"
        >
          ➔ Back to D-Lancer
        </button>
      </div>

      <MissionHeader
        title={mission.title}
        budget={mission.reward}
        status={mission.status}
        difficulty={mission.difficulty}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left main info */}
        <div className="lg:col-span-8 space-y-6">
          <MissionDetails
            description={mission.description}
            tags={mission.tags}
            deliverables={mission.deliverables || ['Code delivery', 'Setup instructions']}
          />

          <MissionFAQ faqs={mission.faqs} />
        </div>

        {/* Right side interactions */}
        <div className="lg:col-span-4 space-y-6">
          <ClientCard
            clientName={mission.client}
            clientAvatar={mission.clientAvatar}
            postedDays={mission.postedDays}
          />

          {/* Expressions panel */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-brand-dark uppercase tracking-widest">
              Express Interest
            </h3>
            
            {interested ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 text-center text-xs">
                <p className="font-extrabold">✓ Interest Registered</p>
                <p className="text-[11px] text-emerald-600/80 mt-1">
                  You are now connected. Client is reviewing your submission.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInterestSubmit} className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Submit motivation to let the client know you are interested in this mission. Bids/proposal costs are disabled.
                </p>
                <div>
                  <textarea
                    rows="3"
                    value={motivation}
                    onChange={e => setMotivation(e.target.value)}
                    placeholder="Why are you a good fit for this project?"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-dark text-white rounded-xl text-xs font-extrabold hover:bg-bts-gold hover:text-brand-dark transition-all shadow-md"
                >
                  I'm Interested
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
