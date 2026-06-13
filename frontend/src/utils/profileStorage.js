const DEFAULT_PROFILE = {
  name: "John Doe",
  email: "john.doe@bitstacks.edu",
  phone: "+1 (555) 019-2834",
  role: "Premium Member",
  profileType: "Freelancer", // "Student" | "Mentor" | "Freelancer"
  verificationStatus: "Verified Scholar", // "New User" | "Verified Scholar"
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGwwnDm6m5r0C-N0LHiqCBdL2-Nqx8_NqM4iWbojCLkbc_lfkXRoD8ifHqFu_B4YIjC5ptg1deTb7eMqgkoUlSehDIy654yLdySvgNwbY744bsS7-QPDkq8VkubMIslVtgfCIN5VL-RCiGgf7ePrgYIfCFwJGsiNocFZZ5Z_twCj6Fpa0p_1lO7g3d7TBFB_N83r1viTB_zGTY-y9EGraWh8F1Y-_qTQrA1O1izM2LvzBfBgXZ36Y67pgHQLmfW-TzCjpN9MLE9OU",
  bio: "Senior Solidity Auditor & Smart Contract Developer. Passionate about DeFi security, decentralized governance, and mentoring next-gen Web3 builders.",
  skillLevel: "Advanced",
  topicInterests: ["Smart Contracts", "DeFi (Fintech)", "Big Data / Cybersecurity"],
  linkedin: "https://linkedin.com/in/johndoe-solidity",
  github: "https://github.com/johndoe-dev",
  website: "https://johndoe.eth.limo",
  userId: "BTS-8839-E4A",
  platformRole: "admin" // "admin" | "member" — admins can create premium public sessions
};

export function getProfile() {
  const data = localStorage.getItem('bts_user_profile');
  if (!data) {
    localStorage.setItem('bts_user_profile', JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

export function isPlatformAdmin() {
  return getProfile().platformRole === 'admin';
}

export function updateProfile(updatedFields) {
  const current = getProfile();
  const nextProfile = { ...current, ...updatedFields };
  localStorage.setItem('bts_user_profile', JSON.stringify(nextProfile));
  
  // Dispatch dynamic sync event
  const event = new CustomEvent('bts_profile_change', { detail: nextProfile });
  window.dispatchEvent(event);
  
  return nextProfile;
}
