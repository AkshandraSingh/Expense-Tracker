const categorySchema = require('../models/categoryModel')
const categoryLogger = require('../utils/categoryLogger/categoryLogger')

module.exports = {
    createCategory: async (req, res) => {
        try {
            const { userId } = req.params
            const categoryData = new categorySchema(req.body)
            const categoryExists = await categorySchema.exists({
                userId: userId,
                categoryName: req.body.categoryName,
            });
            if (categoryExists) {
                categoryLogger.log('error', "Category already exist with this name")
                return res.status(401).send({
                    success: false,
                    message: "Category already exist with this name"
                })
            }
            categoryData.userId = userId
            await categoryData.save()
            categoryLogger.log('info', "Category created!")
            res.status(201).send({
                success: true,
                message: "Category created!"
            })
        } catch (error) {
            categoryLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error!",
                error: error.message,
            })
        }
    }
}