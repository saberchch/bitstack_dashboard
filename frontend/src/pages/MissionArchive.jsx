import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDLancerState from '../hooks/useDLancerState';
import ArchiveCard from '../components/dlancer/archive/ArchiveCard';
import SectionHeader from '../components/dlancer/shared/SectionHeader';
import EmptyPlaceholder from '../components/dlancer/shared/EmptyPlaceholder';
import Topbar from '../components/Topbar';

export default function MissionArchive() {
  const navigate = useNavigate();
  const state = useDLancerState();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredArchive = state.archiveMissions.filter(arc => {
    const base = state.allMissions.find(m => m.id === arc.id) || {};
    const title = base.title || arc.title || '';
    const description = base.description || arc.description || '';
    
    const matchesSearch = !searchQuery ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || arc.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <Topbar searchPlaceholder="Search archived missions..." onSearchChange={setSearchQuery} />

      <div>
        <button
          onClick={() => navigate('/d-lancer')}
          className="text-xs font-bold text-gray-400 hover:text-brand-dark transition-colors flex items-center gap-1.5"
        >
          ➔ Back to D-Lancer
        </button>
      </div>

      <SectionHeader
        title="Mission Archive"
        subtitle="Historical catalog of completed missions, budgets, reviews, and client ratings"
      />

      {/* Role filter actions */}
      <div className="flex gap-2 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm w-fit">
        {[
          { id: 'all', label: 'All Completed' },
          { id: 'freelancer', label: 'As Freelancer' },
          { id: 'creator', label: 'As Client' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setRoleFilter(filter.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              roleFilter === filter.id ? 'bg-brand-dark text-white' : 'text-gray-400 hover:text-brand-dark'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Archive list */}
      {filteredArchive.length === 0 ? (
        <EmptyPlaceholder
          title="Archive empty"
          text="There are no completed or closed missions matching your filters."
        />
      ) : (
        <div className="space-y-3">
          {filteredArchive.map(arc => {
            const base = state.allMissions.find(m => m.id === arc.id) || {};
            return (
              <ArchiveCard
                key={arc.id}
                arc={arc}
                base={base}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
