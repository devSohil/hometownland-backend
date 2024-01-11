const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.userLogin = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ error: "Invalid input" });
    }
    if (phoneNumber.length !== 10) {
      return res
        .status(400)
        .json({ error: "Please enter valid mobile number" });
    }

    const foundUser = await User.findOne({ phoneNumber }).exec();

    if (foundUser) {
      const match = await bcrypt.compareSync(password, foundUser.password);

      if (match) {
        const accessToken = jwt.sign(
          { id: foundUser._id, phoneNumber: foundUser.phoneNumber },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        const user = await User.findById(foundUser._id, "-password");
        return res.status(200).json({ user, accessToken });
      } else {
        return res
          .status(401)
          .json({ error: "Wrong phone number or password" });
      }
    } else {
      // new register

      const hashedPass = await bcrypt.hashSync(password);
      const newUser = await User.create({
        phoneNumber,
        password: hashedPass,
      });
      if (newUser) {
        const accessToken = jwt.sign(
          { id: newUser._id, phoneNumber: newUser.phoneNumber },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        const user = await User.findById(
          foundUser._id,
          "-password  -refreshToken"
        );
        return res.status(200).json({ user, accessToken });
      }
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
