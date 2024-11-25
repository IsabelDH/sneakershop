const { server } = require('./app'); // Importeer de server in plaats van app

const PORT = process.env.PORT || 5000;

// Start de server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
