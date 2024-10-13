const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// user registration

const userRegister = async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username && email && password)) {
    res.status(400).json({
      message: "Please fill all field",
    });
  }

  const isExist = await User.findOne({ email });

  if (isExist) {
    return res.status(401).json({
      message: "User already exist ",
    });
  }

  //password hash
  const hashPassword = await bcrypt.hash(String(password), 10);

  // save user
  const user = await User.create({
    username,
    email,
    password: hashPassword,
  });

  // generate token

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({
    success: true,
    message: "Account created successfully",
    token,
    userData: user,
  });
};

// user login

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.status(400).json({
      message: "Please fill all field",
    });
  }

  const userData = await User.findOne({
    email,
  });
  if (!userData) {
    res.status(404).json({
      message: "User not found",
    });

    const passwordMatch = await bcrypt.compare(
      String(password),
      userData.password
    );
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
  }
  const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    userData,
    token,
    message: "Login successfull",
  });
};

// user logout
const logout = async (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};


module.exports = { userRegister, userLogin, logout,  };
