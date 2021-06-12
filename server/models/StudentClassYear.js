const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const studentClassYear = new Schema({
    classId: {
        required: true,
        type: String
    },
    yearId: {
        required: true,
        type: String
    },
    studentId: {
        required: true,
        type: String
    }
});

studentClassYear.set('toJSON', { virtuals: true });
module.exports = mongoose.model('StudentClassYear', studentClassYear);
