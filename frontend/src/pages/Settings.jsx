import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { getProfile, updateProfile } from '../utils/profileStorage';

export default function Settings() {
  const [profile, setProfile] = useState(getProfile());
  const [activeSubTab, setActiveSubTab] = useState('account'); // 'account' | 'security' | 'notifications' | 'wallet' | 'mentorship'
  const [savedMessage, setSavedMessage] = useState('');

  // Account Form states
  const [username, setUsername] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone || '');
  const [bio, setBio] = useState(profile.bio);
  const [uiLanguage, setUiLanguage] = useState(() => {
    return localStorage.getItem('bts_settings_ui_language') || 'English';
  });

  // Security states
  const [enable2FA, setEnable2FA] = useState(() => {
    return localStorage.getItem('bts_settings_2fa') === 'true';
  });
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [sessions, setSessions] = useState([
    { id: 'sess-1', device: 'Chrome (Linux)', location: 'Tunis, TN', active: true, date: 'Active Now' },
    { id: 'sess-2', device: 'Safari (iPhone 15)', location: 'Sousse, TN', active: false, date: '2 hours ago' },
    { id: 'sess-3', device: 'Brave (macOS)', location: 'Sfax, TN', active: false, date: '3 days ago' }
  ]);

  // Notification states
  const [notificationsConfig, setNotificationsConfig] = useState(() => {
    const saved = localStorage.getItem('bts_settings_notifications');
    return saved ? JSON.parse(saved) : {
      mentorship: true,
      dlancer: true,
      disputes: true,
      platform: false
    };
  });

  // Wallet & Yield states (TND / BTS Ecosystem)
  const [payoutMethod, setPayoutMethod] = useState(() => {
    return localStorage.getItem('bts_settings_payout_method') || 'bank';
  });
  const [payoutDetails, setPayoutDetails] = useState(() => {
    return localStorage.getItem('bts_settings_payout_details') || 'TN59 0804 1000 0001 2345 6789';
  });
  const [subscriptionPlan] = useState('Premium Scholar Pass');
  const [autoRenewSub, setAutoRenewSub] = useState(() => {
    return localStorage.getItem('bts_settings_auto_renew_sub') !== 'false';
  });
  const [autoStakeReputation, setAutoStakeReputation] = useState(() => {
    return localStorage.getItem('bts_settings_auto_stake_reputation') === 'true';
  });

  // Mentorship configuration states
  const [mentorHourlyRate, setMentorHourlyRate] = useState(() => {
    return localStorage.getItem('bts_mentor_hourly_rate') || '80';
  });
  const [mentorSessionDuration, setMentorSessionDuration] = useState(() => {
    return localStorage.getItem('bts_mentor_session_duration') || '60';
  });
  const [mentorSchedulingMode, setMentorSchedulingMode] = useState(() => {
    return localStorage.getItem('bts_mentor_scheduling_mode') || 'manual';
  });
  const [mentorCalendarSync, setMentorCalendarSync] = useState(() => {
    return localStorage.getItem('bts_mentor_calendar_sync') === 'true';
  });
  const [mentorCalendarLink, setMentorCalendarLink] = useState(() => {
    return localStorage.getItem('bts_mentor_calendar_link') || '';
  });

  // Save changes effects
  useEffect(() => {
    localStorage.setItem('bts_settings_2fa', enable2FA);
  }, [enable2FA]);

  useEffect(() => {
    localStorage.setItem('bts_settings_notifications', JSON.stringify(notificationsConfig));
  }, [notificationsConfig]);

  useEffect(() => {
    localStorage.setItem('bts_settings_payout_method', payoutMethod);
  }, [payoutMethod]);

  useEffect(() => {
    localStorage.setItem('bts_settings_payout_details', payoutDetails);
  }, [payoutDetails]);

  useEffect(() => {
    localStorage.setItem('bts_settings_auto_renew_sub', autoRenewSub);
  }, [autoRenewSub]);

  useEffect(() => {
    localStorage.setItem('bts_settings_auto_stake_reputation', autoStakeReputation);
  }, [autoStakeReputation]);

  useEffect(() => {
    localStorage.setItem('bts_mentor_hourly_rate', mentorHourlyRate);
  }, [mentorHourlyRate]);

  useEffect(() => {
    localStorage.setItem('bts_mentor_session_duration', mentorSessionDuration);
  }, [mentorSessionDuration]);

  useEffect(() => {
    localStorage.setItem('bts_mentor_scheduling_mode', mentorSchedulingMode);
  }, [mentorSchedulingMode]);

  useEffect(() => {
    localStorage.setItem('bts_mentor_calendar_sync', mentorCalendarSync);
  }, [mentorCalendarSync]);

  useEffect(() => {
    localStorage.setItem('bts_mentor_calendar_link', mentorCalendarLink);
  }, [mentorCalendarLink]);

  useEffect(() => {
    localStorage.setItem('bts_settings_ui_language', uiLanguage);
  }, [uiLanguage]);

  // Sync profile edits Reactively
  useEffect(() => {
    const handleProfileChange = (e) => {
      const updated = e.detail;
      setProfile(updated);
      setUsername(updated.name);
      setEmail(updated.email);
      setPhone(updated.phone || '');
      setBio(updated.bio);
    };
    window.addEventListener('bts_profile_change', handleProfileChange);
    return () => window.removeEventListener('bts_profile_change', handleProfileChange);
  }, []);

  const handleSaveAccount = (e) => {
    e.preventDefault();
    const updated = updateProfile({
      name: username,
      email: email,
      phone: phone,
      bio: bio
    });
    setProfile(updated);
    triggerSuccessMessage("Account details saved successfully.");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwordCurrent || !passwordNew) return;
    setPasswordCurrent('');
    setPasswordNew('');
    triggerSuccessMessage("Account password updated successfully.");
  };

  const handleSaveWalletConfig = (e) => {
    e.preventDefault();
    triggerSuccessMessage("Wallet & Payout settings updated successfully.");
  };

  const handleSaveMentorshipConfig = (e) => {
    e.preventDefault();
    triggerSuccessMessage("Mentorship and learning preferences saved.");
  };

  const handleRevokeSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    triggerSuccessMessage("Session terminated.");
  };

  const triggerSuccessMessage = (msg) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const toggleNotificationItem = (key) => {
    setNotificationsConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-12 animate-fadeIn">
      <Topbar searchPlaceholder="Search configurations, sessions, wallet options..." />

      {/* Page Header */}
      <section className="mb-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight mb-1.5">Settings</h2>
          <p className="text-gray-400 text-sm">Configure your personal profile details, notification hubs, BTS payout addresses, and mentoring rates</p>
        </div>

        {savedMessage && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow-sm animate-bounce">
            ✓ {savedMessage}
          </div>
        )}
      </section>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Settings Sidebar Navigation */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-1.5">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-3 block mb-2">System Config</span>
          {[
            { key: 'account', label: 'Account Profile', icon: '👤' },
            { key: 'security', label: 'Security & Logins', icon: '🔒' },
            { key: 'notifications', label: 'Notifications Hub', icon: '🔔' },
            { key: 'wallet', label: 'BTS Wallet & Yield', icon: '💳' },
            { key: 'mentorship', label: 'Mentorship Settings', icon: '🎓' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-left transition-all cursor-pointer ${
                activeSubTab === tab.key 
                  ? 'bg-brand-dark text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-brand-dark'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Settings Config Panel */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm min-h-[420px]">
          
          {/* TAB 1: Account Settings */}
          {activeSubTab === 'account' && (
            <form onSubmit={handleSaveAccount} className="space-y-6 animate-fadeIn">
              <div className="border-b border-gray-50 pb-4">
                <h3 className="text-base font-extrabold text-brand-dark">Account Profile</h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Customize public identification details and display language</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Display Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-400 font-bold text-brand-dark"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Public Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-400 font-bold text-brand-dark"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-400 font-bold text-brand-dark"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block">Dashboard Language</label>
                  <select
                    value={uiLanguage}
                    onChange={(e) => setUiLanguage(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-bold text-brand-dark focus:outline-none"
                  >
                    <option value="English">English (US)</option>
                    <option value="French">Français</option>
                    <option value="German">Deutsch</option>
                    <option value="Spanish">Español</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Profile Bio</label>
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-400 font-semibold text-gray-600"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-50">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer shadow-sm"
                >
                  Save Account Details
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Security & Sessions */}
          {activeSubTab === 'security' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-gray-50 pb-4">
                <h3 className="text-base font-extrabold text-brand-dark">Security & Logins</h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Manage authentication protocols, passwords, and check active browser logs</p>
              </div>

              {/* Password update form */}
              <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-gray-50">
                <div className="space-y-1.5 col-span-2">
                  <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider">Update Account Password</h4>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordCurrent}
                    onChange={(e) => setPasswordCurrent(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordNew}
                    onChange={(e) => setPasswordNew(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="col-span-2 flex justify-end mt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer"
                  >
                    Change Password
                  </button>
                </div>
              </form>

              {/* Two-Factor Authentication Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                <div>
                  <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">Require an authenticator code alongside your email credentials to login</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setEnable2FA(!enable2FA)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-pointer ${
                    enable2FA ? 'bg-[#d4a017]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    enable2FA ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Session History list */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider">Active Device Sessions</h4>
                <div className="space-y-2.5">
                  {sessions.map(sess => (
                    <div key={sess.id} className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{sess.device.includes('iPhone') ? '📱' : '💻'}</span>
                        <div>
                          <p className="text-xs font-extrabold text-brand-dark">{sess.device}</p>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">{sess.location} · {sess.date}</p>
                        </div>
                      </div>
                      
                      {!sess.active && (
                        <button
                          onClick={() => handleRevokeSession(sess.id)}
                          className="px-3 py-1.5 hover:bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold border border-rose-100/50 transition-all cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                      {sess.active && (
                        <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                          Current
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Notification Toggles */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-gray-50 pb-4">
                <h3 className="text-base font-extrabold text-brand-dark">Notifications Hub</h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Toggle alert preferences for mentorship bookings, freelance contracts, disputes, and updates</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'mentorship', title: 'Mentorship Alerts', desc: 'Receive notifications about private sessions, tutor schedules, and bookings confirmation.', icon: '🎓' },
                  { key: 'dlancer', title: 'D-Lancer Contract Logs', desc: 'Get updates on active bids, submission approvals, and freelance milestone updates.', icon: '💼' },
                  { key: 'disputes', title: 'Disputes & Arbitrations', desc: 'Crucial alerts regarding open resolution logs, feedback files, and dispute progress.', icon: '⚖️' },
                  { key: 'platform', title: 'System Announcements', desc: 'Periodic notifications regarding site maintenance, payout schedules, and updates.', icon: '🔔' }
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl gap-4">
                    <div className="flex gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => toggleNotificationItem(item.key)}
                      className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-pointer shrink-0 ${
                        notificationsConfig[item.key] ? 'bg-[#d4a017]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        notificationsConfig[item.key] ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BTS Wallet & Yield (Replaces traditional fiat Stripe/PayPal billing) */}
          {activeSubTab === 'wallet' && (
            <form onSubmit={handleSaveWalletConfig} className="space-y-6 animate-fadeIn">
              <div className="border-b border-gray-50 pb-4">
                <h3 className="text-base font-extrabold text-brand-dark">BTS Wallet & Yield Settings</h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Configure your premium scholar passes, APY staking preferences, and TND payout accounts</p>
              </div>

              {/* Scholar Subscription Pass Card */}
              <div className="p-5 border border-gray-100 rounded-2xl bg-white space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider">Active Scholar Subscription</h4>
                  <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded border border-emerald-100 uppercase tracking-widest">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-extrabold text-brand-dark">{subscriptionPlan}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Renewed automatically using BTS balance (Next: July 01, 2026)</p>
                  </div>
                  <span className="text-sm font-black text-brand-dark">◈ 99.00 BTS / mo</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Auto-renew Scholar Pass</span>
                  <button 
                    type="button"
                    onClick={() => setAutoRenewSub(!autoRenewSub)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-pointer ${
                      autoRenewSub ? 'bg-[#d4a017]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      autoRenewSub ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Reputation APY Staking Toggle */}
              <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                    <span>📈</span> Auto-Stake Yields into Reputation APY Pool
                  </h4>
                  <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                    Automatically restake your library resources yields and completed lancer rewards into your staked reputation pool to claim up to a 12.5% APY boost in BTS credits.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setAutoStakeReputation(!autoStakeReputation)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-pointer shrink-0 ${
                    autoStakeReputation ? 'bg-[#d4a017]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    autoStakeReputation ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* TND Redemptions and Payout Method settings */}
              <div className="space-y-4 pt-2 border-t border-gray-50">
                <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider">Tunisian Dinar (TND) Payout Preferences</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Payout Method</label>
                    <select
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-bold text-brand-dark focus:outline-none"
                    >
                      <option value="bank">Tunisian Bank Wire (IBAN/RIB)</option>
                      <option value="flouci">Flouci Mobile Payout</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">
                      {payoutMethod === 'bank' ? 'IBAN / RIB Account Details' : 'Flouci Linked Phone Number'}
                    </label>
                    <input
                      type="text"
                      value={payoutDetails}
                      onChange={(e) => setPayoutDetails(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-mono text-brand-dark focus:outline-none font-bold"
                    />
                  </div>
                </div>
                <span className="text-[9px] text-gray-400 font-semibold block leading-relaxed">
                  All unstaked library sales yields and completed freelancer rewards will be routed automatically to the designated account on the 1st of every month at the fixed rate of 1 BTS = 0.85 TND.
                </span>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-50">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer shadow-sm"
                >
                  Save Wallet Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: Mentorship Settings (Replaces developer API/webhook settings) */}
          {activeSubTab === 'mentorship' && (
            <form onSubmit={handleSaveMentorshipConfig} className="space-y-6 animate-fadeIn">
              <div className="border-b border-gray-50 pb-4">
                <h3 className="text-base font-extrabold text-brand-dark">Mentorship & Learning Settings</h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Customize your teaching rates, session lengths, approval rules, and calendars</p>
              </div>

              {/* Rate and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block">Tutor Hourly Rate (BTS Credits)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bts-gold font-bold text-xs">◈</span>
                    <input
                      type="number"
                      required
                      min="10"
                      max="1000"
                      value={mentorHourlyRate}
                      onChange={(e) => setMentorHourlyRate(e.target.value)}
                      className="w-full text-xs pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-400 font-bold text-brand-dark"
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 font-semibold block">
                    ≈ {(parseFloat(mentorHourlyRate || 0) * 0.85).toFixed(2)} TND / hour at fixed platform rate.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block">Default Session Duration</label>
                  <select
                    value={mentorSessionDuration}
                    onChange={(e) => setMentorSessionDuration(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-bold text-brand-dark focus:outline-none"
                  >
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes (1 Hour)</option>
                    <option value="90">90 Minutes (1.5 Hours)</option>
                    <option value="120">120 Minutes (2 Hours)</option>
                  </select>
                </div>
              </div>

              {/* Scheduling Mode */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider">Preferred Booking Approval Mode</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMentorSchedulingMode('manual')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      mentorSchedulingMode === 'manual'
                        ? 'border-brand-dark bg-gray-50/50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <p className="text-xs font-extrabold text-brand-dark uppercase tracking-wide">Manual Review Mode</p>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      Booking requests are placed in pending status. You must manually confirm or decline every session.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMentorSchedulingMode('auto')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      mentorSchedulingMode === 'auto'
                        ? 'border-brand-dark bg-gray-50/50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <p className="text-xs font-extrabold text-brand-dark uppercase tracking-wide">Instant Booking Mode</p>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      Sessions are approved automatically if they align with your configured availability calendar.
                    </p>
                  </button>
                </div>
              </div>

              {/* Calendar Synced Feed */}
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider">Device Calendar Sync</h4>
                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">Synchronize dashboard private bookings and tutoring schedules to external calendar applications</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setMentorCalendarSync(!mentorCalendarSync)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-pointer shrink-0 ${
                      mentorCalendarSync ? 'bg-[#d4a017]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      mentorCalendarSync ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {mentorCalendarSync && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">External webcal / iCal Calendar URL</label>
                    <input
                      type="url"
                      placeholder="e.g. webcal://calendar.google.com/calendar/ical/..."
                      value={mentorCalendarLink}
                      onChange={(e) => setMentorCalendarLink(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none font-semibold text-gray-600 font-mono"
                    />
                    <span className="text-[9px] text-gray-400 block font-semibold leading-relaxed">
                      Provide a standard iCal URL from Google Calendar, Outlook, or Apple Calendar to push and pull availability.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-50">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-bts-gold hover:text-brand-dark transition-all cursor-pointer shadow-sm"
                >
                  Save Mentorship Config
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
