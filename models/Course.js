const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSquema = new Schema({
    name: {
        type: String,
        required: true
    },
    subjects: [{
       type: mongoose.Types.ObjectId,
        ref: 'Subjects',
    }],
 },
    {timestamps : true}
 )

const Course = mongoose.model('Course', courseSquema); 
module.exports = Course;