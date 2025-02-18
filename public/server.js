// Add these routes
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

app.get('/help/weblink', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/help/weblink.html'));
});
