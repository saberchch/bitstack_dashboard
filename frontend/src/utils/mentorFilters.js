export const DEFAULT_ADVANCED_FILTERS = {
  schools: [],
  modules: [],
  goals: [],
  language: 'All',
  verifiedOnly: false,
  availabilities: [],
  maxPrice: 800,
};

export function getMentorSchools(mentorList) {
  return Array.from(new Set(mentorList.map(m => m.school || 'Professional / Independent')));
}

export function getMentorModules(mentorList) {
  return Array.from(new Set(mentorList.reduce((acc, m) => [...acc, ...(m.modules || [])], [])));
}

export function filterMentors(mentorList, { search = '', advancedFilters = DEFAULT_ADVANCED_FILTERS } = {}) {
  return mentorList.filter(mentor => {
    const matchesSearch = search === '' ||
      mentor.name.toLowerCase().includes(search.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(search.toLowerCase()) ||
      mentor.role.toLowerCase().includes(search.toLowerCase()) ||
      mentor.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (advancedFilters.schools.length > 0) {
      const mentorSchool = mentor.school || 'Professional / Independent';
      const matchesSchool = advancedFilters.schools.some(s =>
        mentorSchool.toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes(mentorSchool.toLowerCase())
      );
      if (!matchesSchool) return false;
    }

    if (advancedFilters.modules?.length > 0) {
      const matchesModule = advancedFilters.modules.some(mod => {
        const target = mod.toLowerCase();
        const hasDirectModule = mentor.modules?.some(m =>
          m.toLowerCase().includes(target) || target.includes(m.toLowerCase())
        );
        const hasSkillMatch = mentor.skills?.some(s =>
          s.toLowerCase().includes(target) || target.includes(s.toLowerCase())
        );
        return hasDirectModule || hasSkillMatch;
      });
      if (!matchesModule) return false;
    }

    if (advancedFilters.goals.length > 0) {
      const hasGoal = mentor.goals?.some(g => advancedFilters.goals.includes(g));
      if (!hasGoal) return false;
    }

    if (advancedFilters.language !== 'All' && mentor.language !== advancedFilters.language) {
      return false;
    }

    if (advancedFilters.verifiedOnly && !mentor.verified) {
      return false;
    }

    if (advancedFilters.availabilities.length > 0) {
      const hasAvail = mentor.availability?.some(a => advancedFilters.availabilities.includes(a));
      if (!hasAvail) return false;
    }

    if (mentor.rate > advancedFilters.maxPrice) {
      return false;
    }

    return true;
  });
}

export function sortMentors(mentorList, sortBy = 'rating') {
  return [...mentorList].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') return a.rate - b.rate;
    if (sortBy === 'price-desc') return b.rate - a.rate;
    if (sortBy === 'sessions') return b.sessions - a.sessions;
    return 0;
  });
}

export function countActiveFilters(advancedFilters = DEFAULT_ADVANCED_FILTERS) {
  let count = 0;
  if (advancedFilters.schools.length) count += advancedFilters.schools.length;
  if (advancedFilters.modules?.length) count += advancedFilters.modules.length;
  if (advancedFilters.goals.length) count += advancedFilters.goals.length;
  if (advancedFilters.availabilities.length) count += advancedFilters.availabilities.length;
  if (advancedFilters.language !== 'All') count += 1;
  if (advancedFilters.verifiedOnly) count += 1;
  if (advancedFilters.maxPrice < DEFAULT_ADVANCED_FILTERS.maxPrice) count += 1;
  return count;
}
