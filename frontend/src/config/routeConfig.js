// Route Configuration - Centralized route mapping
export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/auth/sign-in',
  REGISTER: '/auth/sign-up',
  
  // Dashboard Routes (Protected)
  DASHBOARD: {
    BASE: '/dashboard',
    MAIN: '/dashboard', // Default dashboard
    MAIN_DASHBOARD: '/dashboard/main-dashboard',
    HOSPITAL_DASHBOARD_ONE: '/dashboard/hospital-dashboard-one',
    HOSPITAL_DASHBOARD_TWO: '/dashboard/hospital-dashboard-two',
  },
  
  // Email Routes
  EMAIL: {
    INBOX: '/dashboard/email/inbox',
    COMPOSE: '/dashboard/email/email-compose',
  },
  
  // Doctor Routes
  DOCTOR: {
    LIST: '/dashboard/doctor/doctor-list',
    ADD: '/dashboard/doctor/add-doctor',
    PROFILE: '/dashboard/doctor/doctor-profile',
    EDIT: '/dashboard/doctor/edit-doctor',
  },
  
  // Auth Routes
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    REGISTRATION: '/auth/registration',
  },
  
  // Error Pages
  ERROR: {
    NOT_FOUND: '/extra-pages/pages-error-404',
    SERVER_ERROR: '/extra-pages/pages-error-500',
    MAINTENANCE: '/extra-pages/pages-maintenance',
    COMING_SOON: '/extra-pages/pages-comingsoon',
  }
};

// Helper function to get route by key
export const getRoute = (routePath) => {
  const keys = routePath.split('.');
  let route = ROUTES;
  
  for (const key of keys) {
    route = route[key];
    if (!route) {
      console.warn(`Route not found: ${routePath}`);
      return '/';
    }
  }
  
  return route;
};

// Validation helper
export const isValidRoute = (path) => {
  const getAllRoutes = (obj, prefix = '') => {
    const routes = [];
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        routes.push(value);
      } else if (typeof value === 'object') {
        routes.push(...getAllRoutes(value, `${prefix}${key}.`));
      }
    }
    return routes;
  };
  
  const allRoutes = getAllRoutes(ROUTES);
  return allRoutes.includes(path);
};

export default ROUTES;
