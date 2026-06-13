export const sessions = [
  {
    id: "cross-chain-deep-dive",
    title: "Cross-Chain Interoperability Deep Dive",
    level: "Advanced",
    duration: "60 Mins",
    date: "June 08",
    time: "2:00 PM EST",
    timeInfo: "In 2 Hours",
    attendees: 128,
    maxCapacity: 200,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3URdCy0PMj5LsdGnFcAPjulHEYHFXF0qEi2vhCcaDNJFsD6qkt-QxRffP5Y-4i0CWgEYn4iFREP0vLIht6Ctx0TAEPNKGQNJ4JcND_1tKpzI1Mg3C4JDzmjH6l3CzFB3QlAu53qFuwxsY3KPe2ya0mqzVsPQ0ZuvBj83L5woqwuUggGTcbAY1wCzmwlGPS9CBMf2BSScXdW71jdQUoTZmQTatSXs0_h5J3VMGTFbKqLHmbRo-VGGo7qmbMRDnARsJdhN_3PZj940",
    instructor: {
      name: "Julian Thorne",
      role: "Core Developer",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCB84CUcH7sXP1SAQjZfAp5SayWmXFdAbmXdf576Jzth00CxgsJcCYdOo3H5AattesiRcusralahjkaTxkryfuf-jjlhsFRME7YTfbJdaM75YrQ-xlBDbMNDjolOlZ5Vdy6_Ly6CRryhksho8RLAajYQ9q3kxewLlCd6u5D7L2FmW7HOAopff18JOxbouNdrVL3Q_yXRrIIi6f9mmrCqJx5nH-1rO7HBOjL6S7FS3HTrmEUryTZPxImv1sqMNifuUM3D0dhLHb29zA",
      mentorId: "julian-thorne"
    },
    overview: "Explore the cutting-edge mechanics of cross-chain bridging, atomic swaps, and messaging protocols. This session breaks down the architectural trade-offs of light-client validation versus multi-signature notary systems and examines the future of modular cross-chain systems.",
    curriculum: [
      {
        title: "1. Bridging Architectures",
        desc: "Examine trust-less light clients, optimistic verification models, and external validators."
      },
      {
        title: "2. Message Passing Protocol Standards",
        desc: "Learn about LayerZero, Wormhole, and Axelar messaging formats and security considerations."
      },
      {
        title: "3. Common Bridge Exploits",
        desc: "Detailed walk-through of historical bridge hacks and how they could have been prevented."
      }
    ],
    prerequisites: [
      "Familiarity with Solidity & smart contract compilation",
      "Basic understanding of cryptographic signatures (ECDSA)",
      "Knowledge of EVM state mechanics"
    ],
    benefits: [
      "Access to hands-on cross-chain messaging labs",
      "Bitstacks verifiable certificate of workshop completion",
      "Exclusive Q&A session with the core engineering division"
    ]
  },
  {
    id: "smart-contract-auditing",
    title: "Smart Contract Auditing Best Practices",
    level: "Intermediate",
    duration: "90 Mins",
    date: "June 02",
    time: "10:00 AM EST",
    timeInfo: "Tomorrow, 10:00 AM",
    attendees: 45,
    maxCapacity: 50,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHa8vs8T6HVU32XsZLTNvwBQZz54r0GggcLBNO_2ZiG_B17Lwgp8kHjvN5q8sIuiBl0Xsgi9h1MfZBSQtg4JbVKY_F8cmo0fWE09bxsRuKoLOHic7fp8HL4fAx0ul7TWpaQpicmLGAXaXw4itt1mZnFhwpGP_LWFdx7URkpgDQbtpkKvP6_niHdUG-3w73RFQSG_eAHtHDCDieNpEiD0kJu3E60r6Sr03w6maZSjzvqyh3wEB6zFe9OoOSWxeZsqFFudHfjKQiERk",
    instructor: {
      name: "Dr. Elena Volkov",
      role: "Senior Smart Contract Auditor",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW6ZyX8xOjktMDABgbeSoECsYzlAjy7-FJgYKOj6AHXoRIfXnbGHnzSerNy0vBBqilDXnGUkAe9ZcZKJjtl79xszrt_WXjPjPlllqVk4WqEeWnx23dN6RFgL2W_HzkWA11XHgfpI2xg4EyWHj_b7U4g0aulNmsMrg-INtyHa58pBUsF5gPHymRL2zisAV9Y7R3WZqbyQZz8jpLu4asi7f13Epp7ZdmIz62st1kcP94Jm31u_p8Ad5jNgn1hOI0XiH2TWF_nORMLvc",
      mentorId: "elena-volkov"
    },
    overview: "This workshop is an intensive training module on how to systematically audit smart contracts for high-stakes protocols. We will cover security checklists, static analysis tooling (Slither, Mythril), and the mental framework required to think like an attacker.",
    curriculum: [
      {
        title: "1. The Auditing Methodology",
        desc: "Structuring the review: threat modeling, manual code walkthrough, and code path mapping."
      },
      {
        title: "2. Static Analysis & Tooling Labs",
        desc: "Automating vulnerability scans using Slither, Echidna fuzz testing, and static linters."
      },
      {
        title: "3. Drafting the Audit Report",
        desc: "How to properly catalog findings, define severity levels, and write actionable remediation suggestions."
      }
    ],
    prerequisites: [
      "Ability to write and compile functional Solidity contracts",
      "Understanding of common vulnerabilities like reentrancy",
      "Familiarity with Hardhat or Foundry testing frameworks"
    ],
    benefits: [
      "Interactive audit templates used by professional security firms",
      "Access to private auditing Discord channels in Bitstacks D-Institute",
      "Verifiable workshop participant badge"
    ]
  },
  {
    id: "mastering-solidity",
    title: "Mastering Solidity Security",
    level: "Intermediate",
    duration: "90 Mins",
    date: "May 28",
    time: "4:00 PM EST",
    timeInfo: "Starts in 45m",
    attendees: 45,
    maxCapacity: 50,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKKyB0anhJ11GjvkIIOVMZnykLp50f8cRoW72T7QDEqCZa7D26Cz_bWls37zeNyZuTQo0uWcnqzsI4_CE4pNADiIQVSUuS8HoffXeaD-pl30mD4AxVYMao1JDisSiNE812sBp_1v0qUnlcy8QypKPZwz1xIzG5_5kADs3EQDQLUaIk1ZaxVrP94NnwvJB5SCd-zQcQ-B3qeAdlQ50O4cI56ETfbcrSmXVFHXMyR6fXk2XX1gBSgiaQdJBOYeRxrqKbXfDUn35icZk",
    instructor: {
      name: "Dr. Elena Volkov",
      role: "Senior Smart Contract Auditor",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW6ZyX8xOjktMDABgbeSoECsYzlAjy7-FJgYKOj6AHXoRIfXnbGHnzSerNy0vBBqilDXnGUkAe9ZcZKJjtl79xszrt_WXjPjPlllqVk4WqEeWnx23dN6RFgL2W_HzkWA11XHgfpI2xg4EyWHj_b7U4g0aulNmsMrg-INtyHa58pBUsF5gPHymRL2zisAV9Y7R3WZqbyQZz8jpLu4asi7f13Epp7ZdmIz62st1kcP94Jm31u_p8Ad5jNgn1hOI0XiH2TWF_nORMLvc",
      mentorId: "elena-volkov"
    },
    overview: "Dive deep into the most critical safety issues when writing smart contracts on Ethereum. This workshop covers Solidity pitfalls including compiler bugs, reentrancy guards, unchecked math, memory vs. storage corruption, and upgradeability security.",
    curriculum: [
      {
        title: "1. Advanced EVM Pitfalls",
        desc: "Analyze low-level calls, delegatecalls, and storage slot collisions in proxy patterns."
      },
      {
        title: "2. Arithmetic and Control Flow Safeguards",
        desc: "Familiarize with SafeMath underflow/overflow bypasses, custom errors, and check-effects-interactions."
      },
      {
        title: "3. Reentrancy and Read-only Reentrancy",
        desc: "Learn to build secure multi-contract reentrancy locks and guard oracle-dependent state variables."
      }
    ],
    prerequisites: [
      "Solid intermediate knowledge of EVM assembly or Solidity patterns",
      "Familiarity with delegatecall proxy mechanisms",
      "Familiarity with DeFi swap structures"
    ],
    benefits: [
      "Sample vulnerable contracts and write-ups for training",
      "One free contract gas optimization analysis tool",
      "Gas Optimization checklist"
    ]
  },
  {
    id: "defi-yield-strategies",
    title: "DeFi Yield Strategies",
    level: "Advanced",
    duration: "120 Mins",
    date: "June 12",
    time: "1:00 PM EST",
    timeInfo: "Tomorrow, 10:00 AM",
    attendees: 12,
    maxCapacity: 30,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsj6RbqQ50KCVnmjuuNmE9go-6i_wujDu0usZ5UflyqQ_limWDs4o3e5wV6EVABn5fG2xpCl-TJOYtDFRZQauqzVsDS0Oof9Jbz-3Gi_uAAvoLRAYHfEJfSmy5dN0ShF0X_ZYOPU34OvChXUWZYK6p8Is1PdzfdM0J4wS-itg16gVoYaSx_5F6b-V2Hq_d5JXAOjbCBVZI2sZB6H9eMvG9OBChA7yBQA104ZfjmGPQBd6PA2uhaP4Jcr38gAMADClSBmd3BwmEexo",
    instructor: {
      name: "Marcus Chen",
      role: "DeFi Architect",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDevsGT_5ugbgDdGi8moFrSPlX_mizOucblgDsL1EvVKfnLfQvq5zh5k-SfK3bqAWSxrFr14mkKoap5fP8NlqWY41on7sO9vTC8yNUt0WClcBTq6jFsdAKWMWJ2vvOJhKkkXFEoyhw78DN5EoKZgT8B6pbgCdncuKMrLUfM9X0bNyO3ozptzxZR48mF-1OJOH1RaKaRMmLJk9mj96OVhPnH1nrRwLDebwiCWuv-Np750NqURl2hEvRFlTMgHQxXEoE5h5tfHzy9UPo",
      mentorId: "marcus-chen"
    },
    overview: "Maximize capital efficiency in Web3. This class breaks down advanced automated market maker liquidity provision (AMM LP), dynamic fee structures, impermanent loss hedging strategies, and multi-protocol flash loan configurations.",
    curriculum: [
      {
        title: "1. Concentrated Liquidity Mechanics",
        desc: "Analyze Uniswap V3 price ticks, active ranges, and capital efficiency multiplier curves."
      },
      {
        title: "2. Impermanent Loss & Delta Neutrality",
        desc: "Formulate hedges using options, short futures, or automated rebalancing vaults."
      },
      {
        title: "3. Yield Aggregators and Smart Vaults",
        desc: "Learn to design custom automated compounding yield strategies using Solidity."
      }
    ],
    prerequisites: [
      "Thorough understanding of automated market makers (AMMs)",
      "Understanding of derivative markets (futures, options)",
      "Basic algebraic modeling skills"
    ],
    benefits: [
      "Dynamic yield model spreadsheets and simulation tools",
      "Detailed guide on liquid staking derivatives integration",
      "Developer certification in DeFi Engineering"
    ]
  },
  {
    id: "cross-chain-deep",
    title: "Cross-Chain Deep Dive",
    level: "Beginner",
    duration: "60 Mins",
    date: "June 15",
    time: "4:00 PM EST",
    timeInfo: "Wed, 4:00 PM",
    attendees: 28,
    maxCapacity: 100,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBj52Ko3PbF2epXmxBfFawKkvbeSQd-a7pjQx-m_o6XhbwTwMHYB5WLCpL3Y2wYSAplN4hR2ZwjDgsyDX2fxb-NnfU2xee-K-spp9bWQhE2RUfc_P68Lb7dQDr87yi87rSV9P1s75mcsAECfNy5pO4nzD_j71mfR-ULEwS5GN70Lry7nhGzutjT6LfRKUHt0rlSGahYUtH1auENj32V8N9m6Fg4LyHlCVS-cLKzpqc7j_9H5JdM88D7ftAqj9VJpcWhCdN4p1DIPs",
    instructor: {
      name: "Sarah Jenkins",
      role: "Solidity Master",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgI9wjTQGf6qUTjZrc5UduNk8Ap-NBsOCeGWu39qr7nB56wL3t9G9pjlUDZfi9SZPd_sqC4ZtLOgKa2KlrltaSJp75z39YAsyF-tif_evgJqLi85AZmJ_1-sX6GAeVZ--_Xg9EdTk2FtNERzfv1wbIEAyNu3-qpT6Huw7g-86wenUmnKFEr6y7trmLoucng-3xnyHPqQrCVlk-Oj850HTIytzF3ir03-ij7-5FQDdxFykFgNv50UZEJs2osjhvq-GEzoiOTPt1gbs",
      mentorId: "sarah-jenkins"
    },
    overview: "Get started with the fundamentals of multi-chain blockchain network communication. We will examine the core concepts of atomic swaps, token wrapping, mint-and-burn bridge techniques, and simple optimistic bridging networks.",
    curriculum: [
      {
        title: "1. Why Multi-Chain?",
        desc: "Understand scaling limits, network fragmentation, and the need for interoperability."
      },
      {
        title: "2. Introduction to Bridging Models",
        desc: "Explain lock-and-mint, burn-and-mint, and atomic liquidity swaps."
      },
      {
        title: "3. Basic Bridge Interaction",
        desc: "Step-by-step walk-through of cross-chain token transfers and transaction checking."
      }
    ],
    prerequisites: [
      "No developer experience required; basic Web3 literacy is helpful"
    ],
    benefits: [
      "Glossary of cross-chain terms and architecture cheat sheet",
      "Certificate of participation",
      "Access to basic Solidity workshops"
    ]
  },
  {
    id: "intro-zkp",
    title: "Introduction to Zero-Knowledge Proofs",
    level: "Intermediate",
    duration: "120 Mins",
    date: "June 20",
    time: "2:00 PM EST",
    timeInfo: "Next Week, Mon 2:00 PM",
    attendees: 184,
    maxCapacity: 250,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9dO7MHeSSl782keKmLJSeri_UdbQKdtPXB9DRjtDTRYEeeO3QeN8A0HRrIEE7U2SpAjSIPvPr6LpYFQ5oSwyiIBScZASqEtPMg2J0iYUHnWuXApD4dQjgUV1EsEO9vDI9SdX8sH-IvjgVycI_MVQ3h-LLd-dE0bnsv0fz8MjjU-qdaMHGq7YmwCQ1tOfpylT1t3r9XlSsC1QxgKpWhMO6gL8m9Lylw7tTcIA6KexAu9zaYuUVHUjVIs0wOJGDVKG_VRFABBcu0Ls",
    instructor: {
      name: "Julian Thorne",
      role: "Core Developer",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCB84CUcH7sXP1SAQjZfAp5SayWmXFdAbmXdf576Jzth00CxgsJcCYdOo3H5AattesiRcusralahjkaTxkryfuf-jjlhsFRME7YTfbJdaM75YrQ-xlBDbMNDjolOlZ5Vdy6_Ly6CRryhksho8RLAajYQ9q3kxewLlCd6u5D7L2FmW7HOAopff18JOxbouNdrVL3Q_yXRrIIi6f9mmrCqJx5nH-1rO7HBOjL6S7FS3HTrmEUryTZPxImv1sqMNifuUM3D0dhLHb29zA",
      mentorId: "julian-thorne"
    },
    overview: "Establish a robust foundation in zero-knowledge proof technology. We cover the math of cryptographic commitments (KZG, IPA), interactive proofs, non-interactive transformations (Fiat-Shamir), and explore the engineering trade-offs of zk-SNARKs versus zk-STARKs.",
    curriculum: [
      {
        title: "1. The ZK Philosophy",
        desc: "Understanding soundness, completeness, and perfect zero-knowledge with interactive examples."
      },
      {
        title: "2. Polynomial Commitments",
        desc: "Delve into arithmetic circuits, R1CS representation, and cryptographic polynomial commitments."
      },
      {
        title: "3. Real-world Scaling & Privacy",
        desc: "Analyze rollups (zkEVM) and privacy layers (Tornado, ZCash) to see how ZKPs function in practice."
      }
    ],
    prerequisites: [
      "Basic algebraic understanding (modular arithmetic, polynomials)",
      "High-level familiarity with blockchain consensus models"
    ],
    benefits: [
      "Comprehensive PDF of ZK mathematical theory",
      "Verifiable premium workshop badge in D-Institute",
      "Whitelist access to subsequent advanced ZK implementations"
    ]
  }
];
