const jwt = require('jsonwebtoken');

// Middleware voor authenticatie van gebruikers
const checkAuthentication = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Haal het token uit de Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Access denied, token required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verifieer het token
    req.user = decoded;  
    next();  
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};


// Middleware voor admin controle
const checkAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Haal het token uit de Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Access denied, token required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verifieer het token
    if (!decoded.isAdmin) {  // Controleer of de gebruiker een admin is
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = decoded;  
    next();  
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = { checkAuthentication, checkAdmin };
