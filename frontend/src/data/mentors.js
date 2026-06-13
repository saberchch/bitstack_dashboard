export const mentors = [
  {
    id: "julian-thorne",
    name: "Julian Thorne",
    role: "Cryptography Expert & Core Dev",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCB84CUcH7sXP1SAQjZfAp5SayWmXFdAbmXdf576Jzth00CxgsJcCYdOo3H5AattesiRcusralahjkaTxkryfuf-jjlhsFRME7YTfbJdaM75YrQ-xlBDbMNDjolOlZ5Vdy6_Ly6CRryhksho8RLAajYQ9q3kxewLlCd6u5D7L2FmW7HOAopff18JOxbouNdrVL3Q_yXRrIIi6f9mmrCqJx5nH-1rO7HBOjL6S7FS3HTrmEUryTZPxImv1sqMNifuUM3D0dhLHb29zA",
    rate: 500,
    rating: 4.9,
    sessions: 142,
    experience: "8 Years",
    skills: ["Cryptography", "Core Dev", "ZK-Proofs", "Rust"],
    school: "",
    level: "Expert",
    modules: ["ZK-Proofs", "Cryptography"],
    goals: ["Project coaching"],
    language: "English",
    verified: true,
    availability: ["Weekday Morning", "Weekday Evening"],
    bio: "PhD in Applied Math with 8 years of experience building zero-knowledge proofs and layer 2 scaling solutions.",
    about: "Julian Thorne is a leading protocol engineer specializing in cryptography and Layer 2 scaling implementations. With a PhD in Applied Mathematics, he has spent nearly a decade building zero-knowledge proof frameworks and scaling architectures. He is a frequent contributor to core protocol development and is passionate about tutoring developers moving into protocol security.",
    timeline: [
      {
        year: "2022 — Present",
        title: "Core Developer @ Bitstacks Institute",
        description: "Directing protocol upgrades and scaling solutions using advanced cryptography."
      },
      {
        year: "2019 — 2022",
        title: "Protocol Engineer @ L2Labs Security",
        description: "Developed and verified production-grade ZK-rollup circuits and zero-knowledge primitives."
      },
      {
        year: "2016 — 2019",
        title: "Cryptography Researcher @ ETH Zurich",
        description: "Focused research on cryptographic primitives, pairing-friendly curves, and secure multi-party computation."
      }
    ],
    timezone: "America/New_York",
    slots: [
      { time: "09:00 AM EST", available: true },
      { time: "11:30 AM EST", available: true },
      { time: "02:00 PM EST", available: true },
      { time: "04:30 PM EST", available: false }
    ],
    workshops: [
      {
        sessionId: "intro-zkp",
        title: "Zero-Knowledge Implementation with Rust",
        level: "ADVANCED",
        date: "May 12",
        duration: "2.5 Hours",
        buttonText: "Join Waitlist",
        actionType: "waitlist",
        attendees: ["JD", "AS", "+42"]
      }
    ],
    activity: [
      {
        icon: "verified_user",
        title: "Completed L2 Rollup Audit",
        desc: "Validated key circuits and zk-SNARK constraints for Bitstacks L2 beta.",
        time: "3 days ago"
      },
      {
        icon: "podcasts",
        title: "Keynote: Future of Layer 2 Security",
        desc: "Public presentation delivered to the Bitstacks developer ecosystem.",
        time: "1 week ago"
      }
    ],
    feedback: [
      {
        name: "Sarah Chen",
        rating: 5,
        text: "Julian has an incredible depth of knowledge in ZKPs. His sessions are highly technical, structured, and extremely helpful for our scaling roadmap."
      }
    ]
  },
  {
    id: "elena-volkov",
    name: "Dr. Elena Volkov",
    role: "Senior Smart Contract Auditor & Cryptography Researcher",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW6ZyX8xOjktMDABgbeSoECsYzlAjy7-FJgYKOj6AHXoRIfXnbGHnzSerNy0vBBqilDXnGUkAe9ZcZKJjtl79xszrt_WXjPjPlllqVk4WqEeWnx23dN6RFgL2W_HzkWA11XHgfpI2xg4EyWHj_b7U4g0aulNmsMrg-INtyHa58pBUsF5gPHymRL2zisAV9Y7R3WZqbyQZz8jpLu4asi7f13Epp7ZdmIz62st1kcP94Jm31u_p8Ad5jNgn1hOI0XiH2TWF_nORMLvc",
    rate: 750,
    rating: 5.0,
    sessions: 89,
    experience: "12 Years",
    skills: ["Cryptography", "ZK-Proofs", "EVM Security", "Rust"],
    school: "MIT",
    level: "Expert",
    modules: ["ZK-Proofs", "Cryptography", "Smart Contracts"],
    goals: ["Project coaching", "Exam prep"],
    language: "English",
    verified: true,
    availability: ["Weekday Morning", "Weekday Evening"],
    bio: "Former Lead Auditor at OpenZeppelin. Specializing in high-stakes protocol security and formal verification.",
    about: "Dr. Elena Volkov is a pioneer in zero-knowledge proof implementation and formal verification of complex smart contracts. With a PhD in Computational Mathematics from Zurich Polytechnic, she has spent over a decade securing multi-billion dollar DeFi protocols. Currently leading the Security Division at Bitstacks, she mentors high-performing developers looking to specialize in cryptography and protocol-level security.",
    timeline: [
      {
        year: "2021 — Present",
        title: "Senior Auditor @ Bitstacks Institute",
        description: "Directing security research and curriculum for advanced smart contract auditing certifications."
      },
      {
        year: "2018 — 2021",
        title: "Security Lead @ ChainGuard Protocols",
        description: "Oversaw 50+ successful protocol audits with zero post-deployment exploits."
      },
      {
        year: "2014 — 2018",
        title: "Research Fellow @ MIT Media Lab",
        description: "Focusing on ZK-SNARKs and their application in decentralized identity systems."
      }
    ],
    timezone: "America/New_York",
    slots: [
      { time: "09:00 AM EST", available: true },
      { time: "11:30 AM EST", available: true },
      { time: "02:00 PM EST", available: true },
      { time: "04:30 PM EST", available: false }
    ],
    workshops: [
      {
        sessionId: "intro-zkp",
        title: "Zero-Knowledge Implementation with Rust",
        level: "ADVANCED",
        date: "May 12",
        duration: "2.5 Hours",
        buttonText: "Join Waitlist",
        actionType: "waitlist",
        attendees: ["JD", "AS", "+42"]
      },
      {
        sessionId: "smart-contract-auditing",
        title: "The Audit Mindset: Security by Design",
        level: "INTERMEDIATE",
        date: "June 02",
        duration: "1.5 Hours",
        buttonText: "Enroll: 150 BTS",
        actionType: "enroll",
        attendees: ["MK", "RB", "+12"]
      }
    ],
    activity: [
      {
        icon: "verified_user",
        title: "Completed Audit Mission",
        desc: "Validated 12 smart contracts for the Bitstacks Core Protocol Upgrade.",
        time: "2 days ago"
      },
      {
        icon: "podcasts",
        title: "Keynote: Future of Layer 2 Security",
        desc: "Public session delivered to over 250+ students in D-Institute.",
        time: "1 week ago"
      }
    ],
    feedback: [
      {
        name: "Marcus Aurelius",
        rating: 5,
        text: "Dr. Volkov has a way of breaking down the most complex ZK-proof concepts into intuitive mental models. The private session was worth every BTS."
      },
      {
        name: "Sarah Chen",
        rating: 5,
        text: "Excellent mentorship style. She doesn't just give answers, she teaches you the methodology of how to find them. Highly recommended for senior devs."
      }
    ]
  },
  {
    id: "marcus-chen",
    name: "Marcus Chen",
    role: "DeFi Architect & Product Lead",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDevsGT_5ugbgDdGi8moFrSPlX_mizOucblgDsL1EvVKfnLfQvq5zh5k-SfK3bqAWSxrFr14mkKoap5fP8NlqWY41on7sO9vTC8yNUt0WClcBTq6jFsdAKWMWJ2vvOJhKkkXFEoyhw78DN5EoKZgT8B6pbgCdncuKMrLUfM9X0bNyO3ozptzxZR48mF-1OJOH1RaKaRMmLJk9mj96OVhPnH1nrRwLDebwiCWuv-Np750NqURl2hEvRFlTMgHQxXEoE5h5tfHzy9UPo",
    rate: 420,
    rating: 4.8,
    sessions: 210,
    experience: "10 Years",
    skills: ["DeFi Architect", "Product Lead", "AMMs", "Tokenomics"],
    school: "Professional / Independent",
    level: "Advanced",
    modules: ["DeFi Architecture"],
    goals: ["Project coaching", "TD & Tutorials"],
    language: "English",
    verified: true,
    availability: ["Weekday Evening", "Weekend"],
    bio: "Helping developers pivot from Web2 to Web3. Expert in liquidity pools, AMMs, and yield optimization.",
    about: "Marcus Chen is a veteran DeFi architect and product leader who has designed several major automated market makers and yield optimization protocols. He specializes in tokenomics, liquidity pool mechanics, and financial modeling for Web3 projects. He has helped dozens of engineers transition from traditional software backgrounds into core DeFi roles.",
    timeline: [
      {
        year: "2022 — Present",
        title: "DeFi Architect @ Bitstacks Ecosystem",
        description: "Designing advanced financial mechanics and multi-token economies."
      },
      {
        year: "2019 — 2022",
        title: "Lead Product Designer @ Uniswap Labs",
        description: "Led core UI/UX and interface engineering for AMM products and V3 features."
      },
      {
        year: "2016 — 2019",
        title: "Smart Contract Engineer @ MakerDAO",
        description: "Implemented stability systems and credit mechanics for decentralized stablecoins."
      }
    ],
    timezone: "America/New_York",
    slots: [
      { time: "09:00 AM EST", available: true },
      { time: "11:30 AM EST", available: true },
      { time: "02:00 PM EST", available: true },
      { time: "04:30 PM EST", available: false }
    ],
    workshops: [
      {
        sessionId: "defi-yield-strategies",
        title: "AMMs and Liquidity Pools: From Theory to Practice",
        level: "INTERMEDIATE",
        date: "June 15",
        duration: "2.0 Hours",
        buttonText: "Enroll: 120 BTS",
        actionType: "enroll",
        attendees: ["AS", "JD", "+18"]
      }
    ],
    activity: [
      {
        icon: "article",
        title: "Published Yield Farming Optimization Guide",
        desc: "Authored whitepaper detailing non-custodial capital efficiency models.",
        time: "4 days ago"
      },
      {
        icon: "groups",
        title: "Led Tokenomics Design Workshop",
        desc: "Coached 15 Web3 startup founders on treasury strategies.",
        time: "1 week ago"
      }
    ],
    feedback: [
      {
        name: "Alex Sterling",
        rating: 5,
        text: "Marcus is the go-to person for anything DeFi. He helped us model our tokenomics and avoid critical design flaws. Brilliant strategist."
      }
    ]
  },
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    role: "Solidity Master & Governance Specialist",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgI9wjTQGf6qUTjZrc5UduNk8Ap-NBsOCeGWu39qr7nB56wL3t9G9pjlUDZfi9SZPd_sqC4ZtLOgKa2KlrltaSJp75z39YAsyF-tif_evgJqLi85AZmJ_1-sX6GAeVZ--_Xg9EdTk2FtNERzfv1wbIEAyNu3-qpT6Huw7g-86wenUmnKFEr6y7trmLoucng-3xnyHPqQrCVlk-Oj850HTIytzF3ir03-ij7-5FQDdxFykFgNv50UZEJs2osjhvq-GEzoiOTPt1gbs",
    rate: 600,
    rating: 4.9,
    sessions: 45,
    experience: "6 Years",
    skills: ["Solidity Master", "Governance", "DAOs", "Solidity Security"],
    school: "ENIT",
    level: "Advanced",
    modules: ["Smart Contracts"],
    goals: ["Project coaching", "Catch-up"],
    language: "English",
    verified: true,
    availability: ["Weekday Morning", "Weekend"],
    bio: "Specialist in DAO structures and on-chain governance. Former researcher at the Ethereum Foundation.",
    about: "Sarah Jenkins is an expert Solidity developer and researcher focusing on decentralized governance frameworks and DAO tooling. Formerly a researcher at the Ethereum Foundation, she has designed governance architectures for some of the space's largest protocols. Her mentorship focuses on advanced Solidity patterns, voting mechanisms, and game theory.",
    timeline: [
      {
        year: "2023 — Present",
        title: "Governance Advisor @ Bitstacks Ecosystem",
        description: "Consulting on decentralized modular governance and on-chain DAO mechanisms."
      },
      {
        year: "2020 — 2023",
        title: "Core Researcher @ Ethereum Foundation",
        description: "Co-authored standards for DAO identity management and voting primitives."
      },
      {
        year: "2018 — 2020",
        title: "Solidity Engineer @ Aragon Project",
        description: "Built upgradeable Solidity templates and dispute resolution modules."
      }
    ],
    timezone: "America/New_York",
    slots: [
      { time: "10:00 AM EST", available: true },
      { time: "01:00 PM EST", available: true },
      { time: "03:30 PM EST", available: false }
    ],
    workshops: [
      {
        sessionId: "cross-chain-deep-dive",
        title: "DAO Governance Frameworks and Game Theory",
        level: "ADVANCED",
        date: "June 22",
        duration: "3.0 Hours",
        buttonText: "Join Waitlist",
        actionType: "waitlist",
        attendees: ["MK", "AS", "+15"]
      }
    ],
    activity: [
      {
        icon: "settings",
        title: "Designed Governance Upgrade for Bitstacks DAO",
        desc: "Implemented secure optimistic governance modules.",
        time: "5 days ago"
      },
      {
        icon: "article",
        title: "Published Paper on Optimistic Governance",
        desc: "Introduced mathematical model for voting delays and capital cost.",
        time: "2 weeks ago"
      }
    ],
    feedback: [
      {
        name: "David Miller",
        rating: 5,
        text: "Sarah's insights on DAO voting mechanisms helped us structure our community governance beautifully. Highly recommend!"
      }
    ]
  },
  {
    id: "anis-rahmani",
    name: "Anis Rahmani",
    role: "Web3 Dev & Smart Contract Engineer",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
    rate: 150,
    rating: 4.6,
    sessions: 32,
    experience: "3 Years",
    skills: ["Solidity", "React", "Smart Contracts", "Web3 Dev"],
    school: "National Institute of Applied Sciences and Technology",
    level: "Intermediate",
    modules: ["Smart Contracts", "Web3 Dev"],
    goals: ["Exam prep", "TD & Tutorials"],
    language: "French",
    verified: true,
    availability: ["Weekday Morning", "Weekend"],
    bio: "INSAT graduate. Specializes in building React dApps and Solidity contracts. Passionate about helping students ace their exams and projects.",
    about: "Anis Rahmani is a passionate Web3 developer who studied at INSAT. He has spent the last few years helping engineering students build React/Solidity applications and prepare for their academic projects and lab assessments.",
    timeline: [
      {
        year: "2024 — Present",
        title: "Smart Contract Engineer @ INSAT Labs",
        description: "Tutoring students in Solidity development and web3 integration patterns."
      }
    ],
    timezone: "Africa/Tunis",
    slots: [
      { time: "09:00 AM CET", available: true },
      { time: "02:00 PM CET", available: true }
    ],
    workshops: [],
    activity: [
      {
        icon: "verified_user",
        title: "React Workshop for Juniors",
        desc: "Hosted beginner session on integrating ethers.js with React.",
        time: "3 days ago"
      }
    ],
    feedback: [
      {
        name: "Firas Mansour",
        rating: 5,
        text: "Anis helped me debug my graduation project. Very clear explanations and solid developer skills."
      }
    ]
  },
  {
    id: "yasmine-trabelsi",
    name: "Yasmine Trabelsi",
    role: "Data Scientist & Cybersecurity Lead",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    rate: 220,
    rating: 4.7,
    sessions: 58,
    experience: "5 Years",
    skills: ["Python", "Cryptography", "Big Data", "AI Ethics"],
    school: "ENIT",
    level: "Advanced",
    modules: ["Big Data / Cybersecurity", "AI Ethics"],
    goals: ["Project coaching", "Exam prep"],
    language: "English",
    verified: false,
    availability: ["Weekday Evening"],
    bio: "ENIT alumna. Cybersecurity engineer working on decentralized AI architectures and threat modeling.",
    about: "Yasmine Trabelsi is a cybersecurity specialist and data auditor graduated from ENIT. She consults on secure database design, ML models audit, and algorithmic fairness metrics.",
    timeline: [
      {
        year: "2023 — Present",
        title: "Security Auditor @ CyberShield",
        description: "Assessing AI dataset vulnerabilities and ensuring system compliance."
      }
    ],
    timezone: "Africa/Tunis",
    slots: [
      { time: "06:00 PM CET", available: true },
      { time: "08:00 PM CET", available: true }
    ],
    workshops: [],
    activity: [],
    feedback: [
      {
        name: "Omar Gharbi",
        rating: 4.5,
        text: "Yasmine helped me prepare for my cryptography midterms. Excellent resources and step-by-step guidance."
      }
    ]
  },
  {
    id: "mohamed-ali",
    name: "Mohamed Ali",
    role: "AI Ethics Specialist & ML Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    rate: 120,
    rating: 4.5,
    sessions: 21,
    experience: "2 Years",
    skills: ["Machine Learning", "AI Ethics", "Python", "Data Audit"],
    school: "ESPRIT",
    level: "Beginner",
    modules: ["AI Ethics", "Big Data / Cybersecurity"],
    goals: ["Catch-up", "TD & Tutorials"],
    language: "Arabic",
    verified: true,
    availability: ["Weekend", "Available Today"],
    bio: "ESPRIT engineering tutor. Helping juniors master machine learning basics, model audits, and algorithmic fairness concepts.",
    about: "Mohamed Ali is an ESPRIT graduate specializing in artificial intelligence and ethical model deployment. He provides catch-up classes and TD tutorials for engineering students.",
    timeline: [
      {
        year: "2024 — Present",
        title: "AI Ethics Coach",
        description: "Conducting tutorials for AI systems audit and bias mitigation strategies."
      }
    ],
    timezone: "Africa/Tunis",
    slots: [
      { time: "10:00 AM CET", available: true },
      { time: "04:00 PM CET", available: true }
    ],
    workshops: [],
    activity: [],
    feedback: []
  },
  {
    id: "sonia-kallel",
    name: "Sonia Kallel",
    role: "Protocol Cryptographer & Math Consultant",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
    rate: 450,
    rating: 4.9,
    sessions: 77,
    experience: "7 Years",
    skills: ["ZK-Proofs", "Cryptography", "DeFi Architecture", "Math"],
    school: "ept",
    level: "Expert",
    modules: ["ZK-Proofs", "Cryptography", "DeFi Architecture"],
    goals: ["Project coaching"],
    language: "French",
    verified: true,
    availability: ["Weekday Morning"],
    bio: "EPT graduate. Specializes in advanced protocol scaling and zero-knowledge mathematical verification.",
    about: "Sonia Kallel graduated from the Ecole Polytechnique de Tunisie. She is an expert researcher in cryptographic schemes, providing advanced project coaching and thesis consultations.",
    timeline: [
      {
        year: "2022 — Present",
        title: "Senior Cryptographer @ L2Scale",
        description: "Validating custom zero knowledge proofs protocols and constraint equations."
      }
    ],
    timezone: "Africa/Tunis",
    slots: [
      { time: "08:30 AM CET", available: true }
    ],
    workshops: [],
    activity: [],
    feedback: []
  }
];
