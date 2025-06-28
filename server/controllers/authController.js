const User = require("../models/User");
const bcrypt = require("bcryptjs");
const transporter = require("../config/nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
exports.sendOtp = async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).send("Email is required");
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpire = Date.now() + 5 * 60 * 1000; // 5 mins expiry

  try {
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).send("User already verified and registered");
    }

    if (!user) {
      user = new User({ email, otp, otpExpire });
    } else {
      user.otp = otp;
      user.otpExpire = otpExpire;
    }

    await user.save();

    await transporter.sendMail({
      from: `"Firoj's Admission Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP for Registration",
      text: `Dear ${name} Your OTP is: ${otp}`,
    });

    res.status(200).send(`OTP sent to your email ${email}`);
  } catch (err) {
    res.status(500).send("Failed to send OTP: " + err.message);
  }
};

exports.homePage = (req, res) => {
  res.send("Home Page");
};
exports.registerPage = (req, res) => {
  res.send("Register Page");
};

exports.addUser = async (req, res) => {
  const { name, email, password, otp } = req.body;
  // Validate input
  if (!name || !email || !password || !otp) {
    return res.status(400).send("Please fill all fields");
  }
  // Check if user already exists
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser.otp !== otp || Date.now() > existingUser.otpExpire) {
      return res.status(400).send("Invalid or expired OTP");
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user instance
    existingUser.name = name;
    existingUser.password = hashedPassword;
    existingUser.isVerified = true;
    existingUser.otp = undefined;
    existingUser.otpExpire = undefined;

    // Save the new user to the database
    await existingUser.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(500).send("Error registering user: " + err.message);
  }
};

exports.loginPage = (req, res) => {
  res.send("loginPage Page");
};
exports.authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Incorrect password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.send({ token });
};
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store user info in req
    next();
  } catch (err) {
    res.status(403).send("Invalid or expired token.");
  }
};
exports.applicationPage = async (req, res) => {
  // Now req.user contains { id: userId }
  const user = await User.findById(req.user.id).select("-password");
  res.send(user); // only accessible if token is valid
};
