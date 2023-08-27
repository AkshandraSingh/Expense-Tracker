const express = require('express')

const userRouter = require('./userRouter')
const expenseRouter = require('./expenseRoutes')
const categoryRouter = require('./categoryRoutes')

const commonRouter = express.Router()

commonRouter.use('/user', userRouter)
commonRouter.use('/expense', expenseRouter)
commonRouter.use('/category', categoryRouter)

module.exports = commonRouter
