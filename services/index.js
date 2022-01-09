const { validationResult } = require("express-validator");
const { UserRepository } = require("../repositories/index");
const { hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const hashPassword = await hash(password, saltRounds);
    const user = {
      email,
      hashPassword,
    };
    await UserRepository.insertOne(user);
    return res.json(200);
  } catch (err) {
    return res.json(500);
  }
};

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await UserRepository.findOne({ email });
    const match = await compare(password, user.hashPassword);
   
    if (!match) res.json(404);
    const accessToken = jwt.sign({ accessToken: user._id }, `secret`);
    return res.json({accessToken})
  } catch (err) {
    console.log(err);
  }
};



module.exports = { loginUser, registerUser };
