import axios from 'axios';

const API_BASE_URL = ''; // Empty for relative paths that will work with Nginx proxy

export const sendMessage = async (message) => {
    // For now, return static responses since we don't have a chatbot endpoint
    return {
        message: "Please use the Report Correction section to analyze and improve your medical reports. I'm here to guide you through the process!"
    };
};

export const getInitialInfo = () => {
    return {
        welcomeMessage: "👋 Hi! I'm your RadiologyAI Assistant. To get started with report correction:",
        features: [
            {
                id: 1,
                title: "Input Medical Report",
                description: "First, please input your medical report in the Report Correction section."
            },
            {
                id: 2,
                title: "AI Analysis",
                description: "I will analyze your report and generate an improved version with corrections and enhancements."
            },
            {
                id: 3,
                title: "Get Results",
                description: "You'll receive an AI-generated improved version of your medical report."
            }
        ]
    };
};
