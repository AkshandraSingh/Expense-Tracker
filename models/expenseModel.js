const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    expenseName: {
        type: String,
        required: true
    },
    expenseDescription: {
        type: String,
        required: true
    },
    expenseAmount: {
        type: Number,
        required: true
    },
    expenseDate: {
        type: Date,
        default: Date.now()
    },
    expenseCategory: {
        type: String,
        default: "common"
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

expenseSchema.set('timestamps', true)

module.exports = mongoose.model('expense', expenseSchema)
