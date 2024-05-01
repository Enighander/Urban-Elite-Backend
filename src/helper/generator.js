const crypto = require('crypto');

// Generate a 32-byte (256-bit) secret key
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Example usage
const secretKey = generateSecretKey();
console.log('Generated Secret Key:', secretKey);