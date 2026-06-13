const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    category: 'disputes',
    title: 'Dispute #DIS-2041 Assigned',
    description: 'Arbitration Panel #7 has been assigned to investigate your case with DeFi Nexus.',
    ts: 'Yesterday, 10:12',
    read: false,
    route: '/messages',
  },
  {
    id: 'n2',
    category: 'mentorship',
    title: 'Session Request Received',
    description: 'Dr. Robert Lang requested a private ZK-Rollup Deep Dive session for 250 BTS.',
    ts: 'Today, 08:45',
    read: false,
    route: '/messages',
  },
  {
    id: 'n3',
    category: 'dlancer',
    title: 'Counter-Offer Received',
    description: 'DeFi Nexus submitted a counter-bid of 1,000 BTS for the Smart Contract Security Audit.',
    ts: 'Yesterday, 18:30',
    read: false,
    route: '/messages',
  },
  {
    id: 'n4',
    category: 'platform',
    title: 'BTS Reward Disbursed',
    description: 'You received 50 BTS for completing the "Introduction to Zero-Knowledge Proofs" quiz.',
    ts: '2 days ago',
    read: true,
    route: '/bts-credit',
  }
];

export function getNotifications() {
  const data = localStorage.getItem('bts_notifications');
  if (!data) {
    localStorage.setItem('bts_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  return JSON.parse(data);
}

export function saveNotifications(notifications) {
  localStorage.setItem('bts_notifications', JSON.stringify(notifications));
  window.dispatchEvent(new Event('bts_notifications_change'));
}

export function addNotification({ category, title, description, route }) {
  const notifications = getNotifications();
  const newNotification = {
    id: `n-${Date.now()}`,
    category,
    title,
    description,
    ts: 'Just now',
    read: false,
    route: route || '/notifications',
  };
  notifications.unshift(newNotification);
  saveNotifications(notifications);
  return newNotification;
}

export function markAsRead(id) {
  const notifications = getNotifications();
  const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  saveNotifications(updated);
}

export function markAllAsRead() {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, read: true }));
  saveNotifications(updated);
}

export function deleteNotification(id) {
  const notifications = getNotifications();
  const updated = notifications.filter(n => n.id !== id);
  saveNotifications(updated);
}

export function clearAllNotifications() {
  saveNotifications([]);
}
