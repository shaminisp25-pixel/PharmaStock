const jwt = require('jsonwebtoken');

const token = process.argv[2];
const secret = process.env.JWT_ACCESS_SECRET;

if (!token) {
  console.error('Usage: node validate-token.js <token>');
  process.exit(2);
}

if (!secret) {
  console.error('JWT_ACCESS_SECRET not set in environment');
  process.exit(3);
}

try {
  const decoded = jwt.verify(token, secret);
  console.log('Token valid. Decoded payload:');
  console.log(JSON.stringify(decoded, null, 2));
  process.exit(0);
} catch (err) {
  console.error('Token verification failed:');
  console.error(err.message);
  try {
    const decoded = jwt.decode(token);
    console.log('Decoded without verification:');
    console.log(JSON.stringify(decoded, null, 2));
  } catch (e) {}
  process.exit(1);
}