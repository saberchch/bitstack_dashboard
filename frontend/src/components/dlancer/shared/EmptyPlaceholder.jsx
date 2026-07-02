export default function EmptyPlaceholder({ title = 'Nothing here yet', text, icon }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
      {icon ? (
        <div className="w-12 h-12 mx-auto mb-4 text-gray-200">{icon}</div>
      ) : (
        <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      )}
      <p className="text-sm font-bold text-gray-700 mb-1">{title}</p>
      {text && <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">{text}</p>}
    </div>
  );
}
