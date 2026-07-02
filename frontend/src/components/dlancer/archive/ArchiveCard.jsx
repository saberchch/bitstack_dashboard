import { useNavigate } from 'react-router-dom';

export default function ArchiveCard({ arc, base }) {
  const navigate = useNavigate();
  const isCreator = arc.role === 'creator';
  const rating = arc.myRating || arc.freelancerRating || 5;

  return (
    <div
      onClick={() => navigate(`/d-lancer/workspace/${arc.id}`)}
      className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
    >
      <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isCreator ? (
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          ) : (
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          )}
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <h4 className="text-sm font-extrabold text-brand-dark truncate">{base.title || arc.title}</h4>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-500">Completed</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-gray-200 text-gray-500">
            {isCreator ? '🧑‍💼 Creator' : '🧑‍💻 Freelancer'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold flex-wrap mt-1">
          <span>{arc.completedDate}</span>
          {!isCreator && <span className="text-bts-gold font-extrabold">◈ +{arc.earnedBts?.toLocaleString()} BTS earned</span>}
          {isCreator && <span className="font-semibold text-gray-400">◈ {arc.spentBts?.toLocaleString()} BTS · {arc.freelancer}</span>}
          {(base.tags || arc.tags || []).slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-600">{t}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        {Array.from({ length: 5 }).map((_, j) => (
          <svg key={j} className={`w-3.5 h-3.5 ${j < rating ? 'text-bts-gold' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
}
