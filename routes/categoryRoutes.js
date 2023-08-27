const express = require('express')

const category = require('../controllers/categoryController')
const categoryValidations = require('../validations/category/categoryValidatorSchema')
const { userAuthentication } = require('../middleware/authToken')

const router = express.Router()

router.post('/createCategory/:userId', userAuthentication, categoryValidations.createCategory, category.createCategory)

module.exports = router
