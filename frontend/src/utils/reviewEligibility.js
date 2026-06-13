import { getPublicEnrollments, getPrivateBookings } from './enrollmentStorage';
import { getAllSessions } from './sessionsStorage';
import { hasUserReviewed } from './reviewsStorage';
import { getProfile } from './profileStorage';

const ELIGIBILITY_MESSAGES = {
  mentor: 'Book a private session or enroll in a workshop with this mentor to leave feedback.',
  library: 'Purchase or download this resource to leave a review.',
  session: 'You must be enrolled in this workshop as a student to leave a review.',
  mission: 'Only the mission client can leave feedback after the contract is completed.',
  institute: 'Enroll in a workshop offered by this institute to leave a review.',
  alreadyReviewed: 'You have already submitted a review.',
};

function getPurchasedIds() {
  try {
    return JSON.parse(localStorage.getItem('bts_library_purchased') || '[]');
  } catch {
    return [];
  }
}

function isEnrolledInMentorWorkshop(mentorId) {
  const enrollments = getPublicEnrollments();
  return getAllSessions().some(
    (s) => enrollments.includes(s.id) && s.instructor?.mentorId === mentorId
  );
}

function hasMentorBooking(mentorId) {
  return getPrivateBookings().some(
    (b) => b.mentorId === mentorId && b.status !== 'Cancelled'
  );
}

function isEnrolledInInstituteWorkshop(instituteId, instituteSessionIds = []) {
  const enrollments = getPublicEnrollments();
  if (instituteSessionIds.length > 0) {
    return instituteSessionIds.some((id) => enrollments.includes(id));
  }
  const instituteSessions = getAllSessions().filter((s) =>
    s.instituteId === instituteId
  );
  return instituteSessions.some((s) => enrollments.includes(s.id));
}

export function checkReviewEligibility(entityType, entityId, context = {}) {
  const profile = getProfile();
  const userId = profile.userId;

  if (hasUserReviewed(entityType, entityId, userId)) {
    return { eligible: false, reason: ELIGIBILITY_MESSAGES.alreadyReviewed };
  }

  switch (entityType) {
    case 'mentor': {
      const mentorId = context.mentorId || entityId;
      const eligible = hasMentorBooking(mentorId) || isEnrolledInMentorWorkshop(mentorId);
      return {
        eligible,
        reason: eligible ? null : ELIGIBILITY_MESSAGES.mentor,
      };
    }
    case 'library': {
      const purchasedIds = context.purchasedIds ?? getPurchasedIds();
      const eligible = purchasedIds.includes(entityId);
      return {
        eligible,
        reason: eligible ? null : ELIGIBILITY_MESSAGES.library,
      };
    }
    case 'session': {
      const enrollments = context.enrollments ?? getPublicEnrollments();
      const eligible = enrollments.includes(entityId);
      return {
        eligible,
        reason: eligible ? null : ELIGIBILITY_MESSAGES.session,
      };
    }
    case 'mission': {
      const { isCreator = false, missionStatus = '' } = context;
      const eligible = isCreator && missionStatus === 'Completed';
      return {
        eligible,
        reason: eligible ? null : ELIGIBILITY_MESSAGES.mission,
      };
    }
    case 'institute': {
      const instituteSessionIds = context.instituteSessionIds || [];
      const eligible = isEnrolledInInstituteWorkshop(entityId, instituteSessionIds);
      return {
        eligible,
        reason: eligible ? null : ELIGIBILITY_MESSAGES.institute,
      };
    }
    default:
      return { eligible: false, reason: 'Reviews are not available for this item.' };
  }
}
