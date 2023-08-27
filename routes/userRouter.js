const express = require('express')

const user = require('../controllers/userController')
const imageStorage = require('../middleware/userImageStorage')
const userValidations = require('../validations/users/userValidator')

const router = express.Router()

router.post('/createAccount', userValidations.createUserValidation, user.createUser)
router.post('/userLogin', userValidations.userLoginValidation, user.userLogin)
router.post('/forgetPassword', user.forgetPassword)
router.patch('/resetPassword/:userId/:token', userValidations.resetPasswordValidation, user.resetPassword)
router.patch('/setNewPassword/:userId', userValidations.setNewPasswordValidation, user.setNewPassword)
router.post('/changeProfilePic/:userId', imageStorage.upload.single('userProfilePic'), user.changeProfilePic)

module.exports = router
