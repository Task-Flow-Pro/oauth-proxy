const express = require('express');
const app = express();

// Health check endpoint
app.get('/api', (req, res) => {
  res.send('OAuth Proxy Server is running');
});

// Google OAuth callback handler
app.get('/api/auth/google/callback', (req, res) => {
  const code = req.query.code;
  const error = req.query.error;
  const state = req.query.state; // This contains your Codespace URL

  // If there's an error from Google
  if (error) {
    return res.status(400).send(`OAuth Error: ${error}`);
  }

  // If no state parameter (shouldn't happen)
  if (!state) {
    return res.status(400).send('Missing state parameter');
  }

  // Decode the state parameter to get your Codespace URL
  const targetUrl = decodeURIComponent(state);

  // Redirect back to your Codespace with the authorization code
  const redirectUrl = `${targetUrl}?code=${code}`;
  res.redirect(redirectUrl);
});

// Only needed for local testing
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
  });
}

module.exports = app;
