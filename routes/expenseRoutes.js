const express = require('express')

const expense = require('../controllers/expenseController')
const expenseValidation = require('../validations/expense/expenseValidator')

const router = express.Router()

router.post('/createExpense/:userId', expenseValidation.createExpense, expense.createExpense)
router.patch('/editExpense/:expenseId', expense.editExpense)
router.delete('/deleteExpense/:expenseId', expense.deleteExpense)
router.get('/searchByName/:userId', expense.searchByName)
router.get('/searchByCategory/:userId', expense.searchByCategory)
router.get('/searchByDate/:userId', expense.searchByDate)

module.exports = router
