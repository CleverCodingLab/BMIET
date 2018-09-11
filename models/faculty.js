let mongoose = require('mongoose');

// Faculty Schema
let facultySchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true
    },
    salary:{
        type: Number,
        required: true
    },
    city:{
        type: String,
        required: true
    }


});

let Faculty = module.exports = mongoose.model('Faculty', facultySchema);
