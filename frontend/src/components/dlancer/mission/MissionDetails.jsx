export default function MissionDetails({ description, tags, deliverables }) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Description */}
      <div>
        <h3 className="text-xs font-extrabold text-brand-dark uppercase tracking-widest mb-3">Project Description</h3>
        <p className="text-xs text-gray-500 leading-relaxed font-medium">{description}</p>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-xs font-extrabold text-brand-dark uppercase tracking-widest mb-3">Required Skills</h3>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-extrabold">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Deliverables */}
      {deliverables && deliverables.length > 0 && (
        <div>
          <h3 className="text-xs font-extrabold text-brand-dark uppercase tracking-widest mb-3">Deliverables</h3>
          <ul className="space-y-2">
            {deliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-500 font-medium">
                <span className="text-bts-gold select-none mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
