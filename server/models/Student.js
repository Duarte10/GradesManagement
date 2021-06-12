const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const student = new Schema({
    number: {
        required: true,
        type: number
    },
    name: {
        maxlength: 100,
        minlength: 2,
        required: true,
        trim: true,
        type: String
    },
    birthDate: {
        type: Date,
        required: false
    }
});

student.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Student', student);
