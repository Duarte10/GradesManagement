const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;


const evaluationComponentValueSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    value: Number
});

const evaluationComponentSchema = new Schema({
    percentage: {
        required: true,
        type: Number
    },
    name: {
        required: true,
        type: String
    },
    values: [evaluationComponentValueSchema]
});

const classSemesterSchema = new Schema({
    year: {
        required: true,
        type: Number
    },
    name: {
        required: true,
        type: String
    },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    evaluationComponents: [evaluationComponentSchema],
    course: { type: Schema.Types.ObjectId, ref: 'Course' }
});

classSemesterSchema.plugin(uniqueValidator);
classSemesterSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('ClassSemester', classSemesterSchema);
