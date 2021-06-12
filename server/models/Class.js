const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const classSchema = new Schema({
    name: {
        maxlength: 100,
        minlength: 2,
        required: true,
        trim: true,
        type: String
    }
});

classSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Class', classSchema);
