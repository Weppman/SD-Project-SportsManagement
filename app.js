const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));


// Simple route for the home page
app.get('/', (req, res) => {
  // Serve the index.html from the 'public/mainUI' directory
  res.sendFile(path.join(__dirname, 'public', 'mainUI', 'index.html'));
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});