import { check } from 'express-validator';

export const registerValidation = [
  check('email').isEmail().withMessage('Input field must not be empty'),
  check('password').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
];

export const loginValidation = [
  check('email').isEmail().withMessage('Input field must not be empty'),
  check('password').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
];
