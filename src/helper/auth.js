const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const verifyOps = {
    expiresIn: "1 hour",
    issuer: "UrbanElite",
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOps);
  return token;
};

const generateRefreshToken = (payload) => {
  const verifyOps = { expiresIn: "21 days" };
  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOps);
  return token;
};

const generateRandomPassword = () => {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++ ) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}


module.exports = {
  generateToken,
  generateRefreshToken,
  generateRandomPassword
};
