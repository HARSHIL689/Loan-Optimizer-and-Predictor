const authService = require("../services/authService");

async function signup(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await authService.signup({ email, password });

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      message: error.message || "Internal server error",
    });
  }
}

async function signin(req, res) {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }
  
      const result = await authService.signin({ email, password });
  
      return res.status(200).json({
        message: "Signin successful",
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({
        message: error.message || "Internal server error",
      });
    }
}
  

module.exports = {
  signup,
  signin
};
