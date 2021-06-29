const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const classSchema = new Schema({
    code: {
        maxlength: 100,
        minlength: 2,
        required: true,
        trim: true,
        type: String,
        unique: true
    },
    name: {
        maxlength: 100,
        minlength: 2,
        required: true,
        trim: true,
        type: String
    },
    semesters: [{ type: Schema.Types.ObjectId, ref: 'ClassSemester' }]
});

classSchema.plugin(uniqueValidator);
classSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Class', classSchema);
