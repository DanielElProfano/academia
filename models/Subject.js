const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSquema = new Schema({
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'Course'
    },    
    name: {
        enum: ['React', 'Node', 'Vanilla JS', 'Angular'],
        type: String,
        required: true
    },
    students: [{
        type: mongoose.Types.ObjectId,
        ref: 'Students',
    }],
    professors: [{
        type: mongoose.Types.ObjectId,
        ref: 'Professors'
    }]
},

{
    timestamps: true,
  }
)


const Subject = mongoose.model('Subjects', SubjectSquema); 
module.exports = Subject;