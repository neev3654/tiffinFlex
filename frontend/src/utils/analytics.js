import ReactGA from 'react-ga4';

/**
 * Custom hook or utility to track specific user events
 * @param {string} category - Event category (e.g., 'Auth', 'Menu', 'Order')
 * @param {string} action - Action performed (e.g., 'Signed Up', 'Meal Swapped')
 * @param {string} label - Optional label for the event
 * @param {number} value - Optional numeric value for the event
 */
export const trackEvent = (category, action, label = null, value = null) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

export const ANALYTICS_CATEGORIES = {
  AUTH: 'Authentication',
  MENU: 'Menu Interaction',
  ORDER: 'Order Management',
  USER: 'User Profile',
  ADMIN: 'Admin Actions',
};

export const ANALYTICS_ACTIONS = {
  LOGIN: 'User Logged In',
  SIGNUP: 'User Signed Up',
  LOGOUT: 'User Logged Out',
  MEAL_SWAP: 'Meal Swapped',
  MENU_VIEW: 'Menu Viewed',
  PROFILE_UPDATE: 'Profile Updated',
  ADMIN_MEAL_ADD: 'Admin Added Meal',
};
