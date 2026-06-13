import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mentors } from '../data/mentors';

export default function GuidedResearchWizard({ isOpen, onClose, onSelectMentor }) {
  const [step, setStep] = useState(1);
  const [school, setSchool] = useState("");
  const [level, setLevel] = useState("");
  const [module, setModule] = useState("");
  const [goal, setGoal] = useState("");
  const [results, setResults] = useState([]);

  // Custom typed values
  const [customSchool, setCustomSchool] = useState("");
  const [customModule, setCustomModule] = useState("");

  // Reset wizard state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSchool("");
      setLevel("");
      setModule("");
      setGoal("");
      setResults([]);
      setCustomSchool("");
      setCustomModule("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const stepsList = [
    { num: 1, name: "School" },
    { num: 2, name: "Level" },
    { num: 3, name: "Module" },
    { num: 4, name: "Goal" },
    { num: 5, name: "Results" }
  ];

  const schools = [
    { id: "National Institute of Applied Sciences and Technology", name: "INSAT", desc: "National Institute of Applied Sciences and Technology" },
    { id: "ENIT", name: "ENIT", desc: "Ecole Nationale d'Ingénieurs de Tunis" },
    { id: "ESPRIT", name: "ESPRIT", desc: "Ecole Supérieure Privée d'Ingénierie et de Technologies" },
    { id: "ept", name: "EPT / ept", desc: "Ecole Polytechnique de Tunisie" },
    { id: "Professional / Independent", name: "Professional / Independent", desc: "Independent Expert, Core Developer, or Professional Mentor (No academic school)" }
  ];

  const levels = [
    { id: "Beginner", name: "Beginner", desc: "Foundational concepts, basic exercises & fundamentals" },
    { id: "Intermediate", name: "Intermediate", desc: "Core subjects, lab worksheets & programming basics" },
    { id: "Advanced", name: "Advanced", desc: "Specialized design patterns, protocols & framework tools" },
    { id: "Expert", name: "Expert", desc: "Production audit mindset, protocol design & advanced ZK research" }
  ];

  const modules = [
    { id: "Smart Contracts", name: "Smart Contracts", desc: "Solidity, Auditing, EVM Security, Vyper" },
    { id: "DeFi Architecture", name: "DeFi Architecture", desc: "AMMs, Liquidity Pools, Tokenomics, Yields" },
    { id: "ZK-Proofs", name: "ZK-Proofs & rollups", desc: "Zero-Knowledge circuits, Rust implementation" },
    { id: "Cryptography", name: "Cryptography", desc: "Mathematical primitives, pairing curves, MPC" },
    { id: "AI Ethics", name: "AI Ethics", desc: "Model audits, fairness parameters, decentralized AI" },
    { id: "Big Data / Cybersecurity", name: "Big Data & Cyber", desc: "Datasets, threat modeling, network security" }
  ];

  const goals = [
    { id: "Exam prep", name: "Exam Prep", icon: "quiz", desc: "Target mock exams, review past questions, solve revision sheets" },
    { id: "TD & Tutorials", name: "TD & Tutorials", icon: "menu_book", desc: "Work through class sheets, homework problems, and lab tasks" },
    { id: "Project coaching", name: "Project Coaching", icon: "developer_mode", desc: "Hands-on implementation, debugging assistance, code reviews" },
    { id: "Catch-up", name: "Catch-up Session", icon: "history", desc: "Re-explain difficult lectures, review core theorems, fill gaps" }
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      // Calculate matching scores and transition to step 5
      calculateMatches();
      setStep(5);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const calculateMatches = () => {
    const scoredMentors = mentors.map(m => {
      let score = 0;
      let breakdown = { school: false, level: false, module: false, goal: false };

      // 1. School match (30 points)
      const targetSchool = school.trim().toLowerCase();
      const mentorSchoolRaw = m.school || "Professional / Independent";
      const mentorSchool = mentorSchoolRaw.trim().toLowerCase();

      if (
        mentorSchool === targetSchool || 
        mentorSchool.includes(targetSchool) || 
        targetSchool.includes(mentorSchool) ||
        (targetSchool === "professional / independent" && (mentorSchool === "" || mentorSchool === "professional / independent"))
      ) {
        score += 30;
        breakdown.school = true;
      }

      // 2. Level match (25 points)
      if (m.level === level) {
        score += 25;
        breakdown.level = true;
      }

      // 3. Module match (25 points)
      const targetModule = module.trim().toLowerCase();
      const hasDirectModule = m.modules && m.modules.some(mod => 
        mod.toLowerCase().includes(targetModule) || targetModule.includes(mod.toLowerCase())
      );
      const hasSkillMatch = m.skills && m.skills.some(s => 
        s.toLowerCase().includes(targetModule) || targetModule.includes(s.toLowerCase())
      );

      if (hasDirectModule || hasSkillMatch) {
        score += 25;
        breakdown.module = true;
      }

      // 4. Goal match (20 points)
      if (m.goals && m.goals.includes(goal)) {
        score += 20;
        breakdown.goal = true;
      }

      return {
        ...m,
        score,
        compatibility: Math.round((score / 100) * 100)
      };
    });

    // Sort by compatibility score descending
    const sortedMatches = scoredMentors.sort((a, b) => b.score - a.score);
    setResults(sortedMatches);
  };

  const isNextDisabled = () => {
    if (step === 1 && !school.trim()) return true;
    if (step === 2 && !level) return true;
    if (step === 3 && !module.trim()) return true;
    if (step === 4 && !goal) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col transition-all transform scale-100 p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
              <span className="material-symbols-outlined text-bts-gold !text-2xl animate-pulse">auto_awesome</span>
              Guided Research Matchmaker
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Find the right mentor for the exact materials you need</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-brand-dark p-1.5 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined !text-xl">close</span>
          </button>
        </div>

        {/* Step Progress bar */}
        <div className="my-6">
          <div className="flex justify-between items-center">
            {stepsList.map((s, idx) => (
              <div key={s.num} className="flex-1 flex items-center">
                <div className="flex flex-col items-center relative flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    step === s.num 
                      ? 'bg-bts-gold text-white shadow-md scale-110 border-2 border-yellow-200' 
                      : step > s.num 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.num ? (
                      <span className="material-symbols-outlined !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    ) : (
                      s.num
                    )}
                  </div>
                  <span className={`text-[10px] font-bold mt-2 transition-colors ${
                    step === s.num ? 'text-bts-gold' : 'text-gray-400'
                  }`}>
                    {s.name}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div className={`h-[2px] w-full -mt-5 transition-colors ${
                    step > s.num ? 'bg-green-500' : 'bg-gray-100'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 min-h-[300px] py-2">
          
          {/* STEP 1: SCHOOL */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-sm font-extrabold text-brand-dark text-center mb-4">Select your Academic Institution or Professional Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
                {schools.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSchool(s.id);
                      setCustomSchool("");
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-sm flex flex-col justify-between ${
                      school === s.id && !customSchool
                        ? 'border-bts-gold bg-yellow-50/20' 
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-black tracking-widest px-2.5 py-1 rounded bg-gray-50 text-gray-500 border border-gray-100 uppercase ${
                        school === s.id && !customSchool ? 'bg-yellow-50 text-bts-gold border-yellow-100' : ''
                      }`}>
                        {s.name}
                      </span>
                      {school === s.id && !customSchool && (
                        <span className="material-symbols-outlined text-bts-gold !text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed mt-3">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Custom School Option */}
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-2">
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                  Or Type School Name Manually
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-brand-dark focus:ring-1 focus:ring-bts-gold focus:border-bts-gold outline-none"
                    placeholder="e.g. MIT, Harvard University, or any custom school name..."
                    value={customSchool}
                    onChange={(e) => {
                      setCustomSchool(e.target.value);
                      setSchool(e.target.value);
                    }}
                  />
                  {customSchool.trim() !== "" && school === customSchool && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-bts-gold !text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LEVEL */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-sm font-extrabold text-brand-dark text-center mb-6">Select your current Level / Year</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {levels.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md flex items-center justify-between ${
                      level === l.id 
                        ? 'border-bts-gold bg-yellow-50/20 shadow-sm' 
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex-1 pr-4">
                      <p className={`font-bold text-xs ${level === l.id ? 'text-bts-gold' : 'text-brand-dark'}`}>{l.name}</p>
                      <p className="text-[10px] text-gray-400 mt-1 leading-snug">{l.desc}</p>
                    </div>
                    {level === l.id && (
                      <span className="material-symbols-outlined text-bts-gold !text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: MODULE */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-sm font-extrabold text-brand-dark text-center mb-4">Which Subject/Module do you need help with?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
                {modules.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setModule(m.id);
                      setCustomModule("");
                    }}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-sm flex items-center justify-between ${
                      module === m.id && !customModule
                        ? 'border-bts-gold bg-yellow-50/20' 
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex-1 pr-4">
                      <p className={`font-bold text-xs ${module === m.id && !customModule ? 'text-bts-gold' : 'text-brand-dark'}`}>{m.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{m.desc}</p>
                    </div>
                    {module === m.id && !customModule && (
                      <span className="material-symbols-outlined text-bts-gold !text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Custom Module input */}
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-2">
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                  Or Enter a Custom Module / Subject
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-brand-dark focus:ring-1 focus:ring-bts-gold focus:border-bts-gold outline-none"
                    placeholder="e.g. Algebra, Compiler Design, Vyper smart contracts..."
                    value={customModule}
                    onChange={(e) => {
                      setCustomModule(e.target.value);
                      setModule(e.target.value);
                    }}
                  />
                  {customModule.trim() !== "" && module === customModule && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-bts-gold !text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: GOAL */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-sm font-extrabold text-brand-dark text-center mb-6">What is the Primary Goal of this private session?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md flex items-start gap-4 ${
                      goal === g.id 
                        ? 'border-bts-gold bg-yellow-50/20 shadow-sm' 
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      goal === g.id ? 'bg-yellow-50 border-yellow-100 text-bts-gold' : 'bg-gray-50 border-gray-100 text-gray-400'
                    }`}>
                      <span className="material-symbols-outlined !text-[20px]">{g.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className={`font-bold text-xs ${goal === g.id ? 'text-bts-gold' : 'text-brand-dark'}`}>{g.name}</p>
                        {goal === g.id && (
                          <span className="material-symbols-outlined text-bts-gold !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 leading-normal">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: RESULTS */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h4 className="text-base font-extrabold text-brand-dark">Top Compatible Mentors Found</h4>
                <p className="text-xs text-gray-400 mt-1">Based on School, Level, Subject Module, and Learning Goals</p>
              </div>

              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {results.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">person_off</span>
                    <p className="text-xs text-gray-500 font-bold">No matches found. Try modifying your criteria.</p>
                  </div>
                ) : (
                  results.map((mentor) => (
                    <div 
                      key={mentor.id} 
                      className="border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white hover:border-bts-gold/30 transition-all hover:shadow-sm"
                    >
                      {/* Left: Avatar & Info - Clickable Profile Link */}
                      <Link 
                        to={`/mentor/${mentor.id}`}
                        onClick={onClose}
                        className="flex items-center gap-4 hover:opacity-80 transition-opacity flex-1 min-w-0"
                      >
                        <div className="relative shrink-0">
                          <img 
                            src={mentor.avatar} 
                            alt={mentor.name} 
                            className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                          />
                          {mentor.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-bts-gold p-0.5 rounded-full border border-white flex items-center justify-center">
                              <span className="material-symbols-outlined !text-[10px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bold text-xs text-brand-dark leading-tight hover:text-bts-gold transition-colors">{mentor.name}</h5>
                            <span className="text-[9px] font-bold text-bts-gold bg-yellow-50/60 border border-yellow-100/50 px-1.5 py-0.5 rounded-md">
                              {mentor.compatibility}% Match
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-snug truncate">{mentor.role}</p>
                          
                          <div className="flex flex-wrap items-center gap-x-2 mt-1">
                            <span className="text-[9px] text-gray-400 font-bold flex items-center gap-0.5">
                              <span className="material-symbols-outlined !text-[12px] text-bts-gold">school</span>
                              {mentor.school || "Professional / Independent"}
                            </span>
                            <span className="text-gray-300 text-[10px]">•</span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">
                              {mentor.level}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Right: Price & Buttons */}
                      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3.5 pt-3 md:pt-0 border-t md:border-t-0 border-gray-50">
                        <div className="text-left md:text-right shrink-0">
                          <span className="block text-[11px] font-black text-bts-gold">{mentor.rate} BTS/hr</span>
                          <span className="block text-[8px] text-gray-400 font-bold uppercase mt-0.5">{mentor.experience} Exp</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link
                            to={`/mentor/${mentor.id}`}
                            onClick={onClose}
                            className="border border-gray-200 text-brand-dark text-[10px] font-bold px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-center inline-block"
                          >
                            View Profile
                          </Link>
                          <button
                            onClick={() => {
                              onClose();
                              onSelectMentor(mentor);
                            }}
                            className="bg-brand-dark text-white text-[10px] font-bold px-3 py-2 rounded-xl hover:bg-bts-gold transition-colors shadow-sm cursor-pointer"
                          >
                            Book Match
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer controls */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
          <div>
            {step > 1 && step < 5 && (
              <button
                onClick={handlePrev}
                className="border border-gray-200 text-brand-dark text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined !text-sm">arrow_back</span>
                Back
              </button>
            )}
          </div>
          <div>
            {step < 5 ? (
              <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className={`text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                  isNextDisabled() 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-bts-gold hover:bg-opacity-95'
                }`}
              >
                {step === 4 ? 'Match Mentors' : 'Next'}
                <span className="material-symbols-outlined !text-sm">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={() => setStep(1)}
                className="bg-bts-gold text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined !text-sm">restart_alt</span>
                Reset Matchmaker
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
