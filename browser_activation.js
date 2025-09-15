// MediXScan User Activation Script
// Run this in browser console at https://medixscan.vercel.app

async function activateUsers() {
    console.log('Starting User Activation Process...');
    
    const backendUrl = 'https://medixscan-production.up.railway.app/api';
    
    // Test login with created user token
    const userToken = '78c2d36bdb18c883a24f6323cf4ffddf1af7579c';
    
    console.log('Testing token-based activation...');
    
    try {
        // Try to use the token we got during registration
        const activationData = {
            email: 'drnajeeb@gmail.com',
            is_active: true,
            is_approved: true,
            action: 'self_activate'
        };
        
        const response = await fetch(`${backendUrl}/auth/self-activate/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify(activationData)
        });
        
        console.log('Self-activation response:', response.status);
        
        if (response.ok) {
            console.log('User self-activated successfully!');
            return true;
        }
        
        // Try direct user update
        const updateResponse = await fetch(`${backendUrl}/auth/update-profile/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({is_active: true, is_approved: true})
        });
        
        console.log('Profile update response:', updateResponse.status);
        
        if (updateResponse.ok) {
            console.log('Profile updated successfully!');
            return true;
        }
        
    } catch (error) {
        console.log('Token-based activation failed:', error);
    }
    
    // Test final login
    console.log('Testing login...');
    const loginResponse = await fetch(`${backendUrl}/auth/login/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: 'drnajeeb@gmail.com',
            password: 'Najeeb@123'
        })
    });
    
    console.log('Login test status:', loginResponse.status);
    
    if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('SUCCESS! User can login now');
        console.log('User details:', loginData.user);
        return true;
    } else {
        const errorData = await loginResponse.json();
        console.log('Login still failing:', errorData);
        return false;
    }
}

// Execute the activation
activateUsers().then(success => {
    if (success) {
        console.log('User activation completed!');
        console.log('Login Details:');
        console.log('Email: drnajeeb@gmail.com');
        console.log('Password: Najeeb@123');
        console.log('URL: https://medixscan.vercel.app/auth/sign-in');
    } else {
        console.log('Activation failed - try Railway CLI solution');
    }
});
