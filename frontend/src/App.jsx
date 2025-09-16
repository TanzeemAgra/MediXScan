import React, { useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Redux Selector / Action
import { useDispatch } from "react-redux";

// import state selectors
import {
  setSetting
} from "./store/setting/actions";

// Import deployment configuration utilities
import { deploymentWarningHandler } from "./utils/deploymentConfigUtils";

// Import responsive utilities
import { injectResponsiveVariables } from "./utils/responsiveUtils";

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setSetting());
    
    // Initialize deployment optimizations (suppress SASS warnings)
    deploymentWarningHandler.initializeDeploymentOptimizations();
    
    // Initialize responsive variables
    injectResponsiveVariables();
    
    // Re-inject on window resize
    const handleResize = () => {
      injectResponsiveVariables();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);
  
  return null;
}

export default App;
