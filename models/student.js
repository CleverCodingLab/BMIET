let mongoose = require('mongoose');

// Student Schema
let studentSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  admin:{
    type: String,
    required: true
  },
  branch:{
    type: String,
    required: true
  },
    rollno:{
        type: Number,
        required: true
    },
    fname:{
        type: String,
        required: true
    }


});

let Student = module.exports = mongoose.model('Student', studentSchema);
