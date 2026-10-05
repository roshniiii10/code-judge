const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    language: {
        type: String,
        enum: ['cpp', 'python', 'javascript'],
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
        default: 'Pending'
    },
    passedCases: { type: Number, default: 0 },
    totalCases: { type: Number, default: 0 },
    errorMessage : String
}, { timestamps: true });

module.exports = mongoose.model('submission', submissionSchema);