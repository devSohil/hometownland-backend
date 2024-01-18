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
        .json({ error: "Please enter a valid mobile number" });
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
      // new registration

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

        const user = await User.findById(newUser._id, "-password");
        return res.status(200).json({ user, accessToken });
      } else {
        return res
          .status(500)
          .json({ error: "Internal Server Error during registration" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.profileUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id, "-password ");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};
