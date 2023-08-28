const schedule = require('node-schedule')
const moment = require('moment')

const expenseSchema = require('../models/expenseModel');
const userSchema = require('../models/userModel')
const categorySchema = require('../models/categoryModel');
const expenseLogger = require('../utils/expenseLogger/expenseLogger')
const emailSender = require('../services/emailService')

module.exports = {
    createExpense: async (req, res) => {
        try {
            const data = req.body;
            const { userId } = req.params;
            const expenseData = new expenseSchema(data);
            expenseData.userId = userId;
            const categoryExists = await categorySchema.exists({
                userId: userId,
                categoryName: data.expenseCategory,
            });
            if (expenseData.expenseCategory !== "common" && !categoryExists) {
                expenseLogger.log('error', 'Invalid expense category')
                res.status(400).send({
                    success: false,
                    message: "Invalid expense category",
                });
                return;
            }
            await expenseData.save();
            expenseLogger.log('info', "Expense created!")
            res.status(201).send({
                success: true,
                message: "Expense created!",
            });
        } catch (error) {
            expenseLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message,
            });
        }
    },

    editExpense: async (req, res) => {
        try {
            const { expenseId } = req.params;
            const expenseData = await expenseSchema.findById(expenseId);
            if (!expenseData) {
                expenseLogger.log('error', 'Expense not found')
                return res.status(404).json({
                    success: false,
                    message: "Expense not found",
                });
            }
            const {
                expenseName,
                expenseDescription,
                expenseAmount,
                expenseCategory,
            } = req.body;
            if (expenseCategory) {
                const categoryExists = await categorySchema.exists({
                    userId: expenseData.userId,
                    categoryName: req.body.expenseCategory,
                });
                if (expenseData.expenseCategory !== "common" && !categoryExists) {
                    expenseLogger.log('error', 'Invalid expense category')
                    return res.status(400).json({
                        success: false,
                        message: "Invalid expense category",
                    });
                }
                expenseData.expenseCategory = expenseCategory;
                await expenseData.save();
            }
            const updatedFields = {};
            if (expenseName) updatedFields.expenseName = expenseName;
            if (expenseDescription) updatedFields.expenseDescription = expenseDescription;
            if (expenseAmount) updatedFields.expenseAmount = expenseAmount;
            const updatedExpense = await expenseSchema.findByIdAndUpdate(
                expenseId,
                updatedFields,
                { new: true }
            );
            expenseLogger.log('info', "Expense edited successfully")
            res.status(200).json({
                success: true,
                message: "Expense edited successfully",
                expenseData: updatedExpense,
            });
        } catch (error) {
            expenseLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message,
            });
        }
    },

    deleteExpense: async (req, res) => {
        try {
            const { expenseId } = req.params
            await expenseSchema.findByIdAndDelete(expenseId)
            expenseLogger.log('info', "Expense delete successfully")
            res.status(200).send({
                success: true,
                message: "Expense delete successfully"
            })
        } catch (error) {
            expenseLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message,
            });
        }
    },

    searchByName: async (req, res) => {
        try {
            const { userId } = req.params;
            const { userSearch } = req.query;
            const expenses = await expenseSchema.find({
                userId: userId,
                expenseName: new RegExp(userSearch, 'i'),
            }).select('expenseName')
            if (expenses.length === 0) {
                expenseLogger.log('error', "No expense found")
                return res.status(404).send({
                    success: false,
                    message: "No expense found"
                });
            }
            expenseLogger.log('info', "Expenses found successfully")
            res.status(200).json({
                success: true,
                message: "Expenses found successfully",
                expenses: expenses,
            });
        } catch (error) {
            expenseLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message,
            });
        }
    },

    searchByCategory: async (req, res) => {
        try {
            const { userId } = req.params;
            const { userSearch } = req.query;
            const expenses = await expenseSchema.find({
                userId: userId,
                expenseCategory: new RegExp(userSearch, 'i')
            }).select('expenseName')
            if (expenses.length === 0) {
                expenseLogger.log('error', "No expense found")
                return res.status(404).send({
                    success: false,
                    message: "No expense found"
                });
            }
            expenseLogger.log('info', "Expenses found successfully")
            res.status(200).json({
                success: true,
                message: "Expenses found successfully",
                expenses: expenses,
            });
        } catch (error) {
            expenseLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message,
            });
        }
    },

    searchByDate: async (req, res) => {
        try {
            const { userId } = req.params
            const { startDate, endDate } = req.query;
            const expenseData = await expenseSchema.find({
                userId: userId,
                createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }).select('expenseName')
            if (expenseData.length === 0) {
                expenseLogger.log('error', "No expense found")
                return res.status(404).send({
                    success: false,
                    message: "No expense found"
                });
            }
            expenseLogger.log('info', "Expenses found successfully")
            res.status(200).send({
                success: true,
                message: "Expense founded successfully",
                data: expenseData
            });
        } catch (error) {
            expenseLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error!!",
                error: error.message
            });
        }
    },

    allExpense: async (req, res) => {
        try {
            const { userId } = req.params
            const expenseData = await expenseSchema.find({
                userId: userId
            }).select('expenseName')
            expenseLogger.log('info', "All expense found")
            res.status(200).send({
                success: true,
                message: "All expense found",
                expenseData: expenseData
            })
        } catch (error) {
            expenseLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error!!",
                error: error.message
            });
        }
    },

    todayExpense: async (req, res) => {
        try {
            const { userId } = req.params
            const today = new Date();
            const startOfDay = new Date(today).setHours(0, 0, 0, 0);
            const endOfDay = new Date(today).setHours(23, 59, 59, 999);
            const expenseData = await expenseSchema.find({
                userId: userId,
                createdAt: { $gte: startOfDay, $lte: endOfDay },
            }).select('expenseName expenseAmount')
            const expenseAmount = await expenseSchema.find({
                userId: userId,
                createdAt: { $gte: startOfDay, $lte: endOfDay },
            })
            let totalExpense = 0
            expenseAmount.forEach((expense) => {
                totalExpense += expense.expenseAmount;
            })
            res.status(200).send({
                success: true,
                message: "Today expenses!",
                totalExpense: totalExpense,
                expenseData: expenseData
            })
        } catch (error) {
            expenseLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error!!",
                error: error.message
            });
        }
    },

    expenseDetails: async (req, res) => {
        try {
            const { expenseId } = req.params
            const expenseData = await expenseSchema.findById(expenseId).select('expenseName expenseDescription expenseAmount expenseDate expenseCategory')
            expenseLogger.log('info', "Expense details found")
            res.status(200).send({
                success: true,
                message: "Expense details found",
                expenseData: expenseData
            })
        } catch (error) {
            expenseLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error!!",
                error: error.message
            });
        }
    },

    expenseReminder: async (req, res) => {
        try {
            const { userId } = req.params
            const { expenseName, message, expenseAmount, time } = req.body;
            const userData = await userSchema.findById(userId)
            const userEmail = userData.userEmail
            const scheduleTime = new Date(time);
            schedule.scheduleJob(scheduleTime, async () => {
                await emailSender.expenseReminder(userEmail, expenseName, message, expenseAmount)
                expenseLogger.log('info', `Expense reminder sent for ${expenseName}`);
            });
            res.status(200).send({
                success: true,
                message: "Expense reminder scheduled successfully"
            });
        } catch (error) {
            expenseLogger.log('error', `Error: ${error.message}`);
            res.status(500).send({
                success: false,
                message: "Error!!",
                error: error.message
            });
        }
    },

    monthExpenses: async (req, res) => {
        try {
            const { userId } = req.params;
            const today = moment();
            const startOfMonth = today.clone().startOf('month');
            const endOfMonth = today.clone().endOf('month');
            const expensesData = await expenseSchema.find({
                userId: userId,
                createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            }).select('expenseName expenseAmount')
            const expenseAmount = await expenseSchema.find({
                userId: userId,
                createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            })
            let totalAmount = 0
            expenseAmount.forEach((expense) => {
                totalAmount += expense.expenseAmount;
            })
            expenseLogger.log('info', "This month expense found!")
            res.status(200).send({
                success: true,
                message: "This month expense are",
                totalAmount: totalAmount,
                expensesData: expensesData
            })
        } catch (error) {
            expenseLogger.log('error', `Error: ${error.message}`);
            res.status(500).send({
                success: false,
                message: "Error!!",
                error: error.message
            });
        }
    }
};
