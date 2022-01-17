import { Router } from 'express';
import { UserService } from '../services/index';
import { isAuthenticated } from '../middleware/index';
import { loginValidation, registerValidation } from '../validation/index';
const router = Router({
  caseSensitive: true,
  strict: true,
});

const getUser = new UserService().getUser;
const login = new UserService().login;
const createUser = new UserService().createUser;
const updateUser = new UserService().updateUser;
const removeToken = new UserService().removeToken;

router.get('/api/v1/user', isAuthenticated, getUser);

router.post('/api/v1/registration', registerValidation, createUser);

router.post('/api/v1/login', loginValidation, login);

router.put('/api/v1/update', isAuthenticated, updateUser);

router.delete('/api/v1/logout', isAuthenticated, removeToken);

export default router;
