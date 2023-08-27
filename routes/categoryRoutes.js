const express = require('express')

const category = require('../controllers/categoryController')
const categoryValidations = require('../validations/category/categoryValidatorSchema')

const router = express.Router()

router.post('/createCategory/:userId', categoryValidations.createCategory, category.createCategory)

module.exports = router
