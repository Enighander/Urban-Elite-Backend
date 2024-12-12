const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access Denied. No Token or Invalid Token Format.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token. User does not exist.",
      });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Token verification failed.",
      error: error.message,
    });
  }
};

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
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

module.exports = {
  generateToken,
  generateRefreshToken,
  generateRandomPassword,
  authenticate,
};
