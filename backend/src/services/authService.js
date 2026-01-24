const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  findUserByEmail,
  createUser,
} = require("../repositories/userRepository");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwt");

const SALT_ROUNDS = 12;

async function signup({ email, password }) {

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await createUser({
    email,
    passwordHash,
  });

  return user;
}

async function signin({ email, password }) {
    const user = await findUserByEmail(email);
  
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }
  
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }
  
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
}
  
module.exports = {
    signup,
    signin,
};
