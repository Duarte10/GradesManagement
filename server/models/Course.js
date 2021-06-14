const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        maxlength: 100,
        minlength: 2,
        required: true,
        trim: true,
        type: String
    }
});

courseSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Course', courseSchema);
