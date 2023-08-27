const categoryValidationSchema = require('./categoryValidationSchema')

module.exports = {
    createCategory: async (req, res, next) => {
        const value = await categoryValidationSchema.createCategory.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },
}
