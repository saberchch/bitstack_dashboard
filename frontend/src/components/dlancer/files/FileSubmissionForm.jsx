import { useState } from 'react';

const SUPPORTED_PLATFORMS = [
  'ZIP Archive', 'GitHub Repository', 'GitLab Repository', 'Bitbucket Repository',
  'Google Drive', 'OneDrive', 'Figma File', 'Canva Design', 'Notion Space',
  'Documentation URL', 'Video Demo Link'
];

export default function FileSubmissionForm({ onSubmit, isReadOnly }) {
  const [platform, setPlatform] = useState(SUPPORTED_PLATFORMS[0]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !url) return;
    onSubmit({ platform, name, url });
    setName('');
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-b border-gray-50 pb-6 mb-6">
      <h4 className="text-xs font-extrabold text-brand-dark uppercase tracking-widest">Submit Deliverable</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Platform Selection */}
        <div className="space-y-1">
          <label className="block text-[9px] font-extrabold text-gray-400 uppercase">Platform Type</label>
          <select
            value={platform}
            disabled={isReadOnly}
            onChange={e => setPlatform(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all cursor-pointer"
          >
            {SUPPORTED_PLATFORMS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="block text-[9px] font-extrabold text-gray-400 uppercase">Deliverable Name</label>
          <input
            type="text"
            required
            disabled={isReadOnly}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Frontend Repository, Final Pitch PDF"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* URL */}
      <div className="space-y-1">
        <label className="block text-[9px] font-extrabold text-gray-400 uppercase">Access Link / URL</label>
        <input
          type="url"
          required
          disabled={isReadOnly}
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://github.com/... or https://figma.com/..."
          className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-bts-gold focus:bg-white transition-all"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isReadOnly}
          className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all disabled:opacity-50"
        >
          Submit Deliverable
        </button>
      </div>
    </form>
  );
}
