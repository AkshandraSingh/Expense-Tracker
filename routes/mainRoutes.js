const express = require('express')

const userRouter = require('./userRouter')
const expenseRouter = require('./expenseRoutes')

const commonRouter = express.Router()

commonRouter.use('/user', userRouter)
commonRouter.use('/expense', expenseRouter)

module.exports = commonRouter
