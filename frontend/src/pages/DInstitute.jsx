import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';

export default function DInstitute() {
  const [searchQuery, setSearchQuery] = useState("");
  const [registrations, setRegistrations] = useState(() => {
    const saved = localStorage.getItem('bts_institute_registrations');
    return saved ? JSON.parse(saved) : [];
  });

  const [progressWidths, setProgressWidths] = useState({
    web3: 0,
    ai: 0,
    pm: 0
  });

  // Animate progress bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidths({
        web3: 75,
        ai: 40,
        pm: 12
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Save registrations to localStorage
  useEffect(() => {
    localStorage.setItem('bts_institute_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    const handleRegistrationsChange = (e) => {
      if (e.detail) setRegistrations(e.detail);
    };
    window.addEventListener('bts_institute_registrations_change', handleRegistrationsChange);
    return () => window.removeEventListener('bts_institute_registrations_change', handleRegistrationsChange);
  }, []);

  const handleRegister = (id) => {
    if (registrations.includes(id)) {
      setRegistrations(registrations.filter(r => r !== id));
    } else {
      setRegistrations([...registrations, id]);
    }
  };

  const handleWaitlist = (id) => {
    const waitlistKey = `${id}-waitlist`;
    if (registrations.includes(waitlistKey)) {
      setRegistrations(registrations.filter(r => r !== waitlistKey));
    } else {
      setRegistrations([...registrations, waitlistKey]);
    }
  };

  const institutes = [
    {
      id: "bitstacks",
      title: "BitStacks Institute",
      desc: "Master the foundational technologies of the future. Deep dives into Blockchain, Web3 development, and Neural Networks.",
      tag: "Core Hub",
      tagBg: "bg-brand-dark/90",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDp4f34TfF2BzYTdCvU3f6QVgLb6XfnTm0hS1hx38AIcv_QztD4AGmEnaD4TtsfNkz0CTiKXhZ_KzcAOhRkU0v6f0UM5DLXAFRi_VoHu1W3RbcZJ-YlMax9DxfhCYwB0bacaAhvrarNZOblQlczvwLIBRi165PQRK34dfGTnm66oV4f5eGZ-GLxLglIMPqg4XWKjwZL2vTAiT4i7BhyZ-wu0B9mrtAMQvEROT8R4rZHaJzuZp8sgqIXAj-hnOoFUpnzrq2E0RrxBj8",
      features: ["Specialized Training", "Technical Workshops", "Full-Stack Courses", "Dev Hackathons"],
      icon: "check_circle"
    },
    {
      id: "rocwell",
      title: "Rocwell Institute",
      desc: "Designed for tomorrow's leaders. High-level industry mentorship and management strategies for the tech elite.",
      tag: "Premium",
      tagBg: "bg-bts-gold/90",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHOfYlYsTirvz7Vb5ktZFGVMwKbM4AngX9lFr33jp8ep_rJbqMQpeH10x1V_4AKtqiPIKg1m4thIvsSQznIWYdYNM10XKrpgoI84hdJhp6sDWDG8-QG6Ls0H3eNMIiubboSYixQpz1mLfmkx-95xsL_1MyDed_CDBX-rMxDMwiUaN88W5odjSiWTW29sn3wLzQHWalp4IYQNg-5q97iol7RZkE9zDU1BVqu5X8dVIxAtD34v6mCVsNGCvJww6QiJ7u-bvz_EaSmYQ",
      features: ["Industry Certifications", "Executive Masterclasses", "Global Networking", "Board Strategy"],
      icon: "verified"
    },
    {
      id: "pfe-guidance",
      title: "PFE Guidance Institute",
      desc: "Bridging the gap between academia and industry. Specialized support for your final year projects (PFE) and thesis.",
      tag: "Student Support",
      tagBg: "bg-gray-400/90",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpUUs_6oLFXfi4ZbJ5_49XK1ceOl1E0-db0zHBJceTkla2eB7HfZpndnNxAf0YbFy0EltC2xih8LnmfRbCJwbXhWNSsCJKHvT0vOdwrFuAPcBySIYAaR6m82JcFA6TuSLz3dq68IADkIGQx0z8x0olG_LDeK31kKSxc-c_NTWo7AZT8OVXXZNtI4A5JQY8RGpikARyl7_DW69fDY9MGnYLFGFVzA0APikEQ9_5fNtkZKEJSO8A3tuxlmYAhjwhvro96_dJYhKGuHs",
      features: ["Personalized Mentoring", "Presentation Coaching", "Technical Review", "Prototype Support"],
      icon: "school"
    }
  ];

  const workshops = [
    {
      id: "solidity-advanced",
      title: "Solidity Advanced Patterns",
      date: "Oct 24, 2023",
      category: "Web3",
      categoryBg: "bg-bts-gold",
      instructor: {
        name: "Dr. David Miller",
        role: "Lead Faculty",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpOpB6fHY2DkQ9AXDVaQZSXoiUOptfenlJ3RjINmPhyTvYiMCjqNwT2dnt5h4OropOAV0JdpQChTS553NTcfFfpZujgp3l15pcBB0wmU2ctda6cW9-ACnqph2Eu3v6iOyRYolbbVew3FngB8EQ-dJj0HXkg3sfMn8vZovjvibrU4AtP8__ER_UkbESIZzgpXAGQDzg-O7ipAIEHbpK27P9Gs_6w1mqcMWbKezDM39PCfxL89DiWZrGDXMcfYari3hkplGMqbvvgKw",
        mentorId: null
      },
      seatsLeft: 8,
      maxSeats: 20,
      duration: "3 Hours"
    },
    {
      id: "neural-network",
      title: "Neural Network Fundamentals",
      date: "Oct 28, 2023",
      category: "AI/ML",
      categoryBg: "bg-indigo-600",
      instructor: {
        name: "Prof. Sarah Le",
        role: "Sr. AI Researcher",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2EDR_dUTe6YbxEswFiMhGeeaDeiOz-r4-5ffeC5CcZzO9oRlk3k9tbhRhBUsB_tHgibkUJnd1qHJNnlukUQ6BPUdQLffgZBMhbWgbttnzoaa4u64UnRjOTNLxWVz5UKRvGkv43RCh1RUqpzJf2OAT6ekIA1H66feTZp0sluwsv3NblHsRJM_BKddqJveTuIOZqZSkHgtpNb8VhcvyFFUO1BSwUpEi92VYIPOzj4hwk8eEMDI3VPRGB8RsvwDBcXrSfmgwwmrkla8",
        mentorId: null
      },
      seatsLeft: 0,
      maxSeats: 20,
      duration: "4 Hours"
    },
    {
      id: "ai-fintech",
      title: "AI in Fintech Strategy",
      date: "Nov 02, 2023",
      category: "Strategy",
      categoryBg: "bg-bts-gold",
      instructor: {
        name: "Marcus Chen",
        role: "Industry Mentor",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFuUujsOxhEN3JJeWw5JJRP5FQPiWb7emJcFuoM3ZhYYxes1MnGD_-VvNT4YKobZNNqefSkJlaSHdCkE1ojLeI86z1BgKe81O7bm9QvaNMlAwQoNCsJzEYPrudVL9yqFykL_cpBZEsQYSK0HQUXGffd7WfYiBRc6EDaj0ZPt7N-zDt83Uc1dco7Xpo5Ddj4y_tuN1GmpbBmQZ_SPcubqWFd3UuSied3USv84Nj8x48QFXjZDLEVUXXzMtyBfLgIM4s7DlZj1WCVYE",
        mentorId: "marcus-chen"
      },
      seatsLeft: 15,
      maxSeats: 25,
      duration: "2.5 Hours"
    }
  ];

  const filteredInstitutes = institutes.filter(inst =>
    inst.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Compute Stats
  const activeRegistrations = registrations.filter(r => !r.endsWith("-waitlist")).length;
  const certificatesCount = 4 + activeRegistrations;
  const btsEarned = 850 + activeRegistrations * 150;

  return (
    <>
      <Topbar 
        searchPlaceholder="Search courses, mentors, or institutes..." 
        onSearchChange={(query) => setSearchQuery(query)}
      />

      {/* Page Title Section */}
      <section className="mb-10 max-w-4xl mt-6">
        <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight mb-4">
          D-Institute — Learn, Build & Grow
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
          Empowering the next generation of digital architects. Our multi-tiered educational ecosystem provides the tools, mentorship, and certifications needed to master emerging technologies and lead with excellence in the decentralized world.
        </p>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area: Three Institutes */}
        <div className="lg:col-span-8 space-y-8">
          {filteredInstitutes.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
              <span className="material-symbols-outlined text-gray-300 text-5xl mb-2">school</span>
              <p className="text-sm font-semibold text-gray-500">No institutes match your search.</p>
            </div>
          ) : (
            filteredInstitutes.map((inst) => (
              <div 
                key={inst.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-bts-gold/20 transition-all group"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 relative min-h-[240px]">
                    <img 
                      alt={inst.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={inst.image}
                    />
                    <div className="absolute top-4 left-4 bg-brand-dark/95 text-white px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                      {inst.tag}
                    </div>
                  </div>
                  <div className="md:w-3/5 p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-brand-dark mb-2 group-hover:text-bts-gold transition-colors">
                        {inst.title}
                      </h3>
                      <p className="text-gray-500 text-xs mb-6 leading-relaxed">
                        {inst.desc}
                      </p>
                      <ul className="grid grid-cols-2 gap-y-3 gap-x-4 mb-8">
                        {inst.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                            <span className="material-symbols-outlined text-bts-gold !text-[16px]">
                              {inst.icon}
                            </span> 
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link to={`/institute/${inst.id}`}>
                      <button className="w-fit px-8 py-2.5 bg-bts-gold text-white font-extrabold rounded-xl text-xs shadow-md hover:shadow-bts-gold/20 transition-all active:scale-95 cursor-pointer">
                        Explore Institute
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Modules */}
        <div className="lg:col-span-4 space-y-6">
          {/* Learning Hub Progress */}
          <div className="bg-brand-dark rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
            <div className="absolute -right-4 -top-4 opacity-10">
              <span className="material-symbols-outlined !text-[80px]">trending_up</span>
            </div>
            <h3 className="text-lg font-bold mb-6">Learning Hub</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Web3 Architecture</span>
                  <span className="text-[11px] font-bold">{progressWidths.web3}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-bts-gold transition-all duration-1000 ease-out" 
                    style={{ width: `${progressWidths.web3}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI Prompt Engineering</span>
                  <span className="text-[11px] font-bold">{progressWidths.ai}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-bts-gold transition-all duration-1000 ease-out" 
                    style={{ width: `${progressWidths.ai}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project Management</span>
                  <span className="text-[11px] font-bold">{progressWidths.pm}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-bts-gold transition-all duration-1000 ease-out" 
                    style={{ width: `${progressWidths.pm}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-3 bg-bts-gold text-white font-extrabold rounded-xl text-xs hover:bg-opacity-90 transition-all active:scale-95 shadow-md cursor-pointer">
              Continue Learning
            </button>
          </div>

          {/* Quick Stats: Achievements */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-brand-dark mb-4">Institutional Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Certificates</p>
                <p className="text-2xl font-black text-brand-dark">{certificatesCount.toString().padStart(2, '0')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">BTS Earned</p>
                <p className="text-2xl font-black text-bts-gold">{btsEarned}</p>
              </div>
            </div>
          </div>

          {/* Core Features Cards */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 p-5 rounded-2xl hover:border-bts-gold transition-colors cursor-pointer group flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-yellow-50 group-hover:text-bts-gold transition-colors shrink-0">
                <span className="material-symbols-outlined !text-[20px]">account_circle</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark mb-1">Institute Profiles</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Detailed faculty papers and research archives.</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 p-5 rounded-2xl hover:border-bts-gold transition-colors cursor-pointer group flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-yellow-50 group-hover:text-bts-gold transition-colors shrink-0">
                <span className="material-symbols-outlined !text-[20px]">menu_book</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark mb-1">Training Programs</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Cataloged paths for beginner to master.</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 p-5 rounded-2xl hover:border-bts-gold transition-colors cursor-pointer group flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-yellow-50 group-hover:text-bts-gold transition-colors shrink-0">
                <span className="material-symbols-outlined !text-[20px]">calendar_month</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark mb-1">Events & Workshops</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Live sessions and global tech summits.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Workshops Section */}
      <section className="mt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-2xl font-extrabold text-brand-dark">Upcoming Workshops</h3>
            <p className="text-sm text-gray-500">Limited seats available for premium sessions</p>
          </div>
          <a className="text-bts-gold font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer">
            View Calendar <span class="material-symbols-outlined !text-[16px]">arrow_forward</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.map((ws) => {
            const isFull = ws.seatsLeft === 0;
            const isRegistered = registrations.includes(ws.id);
            const isOnWaitlist = registrations.includes(`${ws.id}-waitlist`);
            
            const currentSeatsLeft = isRegistered 
              ? ws.seatsLeft - 1 
              : ws.seatsLeft;

            const AvatarWrapper = ws.instructor.mentorId ? Link : 'div';
            const avatarProps = ws.instructor.mentorId 
              ? { to: `/mentor/${ws.instructor.mentorId}`, className: "shrink-0 hover:opacity-85 transition-opacity" }
              : { className: "shrink-0" };

            return (
              <div 
                key={ws.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden hover:shadow-md transition-all group flex flex-col"
              >
                {/* Banner Area */}
                <div className="relative h-44 bg-brand-dark overflow-hidden p-6 flex flex-col justify-between">
                  {/* Banner Image / Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/40 to-brand-dark/95 z-10 pointer-events-none"></div>
                  
                  <span className="text-[10px] text-bts-gold font-extrabold uppercase tracking-widest z-10">
                    {ws.date}
                  </span>
                  <h4 className="text-white text-lg font-bold leading-tight z-10 group-hover:text-bts-gold transition-colors">
                    {ws.title}
                  </h4>
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`text-[9px] ${ws.categoryBg} text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm`}>
                      {ws.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  {/* Instructor Bio */}
                  <div className="flex items-center gap-3 mb-6">
                    <AvatarWrapper {...avatarProps}>
                      <img 
                        alt={ws.instructor.name} 
                        className="w-9 h-9 rounded-lg border border-gray-100 object-cover" 
                        src={ws.instructor.avatar}
                      />
                    </AvatarWrapper>
                    <div className="min-w-0">
                      {ws.instructor.mentorId ? (
                        <Link 
                          to={`/mentor/${ws.instructor.mentorId}`} 
                          className="text-xs font-bold text-brand-dark hover:text-bts-gold transition-colors block truncate"
                        >
                          {ws.instructor.name}
                        </Link>
                      ) : (
                        <p className="text-xs font-bold text-brand-dark truncate">
                          {ws.instructor.name}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400">{ws.instructor.role}</p>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 mb-6">
                    <div className="flex items-center gap-1.5">
                      {isFull ? (
                        isOnWaitlist ? (
                          <span className="text-bts-gold flex items-center gap-1">
                            <span className="material-symbols-outlined !text-[14px]">hour_glass</span> Waitlisted
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1">
                            <span className="material-symbols-outlined !text-[14px]">error</span> Full
                          </span>
                        )
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500">
                          <span className="material-symbols-outlined !text-[14px]">groups</span> 
                          {currentSeatsLeft}/{ws.maxSeats} Seats left
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <span className="material-symbols-outlined !text-[14px]">timer</span> 
                      {ws.duration}
                    </div>
                  </div>

                  {/* Actions */}
                  {isFull ? (
                    <button
                      onClick={() => handleWaitlist(ws.id)}
                      className={`w-full py-2.5 rounded-xl font-bold text-[11px] transition-all active:scale-95 cursor-pointer ${
                        isOnWaitlist
                          ? "bg-yellow-50 border-2 border-bts-gold/50 text-bts-gold"
                          : "border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white"
                      }`}
                    >
                      {isOnWaitlist ? "Leave Waitlist" : "Join Waitlist"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(ws.id)}
                      className={`w-full py-2.5 rounded-xl font-bold text-[11px] transition-all active:scale-95 cursor-pointer ${
                        isRegistered
                          ? "bg-green-50 border-2 border-green-500/40 text-green-600 flex items-center justify-center gap-1"
                          : "border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white"
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <span className="material-symbols-outlined !text-sm">check_circle</span>
                          Registered
                        </>
                      ) : (
                        "Register Now"
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
