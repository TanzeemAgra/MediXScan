// Landing Page Configuration - Soft Coded for Easy Customization
const landingPageConfig = {
  // Brand Configuration - Advanced Professional Logos
  brand: {
    name: "MediXScan AI",
    tagline: "Advanced Radiology Intelligence",
    subtitle: "Revolutionizing Medical Diagnostics with AI",
    
    // Professional Logo Suite - Soft Coded for Easy Updates
    logo: "/assets/images/medixscan-logo-main.png",           // Main colored logo for light backgrounds
    logoWhite: "/assets/images/medixscan-logo-white.png",     // White background logo for dark themes
    logoIcon: "/assets/images/medixscan-icon-512.png",        // App icon/favicon
    heroBackground: "/assets/images/medixscan-hero-1600x900.png", // Professional hero background
    
    // Logo Configuration
    logoConfig: {
      main: {
        width: 800,
        height: 200,
        aspectRatio: "4:1",
        usageContext: "headers, navigation, general branding"
      },
      white: {
        width: 800,
        height: 200,
        aspectRatio: "4:1", 
        usageContext: "dark backgrounds, overlays"
      },
      icon: {
        width: 512,
        height: 512,
        aspectRatio: "1:1",
        usageContext: "app icons, favicons, social media"
      },
      hero: {
        width: 1600,
        height: 900,
        aspectRatio: "16:9",
        usageContext: "hero sections, landing page backgrounds"
      }
    },
    
    description: "Cutting-edge AI-powered radiology analysis platform designed for modern healthcare professionals. Enhance diagnostic accuracy, streamline workflows, and deliver superior patient care.",
    compliance: {
      hipaa: true,
      gdpr: true,
      soc2: true,
      iso27001: true,
      tagline: "HIPAA & GDPR Compliant Medical AI Platform"
    }
  },

  // Navigation Configuration - Professional Spacing Control
  navigation: {
    position: "fixed", // fixed, sticky, static
    background: "transparent", // transparent, solid, gradient
    scrollBackground: "rgba(255, 255, 255, 0.95)", // Background when scrolled
    textColor: "#ffffff",
    scrollTextColor: "#333333",
    
    // Professional Spacing Configuration - Soft Coded
    spacing: {
      height: "70px",           // Navigation bar height
      padding: {
        vertical: "1rem",       // Top and bottom padding inside navbar
        horizontal: "1.5rem"    // Left and right padding inside navbar
      },
      marginBottom: "20px",     // Space between navbar and hero content
      logoSpacing: "1rem",      // Space between logo and navigation items
      itemSpacing: "2rem"       // Space between navigation menu items
    },
    
    // Logo Configuration
    logo: {
      type: "image", // image, text, both
      showBrand: true,
      maxHeight: "45px",        // Slightly larger for better visual balance
      spacing: {
        marginRight: "1rem"     // Space between logo and brand text
      }
    },
    menuItems: [
      {
        label: "Home",
        href: "#home",
        type: "scroll",
        active: true
      },
      {
        label: "Features",
        href: "#features", 
        type: "scroll"
      },
      {
        label: "Solutions",
        href: "#solutions",
        type: "scroll"
      },
      {
        label: "About",
        href: "#about",
        type: "scroll"
      },
      {
        label: "Contact",
        href: "#contact",
        type: "scroll"
      },
      {
        label: "Compliance",
        href: "#compliance", 
        type: "scroll"
      },
      {
        label: "Privacy",
        href: "/extra-pages/privacy-policy",
        type: "link"
      }
    ],
    ctaButtons: [
      {
        text: "Login",
        type: "secondary",
        action: "login",
        show: true,
        variant: "outline"
      },
      {
        text: "Register",
        type: "primary", 
        action: "register",
        show: true,
        variant: "solid"
      }
    ],
    mobileBreakpoint: "lg" // Collapse on screens smaller than lg
  },

  // Enhanced Hero Section Configuration - Soft Coded Layout Control
  hero: {
    title: "AI-Powered Radiology Excellence",
    subtitle: "Revolutionary Medical Diagnostics with Advanced Intelligence",
    description: "Transform healthcare delivery with cutting-edge AI that enhances diagnostic precision, accelerates analysis workflows, and elevates patient care standards.",
    
    // Layout Configuration - Soft Coded for Easy Sizing Control
    layout: {
      // Vertical Height Control - Professional Sizing
      height: {
        desktop: "70vh",        // 70% viewport height on desktop (was min-vh-100)
        tablet: "75vh",         // 75% viewport height on tablet
        mobile: "80vh",         // 80% viewport height on mobile
        minimum: "500px",       // Minimum height fallback
        maximum: "800px"        // Maximum height to prevent overlap
      },
      
      // Content Positioning
      contentAlignment: {
        vertical: "center",     // top, center, bottom
        horizontal: "left",     // left, center, right
        textAlign: "left"       // left, center, right
      },
      
      // Professional Spacing Configuration - Soft Coded
      spacing: {
        // Navigation-aware spacing
        top: "110px",          // Increased space for navigation bar + professional gap
        navigationGap: "30px", // Additional gap between navigation and hero content
        bottom: "80px",        // Increased spacing before next section for professional look
        sectionGap: "60px",    // Larger gap between sections to prevent overlap
        contentPadding: "2.5rem", // Increased internal content padding
        
        // Responsive spacing adjustments
        mobile: {
          top: "90px",         // Smaller navigation on mobile
          navigationGap: "20px",
          bottom: "50px",
          contentPadding: "1.5rem"
        },
        tablet: {
          top: "100px",        // Medium spacing for tablet
          navigationGap: "25px",
          bottom: "60px", 
          contentPadding: "2rem"
        }
      },
      
      // Responsive Breakpoints
      breakpoints: {
        mobile: "768px",
        tablet: "1024px",
        desktop: "1200px"
      }
    },
    
    ctaButtons: [
      {
        text: "Start Free Trial",
        type: "primary",
        action: "trial",
        icon: "fas fa-rocket"
      },
      {
        text: "Watch Demo",
        type: "secondary", 
        action: "demo",
        icon: "fas fa-play-circle"
      }
    ],
    design: {
      // Background Configuration - Soft Coded for Easy Customization
      backgroundType: "image", // gradient, image, video, professional
      
      // Clean Professional Background Options (No Text Overlays)
      backgroundImage: "/assets/images/medixscan-hero-clean-1600x900.png", // Clean professional background
      alternativeBackgrounds: {
        minimal: "/assets/images/medixscan-hero-minimal-1600x900.png",     // Minimal pattern option
        gradient: "/assets/images/medixscan-hero-gradient-1600x900.png",   // Pure gradient option
        original: "/assets/images/medixscan-hero-1600x900.png"            // Original with branding (avoid)
      },
      fallbackBackground: "/assets/images/bg-03.jpg",                      // Legacy fallback
      
      // Gradient Options (fallback/alternative)
      primaryGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      overlayGradient: "linear-gradient(135deg, rgba(102,126,234,0.85) 0%, rgba(118,75,162,0.85) 100%)",
      
      // Professional Design System
      textColor: "#ffffff",
      accentColor: "#1EBCB7",
      
      // Background Properties - Optimized for Clean Text Display
      backgroundProperties: {
        size: "cover",               // cover, contain, auto
        position: "center",          // center, top, bottom, left, right
        repeat: "no-repeat",         // no-repeat, repeat, repeat-x, repeat-y
        attachment: "fixed",         // fixed, scroll, local
        overlay: "rgba(0,0,0,0.1)",  // Minimal overlay since background is already optimized
        textArea: {
          overlay: "rgba(0,0,0,0.3)", // Darker overlay specifically behind text
          backdrop: "blur(2px)",       // Subtle blur effect for text readability
          padding: "2rem"              // Padding around text content
        }
      },
      
      // Animation Configuration
      particles: false,          // Reduced animation for professional look
      animation: "fadeIn",       // Simplified animation
      parallax: false,           // Professional static design
      
      // Responsive Behavior
      mobileBackground: "/assets/images/medixscan-hero-1600x900.png", // Same professional bg on mobile
      tabletBackground: "/assets/images/medixscan-hero-1600x900.png"  // Consistent across devices
    },
    videoUrl: "https://example.com/demo-video.mp4"
  },

  // Features Configuration
  features: {
    title: "Intelligent Radiology Solutions",
    subtitle: "Comprehensive AI-powered tools for modern healthcare",
    items: [
      {
        id: "ai-analysis",
        icon: "fas fa-brain",
        title: "AI-Powered Analysis",
        description: "Advanced machine learning algorithms analyze radiology reports with unprecedented accuracy and speed.",
        color: "#1EBCB7",
        features: ["99.7% Accuracy Rate", "Real-time Processing", "Multi-modal Analysis"]
      },
      {
        id: "multi-doctor",
        icon: "fas fa-user-md",
        title: "Multi-Doctor Platform",
        description: "Collaborative workspace designed for multiple healthcare professionals with role-based access control.",
        color: "#089bab", 
        features: ["Role Management", "Secure Collaboration", "Audit Trail"]
      },
      {
        id: "rag-enhancement",
        icon: "fas fa-database",
        title: "RAG Enhancement",
        description: "Retrieval-Augmented Generation technology for context-aware medical insights and recommendations.",
        color: "#0EA5E9",
        features: ["Context-Aware", "Medical Knowledge Base", "Smart Recommendations"]
      },
      {
        id: "workflow-automation",
        icon: "fas fa-cogs",
        title: "Workflow Automation",
        description: "Streamlined processes that reduce manual tasks and accelerate diagnostic workflows.",
        color: "#8B5CF6",
        features: ["Auto-routing", "Smart Scheduling", "Report Generation"]
      },
      {
        id: "quality-assurance",
        icon: "fas fa-shield-alt",
        title: "Quality Assurance",
        description: "Built-in quality checks and validation systems ensure consistent, reliable diagnostic output.",
        color: "#F59E0B",
        features: ["Error Detection", "Consistency Checks", "Compliance Monitoring"]
      },
      {
        id: "analytics-insights",
        icon: "fas fa-chart-line",
        title: "Analytics & Insights",
        description: "Comprehensive reporting and analytics to track performance and identify improvement opportunities.",
        color: "#EF4444",
        features: ["Performance Metrics", "Trend Analysis", "Custom Reports"]
      }
    ]
  },

  // Statistics Configuration
  statistics: {
    title: "Trusted by Healthcare Professionals Worldwide",
    items: [
      {
        number: "10,000+",
        label: "Reports Analyzed Daily",
        icon: "fas fa-file-medical"
      },
      {
        number: "500+",
        label: "Healthcare Facilities",
        icon: "fas fa-hospital"
      },
      {
        number: "99.7%",
        label: "Accuracy Rate",
        icon: "fas fa-bullseye"
      },
      {
        number: "2,000+",
        label: "Medical Professionals",
        icon: "fas fa-user-md"
      }
    ]
  },

  // Pricing Tiers
  pricing: {
    title: "Choose Your Plan",
    subtitle: "Flexible pricing for healthcare organizations of all sizes",
    plans: [
      {
        id: "starter",
        name: "Starter",
        price: "$99",
        period: "per month",
        description: "Perfect for small clinics and individual practitioners",
        features: [
          "Up to 100 reports/month",
          "Basic AI analysis",
          "Email support",
          "Standard security",
          "Basic reporting"
        ],
        buttonText: "Start Free Trial",
        popular: false,
        color: "#1EBCB7"
      },
      {
        id: "professional",
        name: "Professional", 
        price: "$299",
        period: "per month",
        description: "Ideal for medium-sized healthcare facilities",
        features: [
          "Up to 1,000 reports/month",
          "Advanced AI analysis",
          "Priority support", 
          "Enhanced security",
          "Advanced analytics",
          "Multi-doctor collaboration",
          "RAG enhancement"
        ],
        buttonText: "Get Started",
        popular: true,
        color: "#089bab"
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: "Custom",
        period: "pricing",
        description: "Comprehensive solution for large healthcare organizations",
        features: [
          "Unlimited reports",
          "Custom AI models",
          "24/7 dedicated support",
          "Enterprise security",
          "Custom integrations",
          "Advanced workflow automation",
          "White-label options"
        ],
        buttonText: "Contact Sales",
        popular: false,
        color: "#0EA5E9"
      }
    ]
  },

  // Advanced Radiology Showcase Slider - Enhanced Features
  radiologyShowcase: {
    title: "Advanced Radiology Solutions in Action",
    subtitle: "Experience the future of medical imaging with cutting-edge AI technology and revolutionary diagnostic capabilities",
    autoPlay: true,
    interval: 8000,
    pauseOnHover: true,
    showIndicators: true,
    showNavigation: true,
    animationType: "fade",
    items: [
      {
        id: 1,
        title: "AI-Powered Chest Analysis",
        subtitle: "Revolutionary Pulmonary Diagnostics Platform",
        description: "Our state-of-the-art deep learning algorithms analyze chest X-rays with superhuman precision, detecting pneumonia, nodules, tuberculosis, and complex pulmonary conditions in real-time with unmatched accuracy.",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=90",
        features: [
          "99.8% Diagnostic Accuracy",
          "Sub-second Analysis Speed",
          "Multi-pathology Detection",
          "FDA-Approved AI Algorithms",
          "DICOM Integration",
          "Real-time Reporting"
        ],
        technicalSpecs: {
          processingTime: "< 0.5 seconds",
          accuracy: "99.8%",
          pathologies: "15+ conditions",
          certification: "FDA Class II"
        },
        background: "linear-gradient(135deg, rgba(6, 182, 212, 0.95), rgba(59, 130, 246, 0.95))",
        overlayGradient: "linear-gradient(45deg, rgba(30, 188, 183, 0.15), rgba(6, 182, 212, 0.25))",
        accentColor: "#06B6D4",
        icon: "fas fa-lungs",
        iconAnimation: "pulse",
        particles: true,
        glowEffect: true,
        category: "Thoracic Imaging",
        status: "Active AI Processing"
      },
      {
        id: 2,
        title: "3D CT Reconstruction Suite",
        subtitle: "Next-Generation Volumetric Imaging Technology",
        description: "Advanced CT scan interpretation with multi-planar reconstruction, automated organ segmentation, contrast enhancement analysis, and precision anomaly detection across all anatomical systems with clinical decision support.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=90",
        features: [
          "Advanced 3D Volume Rendering",
          "Automated Organ Segmentation",
          "Multi-planar Reconstruction",
          "Vessel Analysis & Mapping",
          "Tumor Volume Quantification",
          "Interactive 3D Visualization"
        ],
        technicalSpecs: {
          processingTime: "< 2 minutes",
          accuracy: "97.5%",
          dimensions: "Sub-millimeter precision",
          formats: "DICOM, NIfTI, STL"
        },
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(219, 39, 119, 0.95))",
        overlayGradient: "linear-gradient(45deg, rgba(139, 92, 246, 0.15), rgba(219, 39, 119, 0.25))",
        accentColor: "#8B5CF6",
        icon: "fas fa-cube",
        iconAnimation: "rotate",
        particles: true,
        glowEffect: true,
        category: "CT Imaging",
        status: "3D Reconstruction Active"
      },
      {
        id: 3,
        title: "Neural MRI Intelligence Hub",
        subtitle: "Brain Imaging Redefined with AI Precision",
        description: "Sophisticated MRI analysis for neurological conditions with precision tissue characterization, advanced lesion mapping, white matter analysis, and automated volume quantification delivering superior diagnostic insights and treatment planning.",
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=90",
        features: [
          "Advanced Tissue Characterization",
          "Automated Lesion Detection",
          "White Matter Analysis",
          "Functional Connectivity Maps",
          "Volumetric Brain Analysis",
          "Neurological Biomarkers"
        ],
        technicalSpecs: {
          processingTime: "< 3 minutes",
          accuracy: "98.2%",
          resolution: "0.5mm isotropic",
          sequences: "T1, T2, FLAIR, DWI"
        },
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(239, 68, 68, 0.95))",
        overlayGradient: "linear-gradient(45deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.25))",
        accentColor: "#F59E0B",
        icon: "fas fa-brain",
        iconAnimation: "bounce",
        particles: true,
        glowEffect: true,
        category: "Neuroimaging",
        status: "Neural Analysis Running"
      },
      {
        id: 4,
        title: "Orthopedic AI Vision System",
        subtitle: "Precision Bone & Joint Analysis Platform",
        description: "Cutting-edge fracture detection and classification in X-rays with detailed anatomical mapping, severity assessment, bone density analysis, and intelligent treatment planning recommendations with surgical guidance support.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=90",
        features: [
          "Advanced Fracture Classification",
          "Automated Severity Grading",
          "Bone Density Assessment",
          "Joint Space Analysis",
          "Treatment Planning AI",
          "Surgical Planning Support"
        ],
        technicalSpecs: {
          processingTime: "< 1 minute",
          accuracy: "96.8%",
          classifications: "AO/OTA Standards",
          measurements: "Sub-pixel accuracy"
        },
        background: "linear-gradient(135deg, rgba(168, 85, 247, 0.95), rgba(236, 72, 153, 0.95))",
        overlayGradient: "linear-gradient(45deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.25))",
        accentColor: "#A855F7",
        icon: "fas fa-bone",
        iconAnimation: "swing",
        particles: true,
        glowEffect: true,
        category: "Orthopedic Imaging",
        status: "Bone Analysis Complete"
      },
      {
        id: 5,
        title: "Cardiac Imaging Intelligence",
        subtitle: "Advanced Cardiovascular Analysis Suite",
        description: "Comprehensive cardiac imaging analysis with automated chamber quantification, coronary artery assessment, perfusion analysis, and risk stratification for enhanced cardiovascular diagnostics and patient outcomes.",
        image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=90",
        features: [
          "Automated Chamber Quantification",
          "Coronary Artery Analysis",
          "Perfusion Assessment",
          "Ejection Fraction Calculation",
          "Risk Stratification AI",
          "Cardiac Motion Analysis"
        ],
        technicalSpecs: {
          processingTime: "< 90 seconds",
          accuracy: "97.1%",
          protocols: "Echo, CT, MRI",
          standards: "AHA Guidelines"
        },
        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(249, 115, 22, 0.95))",
        overlayGradient: "linear-gradient(45deg, rgba(239, 68, 68, 0.15), rgba(249, 115, 22, 0.25))",
        accentColor: "#EF4444",
        icon: "fas fa-heartbeat",
        iconAnimation: "pulse",
        particles: true,
        glowEffect: true,
        category: "Cardiac Imaging",
        status: "Cardiac Assessment Active"
      },
      {
        id: 6,
        title: "Oncology Detection Platform",
        subtitle: "AI-Powered Cancer Screening & Analysis",
        description: "Revolutionary cancer detection system with multi-modal imaging integration, tumor characterization, metastasis tracking, and treatment response monitoring for comprehensive oncological care and precision medicine.",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=90",
        features: [
          "Multi-modal Cancer Detection",
          "Tumor Characterization AI",
          "Metastasis Tracking",
          "Treatment Response Analysis",
          "Biomarker Assessment",
          "Precision Medicine Support"
        ],
        technicalSpecs: {
          processingTime: "< 4 minutes",
          accuracy: "98.5%",
          modalities: "CT, MRI, PET/CT",
          staging: "TNM Classification"
        },
        background: "linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(59, 130, 246, 0.95))",
        overlayGradient: "linear-gradient(45deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.25))",
        accentColor: "#22C55E",
        icon: "fas fa-search-plus",
        iconAnimation: "zoom",
        particles: true,
        glowEffect: true,
        category: "Oncology",
        status: "Oncology Scan Processing"
      }
    ]
  },

  // Testimonials Slider Configuration
  testimonials: {
    title: "What Healthcare Professionals Say",
    subtitle: "Trusted by leading medical professionals worldwide",
    autoPlay: true,
    interval: 5000,
    showIndicators: true,
    showNavigation: true,
    items: [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        title: "Chief Radiologist",
        organization: "Metropolitan Medical Center",
        image: "/assets/images/user/user-1.jpg",
        quote: "MediXscan AI has revolutionized our diagnostic workflow. The accuracy and speed of analysis have significantly improved our patient care quality. Our team can now process 40% more cases with higher confidence.",
        rating: 5,
        specialization: "Thoracic Imaging",
        years: "15+ years experience",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      },
      {
        id: 2, 
        name: "Dr. Michael Chen",
        title: "Director of Radiology",
        organization: "City General Hospital",
        image: "/assets/images/user/user-2.jpg", 
        quote: "The multi-doctor collaboration features and RAG enhancement have transformed how our team works together. The AI insights are incredibly accurate and save us hours of analysis time.",
        rating: 5,
        specialization: "Neuroimaging",
        years: "20+ years experience",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      },
      {
        id: 3,
        name: "Dr. Emily Rodriguez",
        title: "Senior Radiologist", 
        organization: "Advanced Imaging Clinic",
        image: "/assets/images/user/user-3.jpg",
        quote: "The AI-powered insights and quality assurance features have boosted our confidence in diagnoses. Our diagnostic accuracy has improved by 23% since implementation.",
        rating: 5,
        specialization: "Musculoskeletal Imaging",
        years: "12+ years experience",
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
      },
      {
        id: 4,
        name: "Dr. Robert Kim",
        title: "Lead Radiologist",
        organization: "Regional Medical Center",
        image: "/assets/images/user/user-4.jpg",
        quote: "The seamless integration with our existing systems and intuitive interface made adoption effortless. The AI catches subtle details we might have missed, enhancing our diagnostic confidence.",
        rating: 5,
        specialization: "Abdominal Imaging",
        years: "18+ years experience",
        background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
      },
      {
        id: 5,
        name: "Dr. Amanda Foster",
        title: "Chief of Imaging",
        organization: "University Medical Center",
        image: "/assets/images/user/user-5.jpg",
        quote: "MediXscan AI has become an indispensable tool in our radiology department. The speed and precision of the AI analysis allows us to provide faster, more accurate diagnoses to our patients.",
        rating: 5,
        specialization: "Cardiac Imaging",
        years: "22+ years experience",
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
      },
      {
        id: 6,
        name: "Dr. James Patterson",
        title: "Interventional Radiologist",
        organization: "Specialty Imaging Associates",
        image: "/assets/images/user/user-6.jpg",
        quote: "The real-time AI assistance during procedures has significantly improved our workflow efficiency. The system's ability to provide instant feedback is remarkable and has reduced our procedure times by 15%.",
        rating: 5,
        specialization: "Interventional Radiology",
        years: "14+ years experience",
        background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
      }
    ]
  },

  // Contact Information
  contact: {
    title: "Get Started Today",
    subtitle: "Ready to transform your radiology practice?",
    phone: "+1 (555) 123-4567",
    email: "contact@medixscan.ai",
    address: "123 Medical Plaza, Healthcare District, HC 12345",
    socialMedia: {
      linkedin: "https://linkedin.com/company/medixscan",
      twitter: "https://twitter.com/medixscan",
      facebook: "https://facebook.com/medixscan"
    }
  },

  // Compliance & Trust Section
  compliance: {
    title: "Enterprise-Grade Security & Compliance",
    subtitle: "Your data security and privacy are our top priorities",
    description: "MediXscan AI adheres to the highest standards of healthcare data protection and privacy regulations, ensuring your patient data remains secure and compliant.",
    certifications: [
      {
        id: "hipaa",
        name: "HIPAA Compliant",
        description: "Health Insurance Portability and Accountability Act",
        icon: "fas fa-shield-alt",
        color: "#0066cc",
        features: [
          "End-to-end PHI encryption",
          "Role-based access controls", 
          "Comprehensive audit trails",
          "BAA agreements available"
        ]
      },
      {
        id: "gdpr", 
        name: "GDPR Compliant",
        description: "General Data Protection Regulation",
        icon: "fas fa-user-shield",
        color: "#0066cc",
        features: [
          "Explicit consent management",
          "Right to be forgotten",
          "Data portability rights",
          "Privacy by design"
        ]
      },
      {
        id: "soc2",
        name: "SOC 2 Type II",
        description: "Service Organization Control 2",
        icon: "fas fa-certificate",
        color: "#0066cc",
        features: [
          "Security controls verified",
          "Availability monitoring",
          "Processing integrity",
          "Confidentiality assured"
        ]
      },
      {
        id: "iso27001",
        name: "ISO 27001",
        description: "Information Security Management",
        icon: "fas fa-award",
        color: "#0066cc",
        features: [
          "Risk management framework",
          "Security incident response",
          "Continuous monitoring",
          "Regular security audits"
        ]
      }
    ],
    trustFeatures: [
      {
        title: "Zero Trust Architecture",
        description: "Every access request is verified and authenticated",
        icon: "fas fa-lock"
      },
      {
        title: "End-to-End Encryption",
        description: "AES-256 encryption for data at rest and TLS 1.3 in transit",
        icon: "fas fa-key"
      },
      {
        title: "Regular Security Audits",
        description: "Quarterly penetration testing and daily vulnerability scans",
        icon: "fas fa-search"
      },
      {
        title: "24/7 Security Monitoring",
        description: "Real-time threat detection and incident response",
        icon: "fas fa-eye"
      }
    ]
  },

  // Theme Configuration
  theme: {
    primaryColor: "#1EBCB7",
    secondaryColor: "#089bab", 
    accentColor: "#0EA5E9",
    darkColor: "#1a1a1a",
    lightColor: "#ffffff",
    gradient: "linear-gradient(135deg, #1EBCB7 0%, #089bab 100%)",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
  }
};

export default landingPageConfig;
