const checkAdminRole = (req, res, next) => {
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "access denied. Only Admin can perform this action",
    });
  }
  next();
};

module.exports = checkAdminRole;
