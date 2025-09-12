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

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setSetting());
    
    // Initialize deployment optimizations (suppress SASS warnings)
    deploymentWarningHandler.initializeDeploymentOptimizations();
  }, [dispatch]);
  
  return null;
}

export default App;
