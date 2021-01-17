const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const professorSchema = new Schema(
     {
        name: {
                type: String,
                required: true
            },
        lastName: {
                type: String,
                required: true
        },
        mail: {
                type: String,
                required: true
        },
        password: {
                type: String,
                required: true
        },
        photo: {
                type: String,
                
        },
        age: {
            type: Number,
            min:14,
            max: 65
        },
        rol: {
            enum: ['admin', 'professor','default'],
            type: String,
            default: 'professor',
            required: true
        },
        subjetcs: [{
            type: mongoose.Types.ObjectId,
            ref: 'Subject'

        }]
        
    },
    { timestamps: true }

);

const Professor = mongoose.model('professor', professorSchema); 
module.exports = Professor;