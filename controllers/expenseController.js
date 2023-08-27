const expenseSchema = require('../models/expenseModel');
const categorySchema = require('../models/categoryModel');

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
                res.status(400).send({
                    success: false,
                    message: "Invalid expense category",
                });
                return;
            }
            await expenseData.save();
            res.status(201).send({
                success: true,
                message: "Expense created!",
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message,
            });
        }
    }
};
