// Modern Dashboard Configuration with Soft Coding
// Dynamic, responsive, and highly customizable dashboard settings

export const DASHBOARD_CONFIG = {
  // Theme and Visual Configuration
  THEMES: {
    MEDICAL_MODERN: {
      id: 'medical_modern',
      name: 'Medical Modern',
      primaryColor: '#667eea',
      primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondaryGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accentGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      successGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      warningGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      cardShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      hoverShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
      textPrimary: '#2d3748',
      textSecondary: '#718096',
      borderRadius: '20px',
      animationDuration: '0.3s'
    },
    RADIOLOGY_PRO: {
      id: 'radiology_pro',
      name: 'Radiology Pro',
      primaryColor: '#1e3c72',
      primaryGradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      secondaryGradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
      accentGradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
      successGradient: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
      warningGradient: 'linear-gradient(135deg, #f79d00 0%, #64f38c 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.98)',
      cardShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
      hoverShadow: '0 25px 50px rgba(0, 0, 0, 0.12)',
      textPrimary: '#1a202c',
      textSecondary: '#4a5568',
      borderRadius: '16px',
      animationDuration: '0.4s'
    },
    DARK_ELEGANCE: {
      id: 'dark_elegance',
      name: 'Dark Elegance',
      primaryColor: '#232526',
      primaryGradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
      secondaryGradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
      accentGradient: 'linear-gradient(135deg, #06beb6 0%, #48b1bf 100%)',
      successGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      warningGradient: 'linear-gradient(135deg, #fcb045 0%, #fd1d1d 100%)',
      cardBackground: 'rgba(45, 55, 72, 0.95)',
      cardShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      hoverShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
      textPrimary: '#f7fafc',
      textSecondary: '#cbd5e0',
      borderRadius: '18px',
      animationDuration: '0.35s'
    }
  },

  // Widget Configuration
  WIDGETS: {
    STATS_CARDS: {
      PATIENTS_TODAY: {
        id: 'patients_today',
        title: 'Patients Today',
        icon: 'ri-user-heart-line',
        value: 127,
        change: '+12%',
        changeType: 'positive',
        subtitle: 'vs yesterday',
        color: 'primary',
        animation: 'fadeInUp',
        refreshInterval: 30000, // 30 seconds
        sparklineData: [25, 30, 28, 35, 40, 45, 42, 38, 44, 48, 52, 55]
      },
      REPORTS_ANALYZED: {
        id: 'reports_analyzed',
        title: 'Reports Analyzed',
        icon: 'ri-file-text-line',
        value: 1843,
        change: '+8.2%',
        changeType: 'positive',
        subtitle: 'this week',
        color: 'success',
        animation: 'fadeInUp',
        refreshInterval: 60000,
        sparklineData: [120, 135, 145, 130, 155, 165, 160, 175, 180, 185, 190, 195]
      },
      AI_ACCURACY: {
        id: 'ai_accuracy',
        title: 'AI Accuracy',
        icon: 'ri-robot-line',
        value: '94.7%',
        change: '+2.1%',
        changeType: 'positive',
        subtitle: 'this month',
        color: 'info',
        animation: 'fadeInUp',
        refreshInterval: 120000,
        sparklineData: [85, 87, 89, 91, 92, 93, 94, 94.2, 94.5, 94.6, 94.7, 94.7]
      },
      PROCESSING_TIME: {
        id: 'processing_time',
        title: 'Avg Processing',
        icon: 'ri-time-line',
        value: '2.3s',
        change: '-15%',
        changeType: 'positive',
        subtitle: 'faster',
        color: 'warning',
        animation: 'fadeInUp',
        refreshInterval: 45000,
        sparklineData: [3.2, 3.0, 2.8, 2.6, 2.5, 2.4, 2.3, 2.3, 2.2, 2.3, 2.3, 2.3]
      },
      ACTIVE_DOCTORS: {
        id: 'active_doctors',
        title: 'Active Doctors',
        icon: 'ri-stethoscope-line',
        value: 24,
        change: '+3',
        changeType: 'positive',
        subtitle: 'online now',
        color: 'secondary',
        animation: 'fadeInUp',
        refreshInterval: 90000,
        sparklineData: [18, 19, 20, 21, 22, 23, 24, 24, 23, 24, 24, 24]
      },
      URGENT_CASES: {
        id: 'urgent_cases',
        title: 'Urgent Cases',
        icon: 'ri-alarm-warning-line',
        value: 3,
        change: '-2',
        changeType: 'positive',
        subtitle: 'pending',
        color: 'danger',
        animation: 'fadeInUp',
        refreshInterval: 15000,
        sparklineData: [8, 7, 6, 5, 4, 3, 3, 4, 3, 3, 3, 3]
      }
    },

    CHARTS: {
      REAL_TIME_ANALYTICS: {
        id: 'real_time_analytics',
        title: 'Real-Time Analytics',
        type: 'area_spline',
        height: 400,
        refreshInterval: 5000,
        categories: ['Reports', 'Accuracy', 'Speed', 'Satisfaction'],
        series: [
          {
            name: 'Today',
            data: [85, 94, 88, 92],
            color: '#667eea'
          },
          {
            name: 'Yesterday',
            data: [78, 92, 84, 89],
            color: '#f093fb'
          }
        ],
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      DEPARTMENT_PERFORMANCE: {
        id: 'department_performance',
        title: 'Department Performance',
        type: 'radial_bar',
        height: 350,
        refreshInterval: 30000,
        series: [92, 85, 78, 96, 88],
        labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Radiology', 'Emergency'],
        colors: ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a']
      },
      GLOBAL_USAGE: {
        id: 'global_usage',
        title: 'Global Usage Map',
        type: 'world_map',
        height: 500,
        refreshInterval: 120000,
        dataPoints: [
          { country: 'US', value: 2840, coords: [-98.5795, 39.8283] },
          { country: 'UK', value: 1240, coords: [-3.4360, 55.3781] },
          { country: 'Germany', value: 1560, coords: [10.4515, 51.1657] },
          { country: 'Japan', value: 980, coords: [138.2529, 36.2048] },
          { country: 'Australia', value: 720, coords: [133.7751, -25.2744] }
        ]
      }
    },

    ACTIVITY_FEED: {
      id: 'activity_feed',
      title: 'Live Activity Feed',
      maxItems: 10,
      refreshInterval: 10000,
      autoScroll: true,
      activities: [
        {
          id: 1,
          type: 'report_completed',
          message: 'Chest X-ray analysis completed',
          user: 'Dr. Smith',
          timestamp: new Date(),
          priority: 'normal',
          icon: 'ri-file-text-line',
          color: 'success'
        },
        {
          id: 2,
          type: 'ai_processing',
          message: 'AI model processing MRI scan',
          user: 'AI System',
          timestamp: new Date(),
          priority: 'high',
          icon: 'ri-robot-line',
          color: 'info'
        },
        {
          id: 3,
          type: 'urgent_case',
          message: 'Urgent case flagged for review',
          user: 'System Alert',
          timestamp: new Date(),
          priority: 'urgent',
          icon: 'ri-alarm-warning-line',
          color: 'danger'
        }
      ]
    }
  },

  // Layout Configuration
  LAYOUTS: {
    DEFAULT: {
      id: 'default',
      name: 'Default Layout',
      structure: [
        {
          row: 1,
          cols: [
            { widget: 'PATIENTS_TODAY', size: 'col-lg-2 col-md-4 col-sm-6' },
            { widget: 'REPORTS_ANALYZED', size: 'col-lg-2 col-md-4 col-sm-6' },
            { widget: 'AI_ACCURACY', size: 'col-lg-2 col-md-4 col-sm-6' },
            { widget: 'PROCESSING_TIME', size: 'col-lg-2 col-md-4 col-sm-6' },
            { widget: 'ACTIVE_DOCTORS', size: 'col-lg-2 col-md-4 col-sm-6' },
            { widget: 'URGENT_CASES', size: 'col-lg-2 col-md-4 col-sm-6' }
          ]
        },
        {
          row: 2,
          cols: [
            { widget: 'REAL_TIME_ANALYTICS', size: 'col-lg-8' },
            { widget: 'DEPARTMENT_PERFORMANCE', size: 'col-lg-4' }
          ]
        },
        {
          row: 3,
          cols: [
            { widget: 'GLOBAL_USAGE', size: 'col-lg-8' },
            { widget: 'ACTIVITY_FEED', size: 'col-lg-4' }
          ]
        }
      ]
    },
    EXECUTIVE: {
      id: 'executive',
      name: 'Executive View',
      structure: [
        {
          row: 1,
          cols: [
            { widget: 'REPORTS_ANALYZED', size: 'col-lg-3' },
            { widget: 'AI_ACCURACY', size: 'col-lg-3' },
            { widget: 'PROCESSING_TIME', size: 'col-lg-3' },
            { widget: 'URGENT_CASES', size: 'col-lg-3' }
          ]
        },
        {
          row: 2,
          cols: [
            { widget: 'REAL_TIME_ANALYTICS', size: 'col-lg-12' }
          ]
        },
        {
          row: 3,
          cols: [
            { widget: 'GLOBAL_USAGE', size: 'col-lg-12' }
          ]
        }
      ]
    }
  },

  // Animation and Interaction Settings
  ANIMATIONS: {
    CARD_ENTRANCE: {
      duration: 600,
      delay: 100,
      easing: 'ease-out'
    },
    CHART_LOAD: {
      duration: 1000,
      delay: 200,
      easing: 'ease-in-out'
    },
    HOVER_EFFECTS: {
      duration: 200,
      easing: 'ease'
    }
  },

  // Real-time Update Settings
  REAL_TIME: {
    UPDATE_INTERVALS: {
      fast: 5000,    // 5 seconds
      medium: 30000, // 30 seconds
      slow: 120000   // 2 minutes
    },
    WEBSOCKET_CONFIG: {
      url: 'ws://localhost:8000/ws/dashboard/',
      reconnectInterval: 5000,
      maxReconnectAttempts: 10
    }
  },

  // Responsive Breakpoints
  BREAKPOINTS: {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1400
  }
};

// Helper functions for dashboard configuration
export const DashboardHelpers = {
  getTheme: (themeId) => {
    return DASHBOARD_CONFIG.THEMES[themeId] || DASHBOARD_CONFIG.THEMES.MEDICAL_MODERN;
  },

  getWidget: (widgetId) => {
    const allWidgets = {
      ...DASHBOARD_CONFIG.WIDGETS.STATS_CARDS,
      ...DASHBOARD_CONFIG.WIDGETS.CHARTS,
      ACTIVITY_FEED: DASHBOARD_CONFIG.WIDGETS.ACTIVITY_FEED
    };
    return allWidgets[widgetId];
  },

  getLayout: (layoutId) => {
    return DASHBOARD_CONFIG.LAYOUTS[layoutId] || DASHBOARD_CONFIG.LAYOUTS.DEFAULT;
  },

  generateRandomData: (min, max, count) => {
    return Array.from({ length: count }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  },

  formatNumber: (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },

  getTimeAgo: (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  },

  interpolateColor: (color1, color2, factor) => {
    const rgb1 = color1.match(/\w\w/g).map(x => parseInt(x, 16));
    const rgb2 = color2.match(/\w\w/g).map(x => parseInt(x, 16));
    const rgb = rgb1.map((c1, i) => Math.round(c1 + factor * (rgb2[i] - c1)));
    return `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
  },

  validateWidgetConfig: (config) => {
    const required = ['id', 'title', 'refreshInterval'];
    return required.every(field => config.hasOwnProperty(field));
  }
};

export default DASHBOARD_CONFIG;
