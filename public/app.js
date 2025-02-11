async function checkApiKey() {
    const apiKey = document.getElementById('api-key').value;
    
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ api_key: apiKey })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('api_key', apiKey);
            window.location.href = '/dashboard.html';
        } else {
            alert('Invalid API key');
        }
    } catch (error) {
        alert('Error checking API key');
    }
}

function logout() {
    localStorage.removeItem('api_key');
    window.location.href = '/';
}
