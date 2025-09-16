import DefaultLayout from '../layouts/defaultLayout';
import BlankLayout from '../layouts/blank-layout';
import Index from '../views';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES, ConfigHelpers } from '../config/appConfig.js';

// Auth Pages
import SignIn from '../views/auth/sign-in';
import SecureSignIn from '../views/auth/secure-sign-in'; // Secure version
import BeautifulSecureSignIn from '../views/auth/beautiful-secure-sign-in'; // Beautiful + Secure version
import ModernSignIn from '../components/auth/ModernSignIn'; // New comprehensive sign-in
import SignUp from '../views/auth/sign-up';
import RegistrationPage from '../views/auth/RegistrationPage';
import SimpleLoginForm from '../components/SimpleLoginForm'; // Emergency simple login

// Dashboard Pages
import MainDashboard from '../views/dashboard-pages/main-dashboard';
import HospitalDashboardOne from '../views/dashboard-pages/hospital-dashboard-one';
import HospitalDashboardEnhanced from '../views/dashboard-pages/hospital-dashboard-enhanced';
import HospitalDashboardTwo from '../views/dashboard-pages/hospital-dashboard-two';

// Patient Management Pages
import PatientDashboard from '../views/dashboard-pages/patient-dashboard';
import PatientList from '../views/dashboard-pages/patient-list';
import PatientForm from '../views/dashboard-pages/patient-form';
import PatientDetails from '../views/dashboard-pages/patient-details';
import PatientReports from '../views/dashboard-pages/patient-reports';

// RBAC Management Components (Super Admin Only)
import EnhancedRBACUserManagement from '../views/dashboard-pages/EnhancedRBACUserManagement';
import RBACRoleManagement from '../views/dashboard-pages/RBACRoleManagement';
import RBACActivityMonitor from '../views/dashboard-pages/RBACActivityMonitor';
import RBACSessionManagement from '../views/dashboard-pages/RBACSessionManagement';
import RBACSecurityAlerts from '../views/dashboard-pages/RBACSecurityAlerts';

// Landing Page
import LandingPage from '../views/LandingPage';
import TestLanding from '../views/TestLanding';

// Email Page
import Inbox from '../views/email/inbox';
import EmailCompose from '../views/email/email-compose';

// Doctor Page
import AddDoctor from '../views/doctor/add-doctor';
import DoctorList from '../views/doctor/doctor-list';
import DoctorProfile from '../views/doctor/doctor-profile';
import EditDoctor from '../views/doctor/edit-doctor';

// UI Elements
import Alerts from '../views/ui-elements/alerts';
import Badges from '../views/ui-elements/badges';
import Breadcrumb from '../views/ui-elements/breadcrumb';
import Buttons from '../views/ui-elements/buttons';
import Cards from '../views/ui-elements/cards';
import Carousels from '../views/ui-elements/carousel';
import Colors from '../views/ui-elements/colors';
import Grid from '../views/ui-elements/grid';
import Images from '../views/ui-elements/images';
import ListGroups from '../views/ui-elements/listGroup';
import Modals from '../views/ui-elements/modal';
import Notification from '../views/ui-elements/notification';
import Paginations from '../views/ui-elements/pagination';
import Popovers from '../views/ui-elements/popovers';
import Progressbars from '../views/ui-elements/progressbars';
import Tabs from '../views/ui-elements/tabs';
import Tooltips from '../views/ui-elements/tooltips';
import Typography from '../views/ui-elements/typography';
import Video from '../views/ui-elements/video';

// Form Page
import FormCheckbox from '../views/forms/form-checkbox';
import FormElements from '../views/forms/form-elements';
import FormRadio from '../views/forms/form-radio';
import FormSwitch from '../views/forms/form-switch';
import FormValidatioins from '../views/forms/form-validations';

// Wizard Page
import SimpalWizard from '../views/wizard/simple-wizard';
import ValidteWizard from '../views/wizard/validate-wizard';
import VerticalWizard from '../views/wizard/vertical-wizard';

// Table Page
import BasicTable from '../views/tables/basic-table';
import DataTable from '../views/tables/data-table';
import EditTable from '../views/tables/editable-table';

// Charts Page
import ApexChart from '../views/charts/apex-chart';
import ChartAm from '../views/charts/chart-am';
import ChartPage from '../views/charts/chart-page';
import EChart from '../views/charts/e-chart';

// Icons Page
import Dripicons from '../views/icons/dripicons';
import FontAwsomeFive from '../views/icons/fontawesome-Five';
import Lineawesome from '../views/icons/line-awesome';
import Remixicon from '../views/icons/remixicon';
import Unicons from '../views/icons/unicons';

// Maps
import GoogleMap from '../views/maps/google-map';

// Extra Page
import AccountSetting from '../views/extra-pages/account-setting';
import BlankPage from '../views/extra-pages/blank-page';
import CommingSoon from '../views/extra-pages/pages-comingsoon';
import Error404 from '../views/extra-pages/pages-error-404';
import Error500 from '../views/extra-pages/pages-error-500';
import Faq from '../views/extra-pages/pages-faq';
import Invoice from '../views/extra-pages/pages-invoice';
import Maintenance from '../views/extra-pages/pages-maintenance';
import PricingOne from '../views/extra-pages/pages-pricing-one';
import Pricing from '../views/extra-pages/pages-pricing';
import Timeline from '../views/extra-pages/pages-timeline';
import PrivacyPolicy from '../views/extra-pages/privacy-policy';
import PrivacySetting from '../views/extra-pages/privacy-setting';
import TermsOfService from '../views/extra-pages/terms-of-use';

// Soft-coded route definitions using configuration
export const DefaultRoute = [
  {
    path: ROUTES.DASHBOARD.ROOT,
    element: (
      <ProtectedRoute>
        <DefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <MainDashboard />,
      },
      {
        path: 'main-dashboard',
        element: <MainDashboard />,
      },
      {
        path: 'hospital-dashboard-one', // Corresponds to ROUTES.DASHBOARD.HOSPITAL_DASHBOARD_ONE
        element: <HospitalDashboardEnhanced />,
      },
      {
        path: 'hospital-dashboard-legacy', // Legacy version
        element: <HospitalDashboardOne />,
      },
      {
        path: 'hospital-dashboard-two', // Corresponds to ROUTES.DASHBOARD.HOSPITAL_DASHBOARD_TWO
        element: <HospitalDashboardTwo />,
      },
      {
        path: 'patient-dashboard',
        element: <PatientDashboard />, // Updated to use new PatientDashboard component
      },
      {
        path: 'patients',
        element: <PatientList />,
      },
      {
        path: 'patients/add',
        element: <PatientForm />,
      },
      {
        path: 'patients/edit/:patientId',
        element: <PatientForm />,
      },
      {
        path: 'patients/view/:patientId',
        element: <PatientDetails />,
      },
      {
        path: 'patient-reports',
        element: <PatientReports />,
      },
      {
        path: 'rbac-user-management',
        element: <EnhancedRBACUserManagement />,
      },
      {
        path: 'rbac-role-management',
        element: <RBACRoleManagement />,
      },
      {
        path: 'rbac-activity-monitor',
        element: <RBACActivityMonitor />,
      },
      {
        path: 'rbac-session-management',
        element: <RBACSessionManagement />,
      },
      {
        path: 'rbac-security-alerts',
        element: <RBACSecurityAlerts />,
      },
      {
        path: 'email/inbox',
        element: <Inbox />,
      },
      {
        path: 'email/email-compose',
        element: <EmailCompose />,
      },
      {
        path: 'doctor/doctor-list',
        element: <DoctorList />,
      },
      {
        path: 'doctor/add-doctor',
        element: <AddDoctor />,
      },
      {
        path: 'doctor/doctor-profile',
        element: <DoctorProfile />,
      },
      {
        path: 'doctor/edit-doctor',
        element: <EditDoctor />,
      },
      {
        path: 'ui-elements/alerts',
        element: <Alerts />,
      },
      {
        path: 'ui-elements/badges',
        element: <Badges />,
      },
      {
        path: 'ui-elements/breadcrumb',
        element: <Breadcrumb />,
      },
      {
        path: 'ui-elements/buttons',
        element: <Buttons />,
      },
      {
        path: 'ui-elements/cards',
        element: <Cards />,
      },
      {
        path: 'ui-elements/carousel',
        element: <Carousels />,
      },
      {
        path: 'ui-elements/colors',
        element: <Colors />,
      },
      {
        path: 'ui-elements/grid',
        element: <Grid />,
      },
      {
        path: 'ui-elements/images',
        element: <Images />,
      },
      {
        path: 'ui-elements/list-group',
        element: <ListGroups />,
      },
      {
        path: 'ui-elements/modal',
        element: <Modals />,
      },
      {
        path: 'ui-elements/notifications',
        element: <Notification />,
      },
      {
        path: 'ui-elements/pagination',
        element: <Paginations />,
      },
      {
        path: 'ui-elements/popovers',
        element: <Popovers />,
      },
      {
        path: 'ui-elements/progressbars',
        element: <Progressbars />,
      },
      {
        path: 'ui-elements/tabs',
        element: <Tabs />,
      },
      {
        path: 'ui-elements/tooltips',
        element: <Tooltips />,
      },
      {
        path: 'ui-elements/typography',
        element: <Typography />,
      },
      {
        path: 'ui-elements/video',
        element: <Video />,
      },
      {
        path: 'forms/form-checkbox',
        element: <FormCheckbox />,
      },
      {
        path: 'forms/form-elements',
        element: <FormElements />,
      },
      {
        path: 'forms/form-radio',
        element: <FormRadio />,
      },
      {
        path: 'forms/form-switch',
        element: <FormSwitch />,
      },
      {
        path: 'forms/form-validations',
        element: <FormValidatioins />,
      },
      {
        path: 'wizard/simple-wizard',
        element: <SimpalWizard />,
      },
      {
        path: 'wizard/validate-wizard',
        element: <ValidteWizard />,
      },
      {
        path: 'wizard/vertical-wizard',
        element: <VerticalWizard />,
      },
      {
        path: 'tables/basic-table',
        element: <BasicTable />,
      },
      {
        path: 'tables/data-table',
        element: <DataTable />,
      },
      {
        path: 'tables/editable-table',
        element: <EditTable />,
      },
      {
        path: 'charts/apex-chart',
        element: <ApexChart />,
      },
      {
        path: 'charts/chart-am',
        element: <ChartAm />,
      },
      {
        path: 'charts/chart-page',
        element: <ChartPage />,
      },
      {
        path: 'charts/e-chart',
        element: <EChart />,
      },
      {
        path: 'icons/dripicons',
        element: <Dripicons />,
      },
      {
        path: 'icons/fontawesome-five',
        element: <FontAwsomeFive />,
      },
      {
        path: 'icons/line-awesome',
        element: <Lineawesome />,
      },
      {
        path: 'icons/remixicon',
        element: <Remixicon />,
      },
      {
        path: 'icons/unicons',
        element: <Unicons />,
      },
      {
        path: 'maps/google-map',
        element: <GoogleMap />,
      },
      {
        path: 'extra-pages/account-setting',
        element: <AccountSetting />,
      },
      {
        path: 'extra-pages/blank-page',
        element: <BlankPage />,
      },
      {
        path: 'extra-pages/pages-comingsoon',
        element: <CommingSoon />,
      },
      {
        path: 'extra-pages/pages-error-404',
        element: <Error404 />,
      },
      {
        path: 'extra-pages/pages-error-500',
        element: <Error500 />,
      },
      {
        path: 'extra-pages/pages-faq',
        element: <Faq />,
      },
      {
        path: 'extra-pages/pages-invoice',
        element: <Invoice />,
      },
      {
        path: 'extra-pages/pages-maintenance',
        element: <Maintenance />,
      },
      {
        path: 'extra-pages/pages-pricing-one',
        element: <PricingOne />,
      },
      {
        path: 'extra-pages/pages-pricing',
        element: <Pricing />,
      },
      {
        path: 'extra-pages/pages-timeline',
        element: <Timeline />,
      },
      {
        path: 'extra-pages/privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'extra-pages/privacy-setting',
        element: <PrivacySetting />,
      },
      { path: 'extra-pages/terms-of-use', element: <TermsOfService /> },
    ],
  },
];

// Soft-coded authentication routes
export const BlankLayoutRouter = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      {
        path: '',
        element: <LandingPage />,
      },
    ],
  },
  {
    path: '/auth', // Base path for authentication routes
    element: <BlankLayout />,
    children: [
      {
        path: 'login', // Updated to match ROUTES.AUTH.LOGIN
        element: <SignIn />,
      },
      {
        path: 'sign-in', // New Modern Comprehensive Sign-In (PRIMARY)
        element: <ModernSignIn />,
      },
      {
        path: 'modern-signin', // Alternative path for modern sign-in
        element: <ModernSignIn />,
      },
      {
        path: 'beautiful-signin', // Fallback: Beautiful + Secure login
        element: <BeautifulSecureSignIn />,
      },
      {
        path: 'simple-login', // EMERGENCY: Simple working login form
        element: <SimpleLoginForm />,
      },
      {
        path: 'secure-signin', // Enterprise secure version
        element: <SecureSignIn />,
      },
      {
        path: 'legacy-signin', // Legacy version if needed
        element: <SignIn />,
      },
      {
        path: 'register', // Updated to match ROUTES.AUTH.REGISTER
        element: <RegistrationPage />,
      },
      {
        path: 'sign-up', // Keep for backward compatibility
        element: <SignUp />,
      },
      {
        path: 'registration', // Keep for backward compatibility
        element: <RegistrationPage />,
      },
      {
        path: 'forgot-password', // Matches ROUTES.AUTH.FORGOT_PASSWORD
        element: <SignIn />, // Can be updated to ForgotPassword component
      },
      {
        path: 'reset-password', // Matches ROUTES.AUTH.RESET_PASSWORD
        element: <SignIn />, // Can be updated to ResetPassword component
      },
    ],
  },
  {
    path: '/extra-pages',
    element: <BlankLayout />,
    children: [
      {
        path: 'pages-error-404',
        element: <Error404 />,
      },
      {
        path: 'pages-error-500',
        element: <Error500 />,
      },
      {
        path: 'pages-maintenance',
        element: <Maintenance />,
      },
      {
        path: 'pages-comingsoon',
        element: <CommingSoon />,
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'terms-of-use',
        element: <TermsOfService />,
      },
    ],
  },
];
