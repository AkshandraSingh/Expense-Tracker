const express = require('express')

const expense = require('../controllers/expenseController')

const router = express.Router()

router.post('/createExpense/:userId', expense.createExpense)

module.exports = router
