const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tokens = require("../models/Token");
const { sendMail } = require("./sendMail");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin, // Corrected key name
    },
    process.env.JWT_SEC,
    { expiresIn: "2h" }
  );
};

// REFRESH TOKEN
router.post("/token", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(401).json("Token is required");
    const token = await Tokens.findOne({ token: refreshToken });
    if (!token) return res.status(403).json("Invalid refresh token");

    jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, user) => {
      if (err) return res.status(403).json("Token verification failed");
      const accessToken = generateAccessToken(user);
      res.status(200).json({ accessToken });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json("All fields are required!");
    }
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) return res.status(400).json("User already exists!");

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPass });
    const user = await newUser.save();
    const { password: _, ...others } = user._doc;
    res.status(200).json(others);
    sendMail({email: user.email, name: user.username})
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username && !email) {
      return res.status(400).json("Username or email is required!");
    }
    if (!password) {
      return res.status(400).json("Password is required!");
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!user) return res.status(400).json("Wrong credentials!");

    const validated = await bcrypt.compare(password, user.password);
    if (!validated) return res.status(400).json("Wrong username or password!");

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_REFRESH
    );

    const token = new Tokens({ token: refreshToken });
    await token.save();

    const { password: _, ...others } = user._doc;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: true, // Uncomment in production with HTTPS
      // maxAge: 720000,
    });
    res.cookie("user", others, {
      httpOnly: true,
      // secure: true,
      // maxAge: 720000,
    });
 
    res.status(200).json({ ...others, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGOUT
router.delete("/logout", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json("Token is required");
    }
    await Tokens.findOneAndDelete({ token });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;