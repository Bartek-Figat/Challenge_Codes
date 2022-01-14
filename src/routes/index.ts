import { Router } from 'express'
import {
    loginUser,
    registerUser,
    userResources,
    saveChanges,
    deleteToken,
} from '../services/index'
import { isAuthenticated } from '../middleware/index'
import { loginValidation, registerValidation } from '../validation/index'
const router = Router({
    caseSensitive: true,
    strict: true,
});

router.get('/api/v1/user', isAuthenticated, userResources)

router.post('/api/v1/registration', registerValidation, registerUser)

router.post('/api/v1/login', loginValidation, loginUser)

router.put('/api/v1/update', isAuthenticated, saveChanges)

router.delete('/api/v1/logout', isAuthenticated, deleteToken)

export default router
