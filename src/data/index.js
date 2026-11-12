import appData from './residence_json.json';

function materializeData(value, now = Date.now()) {
  if (Array.isArray(value)) {
    return value.map((item) => materializeData(item, now));
  }

  if (value && typeof value === 'object') {
    if (Object.hasOwn(value, '$relativeToNowMs')) {
      return new Date(now + value.$relativeToNowMs).toISOString();
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, materializeData(item, now)])
    );
  }

  return value;
}

const topics = appData.topics;

export const INITIAL_HOUSEHOLD = materializeData(topics.household.data);
export const INITIAL_USERS = materializeData(topics.users.data);
export const INITIAL_VISITORS = materializeData(topics.visitors.data);
export const INITIAL_SERVICE_REQUESTS = materializeData(topics.serviceRequests.data);
export const INITIAL_PRE_APPROVED_PASSES = materializeData(topics.preApprovedPasses.data);
export const INITIAL_VEHICLES = materializeData(topics.vehicles.data);
export const INITIAL_NOTIFICATIONS = materializeData(topics.notifications.data);
export const INITIAL_ANNOUNCEMENTS = materializeData(topics.announcements.data);
export const INITIAL_ACTIVITY_LOGS = materializeData(topics.activityLogs.data);
export const EMERGENCY_CONTACTS = materializeData(topics.emergencyContacts.data);
