const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    number: {
        required: true,
        type: Number,
        unique: true
    },
    name: {
        maxlength: 100,
        minlength: 2,
        required: true,
        trim: true,
        type: String
    },
    semesterClasses: [{ type: Schema.Types.ObjectId, ref: 'Semester' }],
});

studentSchema.plugin(uniqueValidator);
studentSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Student', studentSchema);
