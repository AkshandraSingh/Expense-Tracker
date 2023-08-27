const expenseSchema = require('../models/expenseModel');
const categorySchema = require('../models/categoryModel');
const expenseLogger = require('../utils/expenseLogger/expenseLogger')

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
            });
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
            });
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
            })
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
    }
};
