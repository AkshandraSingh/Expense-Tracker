const express = require('express')

const expense = require('../controllers/expenseController')

const router = express.Router()

router.post('/createExpense/:userId', expense.createExpense)
router.patch('/editExpense/:expenseId', expense.editExpense)
router.delete('/deleteExpense/:expenseId', expense.deleteExpense)

module.exports = router
