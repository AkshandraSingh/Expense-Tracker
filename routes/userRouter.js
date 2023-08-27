const express = require('express')

const user = require('../controllers/userController')

const router = express.Router()

router.post('/createAccount', user.createUser)
router.post('/userLogin', user.userLogin)
router.post('/forgetPassword', user.forgetPassword)
router.patch('/resetPassword/:userId/:token', user.resetPassword)
router.patch('/setNewPassword/:userId', user.setNewPassword)

module.exports = router
