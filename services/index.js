const { validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const { UserRepository } = require('../repositories/index');
const { hash, compare } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCode } = require('../utils/index');
const saltRounds = 10;

const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(StatusCode.BAD_REQUEST)
                .json({ errors: errors.array() })
        }
        const { email, password } = req.body;
        const emailValid = await UserRepository.findOne({ email });
        if (emailValid)
            return res
                .status(StatusCode.BAD_REQUEST)
                .json({ status: `${StatusCode.BAD_REQUEST}` });

        const isValidPassword = await hash(password, saltRounds);
        const user = {
            email,
            isValidPassword,
        };
        await UserRepository.insertOne(user);
        return res
            .status(StatusCode.SUCCESS)
            .json({ status: `${StatusCode.SUCCESS}` });
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` });
    }
};

const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res
                .status(StatusCode.BAD_REQUEST)
                .json({ errors: errors.array() })
        }
        const { email, password } = req.body;
        const user = await UserRepository.findOne({ email });
        const match = user && (await compare(password, user.isValidPassword));

        if (!match) return res.status(StatusCode.NOT_FOUND).json({ status: `${StatusCode.NOT_FOUND}` });
        const generateAccessToken = jwt.sign(
            { generateAccessToken: user._id },
            `secret`
        );
        return res.json({ generateAccessToken });
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` });
    }
};

const userResources = async (req, res) => {
    try {
        const id = req.user.generateAccessToken;
        const query = { _id: ObjectId(id) };
        const options = { projection: { isValidPassword: 0 } };
        const user = await UserRepository.findOne(query, options);
        return res.json({ user });
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` });
    }
};


const saveChanges = async (req, res) => {
    try {
        const { email } = req.body;
        const id = req.user.generateAccessToken;
        const filter = { _id: ObjectId(id) };
        const update = { $set: email };
        const user = await UserRepository.updateOne(filter, update);
        return res.json({ user });
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` });
    }
};

const deleteToken = async (req, res) => {
    try {
        return res
            .status(StatusCode.SUCCESS)
            .json({ status: `${StatusCode.SUCCESS}` });
    } catch (err) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ status: `${StatusCode.INTERNAL_SERVER_ERROR}` });
    }
};



module.exports = { loginUser, registerUser, userResources, deleteToken, saveChanges };
