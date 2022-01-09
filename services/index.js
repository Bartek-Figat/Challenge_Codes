const { validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");
const { UserRepository } = require("../repositories/index");
const { hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCode }= require("../utils/index");
const saltRounds = 10;

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const hashPassword = await hash(password, saltRounds);
    const user = {
      email,
      hashPassword,
    };
    await UserRepository.insertOne(user);
    return res.status(StatusCode.SUCCESS);
  } catch (err) {
    return res.status(StatusCode.INTERNAL_SERVER_ERROR);
  }
};

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await UserRepository.findOne({ email });
    const match = await compare(password, user.hashPassword);
   
    if (!match) res.status(StatusCode.NOT_FOUND);
    const accessToken = jwt.sign({ accessToken: user._id }, `secret`);
    return res.json({ accessToken })
  } catch (err) {
    return res.status(StatusCode.INTERNAL_SERVER_ERROR);
  }
};

const userResources = async (req, res, next) => {
  try{
    const id = req.user.accessToken;
    const query = { _id: ObjectId(id) }
    const options = { projection: { hashPassword: 0 } };
    const user = await UserRepository.findOne(query, options);
    res.json({ user });
  }catch(err) {
    return res.status(StatusCode.INTERNAL_SERVER_ERROR);
  }
}


module.exports = { loginUser, registerUser, userResources };
