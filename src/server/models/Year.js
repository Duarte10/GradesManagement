const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const yearSchema = new Schema({
    year: {
        required: true,
        type: number
    }
});

yearSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Year', yearSchema);
