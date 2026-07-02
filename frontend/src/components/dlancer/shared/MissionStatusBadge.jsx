const STATUS_CONFIG = {
  Open: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'In Progress': 'text-blue-700 bg-blue-50 border-blue-200',
  'In Review': 'text-amber-700 bg-amber-50 border-amber-200',
  Completed: 'text-gray-500 bg-gray-100 border-gray-200',
};

export default function MissionStatusBadge({ status }) {
  const cls = STATUS_CONFIG[status] || 'text-gray-500 bg-gray-100 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${cls}`}>
      {status}
    </span>
  );
}
