const express = require('express')

const expense = require('../controllers/expenseController')
const expenseValidation = require('../validations/expense/expenseValidator')
const { userAuthentication } = require('../middleware/authToken')

const router = express.Router()

router.post('/createExpense/:userId', expenseValidation.createExpense, expense.createExpense)
router.patch('/editExpense/:expenseId', userAuthentication, expense.editExpense)
router.delete('/deleteExpense/:expenseId', userAuthentication, expense.deleteExpense)
router.get('/searchByName/:userId', userAuthentication, expense.searchByName)
router.get('/searchByCategory/:userId', userAuthentication, expense.searchByCategory)
router.get('/searchByDate/:userId', userAuthentication, expense.searchByDate)
router.get('/allExpense/:userId', expense.allExpense)
router.get('/todayExpense/:userId', expense.todayExpense)
router.get('/expenseDetails/:expenseId', expense.expenseDetails)

module.exports = router
