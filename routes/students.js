const express = require('express');
const router = express.Router();

// Student Model
let Student = require('../models/student');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_student', {
    title:'Add Student'
  });
});

//show route
router.get('/show', ensureAuthenticated, function(req, res){
    Student.find({}, function(err, articles){
        if(err){
            console.log(err);
        } else {
            res.render('Show', {
                students: articles
            });
        }
    });
});

// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('branch','Branch is required').notEmpty();
  req.checkBody('rollno','Roll no. is required').notEmpty();
  req.checkBody('fname','Father name is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_student', {
      title:'Add Student',
      errors:errors
    });
  } else {
    let article = new Student();
    article.name = req.body.name;
    article.admin = req.user._id;
    article.branch = req.body.branch;
    article.rollno = req.body.rollno;
    article.fname = req.body.fname;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Student Added');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Student.findById(req.params.id, function(err, student){
    if(student.admin != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_student', {
      title:'Edit Student Details',
      student:student
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let article = {};
  article.name = req.body.name;
  article.branch = req.body.branch;
  article.rollno = req.body.rollno;
  article.fname = req.body.fname;

  let query = {_id:req.params.id}

  Student.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Student Details Updated');
      res.redirect('/');
    }
  });
});

// Delete Student
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Student.findById(req.params.id, function(err, student){
    if(student.admin != req.user._id){
      res.status(500).send();
    } else {
      Student.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get Single Student
router.get('/:id', function(req, res){
  Student.findById(req.params.id, function(err, student){
    User.findById(student.admin, function(err, user){
      res.render('student', {
        student:student,
        admin: user.name
      });
    });
  });
});



// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
