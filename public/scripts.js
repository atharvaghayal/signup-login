document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const response = await fetch('/save-signup-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    
    const result = await response.json();
    alert(result.message);
    if (result.success) window.location.href = 'login.html';
});

document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const response = await fetch('/save-login-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    
    const result = await response.json();
    if (result.success) {
        window.location.href = result.redirect;
    } else {
        alert(result.message);
    }
});