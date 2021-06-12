const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const classYear = new Schema({
    classId: {
        required: true,
        type: String
    },
    yearId: {
        required: true,
        type: String
    }
});

classYear.set('toJSON', { virtuals: true });
module.exports = mongoose.model('ClassYear', classYear);
