import { useState, useEffect, useCallback } from 'react';
import mockData from '../data/dlancerMockData.json';

const STORAGE_KEYS = {
  missions: 'bts_dlancer_missions',
  myPosts: 'bts_dlancer_my_posts',
  interests: 'bts_dlancer_interests',
  bookmarks: 'bts_dlancer_bookmarks',
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function useDLancerState() {
  const [missions, setMissions] = useState(() =>
    loadFromStorage(STORAGE_KEYS.missions, mockData.missions)
  );
  const [myPosts, setMyPosts] = useState(() =>
    loadFromStorage(STORAGE_KEYS.myPosts, mockData.myPosts)
  );
  const [interests, setInterests] = useState(() =>
    loadFromStorage(STORAGE_KEYS.interests, ['cross-chain-bridge-api'])
  );
  const [bookmarks, setBookmarks] = useState(() =>
    loadFromStorage(STORAGE_KEYS.bookmarks, [])
  );

  useEffect(() => { saveToStorage(STORAGE_KEYS.missions, missions); }, [missions]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.myPosts, myPosts); }, [myPosts]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.interests, interests); }, [interests]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.bookmarks, bookmarks); }, [bookmarks]);

  const archiveMissionsMapped = mockData.archive.map(m => ({
    ...m,
    status: 'Completed',
    escrowLocked: true,
    isMyPost: m.role === 'creator',
  }));

  const allMissions = [...missions, ...myPosts, ...archiveMissionsMapped];

  const activeMissions = allMissions.filter(m =>
    (m.isMyActiveWork || interests.includes(m.id)) &&
    !m.isMyPost &&
    ['In Progress', 'In Review'].includes(m.status)
  );

  const activeMyPosts = myPosts.filter(m =>
    ['Open', 'In Progress', 'In Review'].includes(m.status)
  );

  const allActiveMissions = [
    ...activeMissions.map(m => ({ ...m, _role: 'freelancer' })),
    ...activeMyPosts.map(m => ({ ...m, _role: 'creator' })),
  ];

  const openMissions = missions.filter(m => m.status === 'Open' && !m.isMyPost);

  const totalActiveMissions = allActiveMissions.length;
  const totalEarned = missions
    .filter(m => interests.includes(m.id))
    .reduce((sum, m) => sum + (m.escrowReleasedAmount || 0), 0);
  const totalPending = activeMissions.reduce((sum, m) => {
    const contract = m.activeContract;
    return sum + (contract ? contract.bid - (m.escrowReleasedAmount || 0) : 0);
  }, 0);

  const handleExpressInterest = useCallback((missionId) => {
    if (!interests.includes(missionId)) {
      setInterests(prev => [...prev, missionId]);
    }
  }, [interests]);

  const handleBookmark = useCallback((missionId) => {
    setBookmarks(prev =>
      prev.includes(missionId)
        ? prev.filter(id => id !== missionId)
        : [...prev, missionId]
    );
  }, []);

  const handleUpdateMission = useCallback((updated) => {
    if (updated.isMyPost) {
      setMyPosts(prev => prev.map(m => m.id === updated.id ? updated : m));
    } else {
      setMissions(prev => prev.map(m => m.id === updated.id ? updated : m));
    }
  }, []);

  const handleCreatePost = useCallback((newMission) => {
    const mission = {
      ...newMission,
      id: `user-${Date.now()}`,
      appliedCount: 0,
      postedDays: 0,
      client: 'You',
      clientAvatar: 'https://ui-avatars.com/api/?name=You&background=d4a017&color=0b1121&size=40',
      status: 'Open',
      milestones: [],
      milestoneAmounts: [],
      milestoneStatus: [],
      milestoneReleased: [],
      escrowLocked: false,
      escrowReleasedAmount: 0,
      disputeActive: false,
      proposals: [],
      submissions: [],
      reviews: [],
      isMyPost: true,
    };
    setMyPosts(prev => [mission, ...prev]);
  }, []);

  const getMissionById = useCallback((id) => {
    return allMissions.find(m => m.id === id) || null;
  }, [allMissions]);

  return {
    missions,
    myPosts,
    allMissions,
    openMissions,
    activeMissions,
    activeMyPosts,
    allActiveMissions,
    archiveMissions: archiveMissionsMapped,
    recentActivity: mockData.recentActivity,
    categories: mockData.categories,
    skills: mockData.skills,
    interests,
    bookmarks,
    totalActiveMissions,
    totalEarned,
    totalPending,
    handleExpressInterest,
    handleBookmark,
    handleUpdateMission,
    handleCreatePost,
    getMissionById,
    isInterested: (id) => interests.includes(id),
    isBookmarked: (id) => bookmarks.includes(id),
  };
}
