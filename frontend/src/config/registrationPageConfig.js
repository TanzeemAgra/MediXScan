// Registration Page Configuration - Soft Coded for Easy Customization
const registrationPageConfig = {
  // Page Meta Information
  page: {
    title: "Join MediXscan AI - Professional Registration",
    description: "Create your professional account to access advanced AI-powered radiology analysis tools.",
    keywords: "medical registration, radiology platform, AI healthcare, doctor signup"
  },

  // Brand Configuration
  brand: {
    name: "MediXscan AI",
    tagline: "Advanced Radiology Intelligence",
    logo: "/assets/images/logo-full2.png",
    logoWhite: "/assets/images/logo-white.png"
  },

  // Registration Form Configuration
  form: {
    title: "Create Your Professional Account",
    subtitle: "Join thousands of healthcare professionals using AI-powered radiology analysis",
    
    // Form Steps Configuration
    steps: [
      {
        id: 1,
        title: "Personal Information",
        description: "Basic personal details",
        icon: "fas fa-user"
      },
      {
        id: 2,
        title: "Professional Details",
        description: "Medical credentials and specialization",
        icon: "fas fa-user-md"
      },
      {
        id: 3,
        title: "Institution Information",
        description: "Hospital or clinic details",
        icon: "fas fa-hospital"
      },
      {
        id: 4,
        title: "Account Setup",
        description: "Security and preferences",
        icon: "fas fa-shield-alt"
      }
    ],

    // Form Fields Configuration
    fields: {
      step1: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          placeholder: "Enter your first name",
          required: true,
          validation: "required|min:2"
        },
        {
          name: "lastName", 
          label: "Last Name",
          type: "text",
          placeholder: "Enter your last name",
          required: true,
          validation: "required|min:2"
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          placeholder: "professional@hospital.com",
          required: true,
          validation: "required|email"
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          placeholder: "+1 (555) 123-4567",
          required: true,
          validation: "required|phone"
        }
      ],
      step2: [
        {
          name: "title",
          label: "Professional Title",
          type: "select",
          placeholder: "Select your title",
          required: true,
          options: [
            { value: "dr", label: "Doctor (MD)" },
            { value: "radiologist", label: "Radiologist" },
            { value: "resident", label: "Resident" },
            { value: "technician", label: "Radiologic Technician" },
            { value: "nurse", label: "Nurse Practitioner" },
            { value: "other", label: "Other Healthcare Professional" }
          ]
        },
        {
          name: "specialization",
          label: "Medical Specialization",
          type: "select",
          placeholder: "Select your specialization",
          required: true,
          options: [
            { value: "diagnostic_radiology", label: "Diagnostic Radiology" },
            { value: "interventional_radiology", label: "Interventional Radiology" },
            { value: "nuclear_medicine", label: "Nuclear Medicine" },
            { value: "radiation_oncology", label: "Radiation Oncology" },
            { value: "emergency_medicine", label: "Emergency Medicine" },
            { value: "internal_medicine", label: "Internal Medicine" },
            { value: "orthopedics", label: "Orthopedics" },
            { value: "cardiology", label: "Cardiology" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "licenseNumber",
          label: "Medical License Number",
          type: "text",
          placeholder: "Enter your license number",
          required: true,
          validation: "required|alphanumeric"
        },
        {
          name: "yearsExperience",
          label: "Years of Experience",
          type: "select",
          placeholder: "Select experience level",
          required: true,
          options: [
            { value: "0-2", label: "0-2 years" },
            { value: "3-5", label: "3-5 years" },
            { value: "6-10", label: "6-10 years" },
            { value: "11-15", label: "11-15 years" },
            { value: "16-20", label: "16-20 years" },
            { value: "20+", label: "20+ years" }
          ]
        }
      ],
      step3: [
        {
          name: "institutionName",
          label: "Institution Name",
          type: "text",
          placeholder: "Hospital or Clinic Name",
          required: true,
          validation: "required|min:3"
        },
        {
          name: "institutionType",
          label: "Institution Type",
          type: "select",
          placeholder: "Select institution type",
          required: true,
          options: [
            { value: "hospital", label: "Hospital" },
            { value: "clinic", label: "Clinic" },
            { value: "imaging_center", label: "Imaging Center" },
            { value: "academic", label: "Academic Institution" },
            { value: "private_practice", label: "Private Practice" },
            { value: "research", label: "Research Institution" }
          ]
        },
        {
          name: "department",
          label: "Department",
          type: "text",
          placeholder: "e.g., Radiology Department",
          required: false
        },
        {
          name: "address",
          label: "Institution Address",
          type: "textarea",
          placeholder: "Complete address",
          required: true,
          validation: "required|min:10"
        }
      ],
      step4: [
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Create a strong password",
          required: true,
          validation: "required|min:8|password"
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          placeholder: "Confirm your password",
          required: true,
          validation: "required|same:password"
        },
        {
          name: "terms",
          label: "I agree to the Terms of Service and Privacy Policy",
          type: "checkbox",
          required: true,
          validation: "accepted"
        },
        {
          name: "newsletter",
          label: "Receive updates about new features and medical AI research",
          type: "checkbox",
          required: false
        }
      ]
    }
  },

  // Design Configuration
  design: {
    layout: "split", // split, centered, full
    theme: {
      primaryColor: "#1EBCB7",
      secondaryColor: "#667eea",
      backgroundColor: "#f8f9fa",
      cardBackground: "#ffffff",
      textColor: "#2d3748",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
    },
    leftPanel: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      showBranding: true,
      showFeatures: true,
      features: [
        {
          icon: "fas fa-brain",
          title: "AI-Powered Analysis",
          description: "Advanced machine learning algorithms for precise diagnostics"
        },
        {
          icon: "fas fa-shield-alt",
          title: "HIPAA Compliant",
          description: "Enterprise-grade security for patient data protection"
        },
        {
          icon: "fas fa-users",
          title: "Collaborative Platform",
          description: "Seamless integration with your medical team"
        },
        {
          icon: "fas fa-chart-line",
          title: "Performance Analytics",
          description: "Detailed insights to improve diagnostic accuracy"
        }
      ]
    },
    animations: {
      enabled: true,
      type: "minimal", // minimal, enhanced, none
      duration: "0.3s"
    }
  },

  // Navigation Configuration
  navigation: {
    showBackToHome: true,
    homeUrl: "/",
    showLoginLink: true,
    loginUrl: "/auth/sign-in"
  },

  // Success Configuration
  success: {
    title: "Welcome to MediXscan AI!",
    message: "Your account has been created successfully. Please check your email for verification instructions.",
    redirectUrl: "/auth/sign-in",
    redirectDelay: 3000
  },

  // Validation Messages
  validation: {
    required: "This field is required",
    email: "Please enter a valid email address",
    phone: "Please enter a valid phone number",
    password: "Password must be at least 8 characters with uppercase, lowercase, and numbers",
    same: "Passwords do not match",
    accepted: "You must accept the terms and conditions"
  }
};

export default registrationPageConfig;
