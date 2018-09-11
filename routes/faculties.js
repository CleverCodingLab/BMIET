const express = require('express');
const router = express.Router();

// Faculty Model
let Faculty = require('../models/faculty');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_faculty', {
        title:'Add Faculty'
    });
});

//show route
router.get('/show', ensureAuthenticated, function(req, res){
    Faculty.find({}, function(err, articles){
        if(err){
            console.log(err);
        } else {
            res.render('Show_faculties', {
                faculties: articles
            });
        }
    });
});

// Add Submit POST Route
router.post('/add', function(req, res){
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('department','Department is required').notEmpty();
    req.checkBody('salary','Salary is required').notEmpty();
    req.checkBody('city','City is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_faculty', {
            title:'Add Faculty',
            errors:errors
        });
    } else {
        let faculty = new Faculty();
        faculty.name = req.body.name;
        faculty.admin = req.user._id;
        faculty.department = req.body.department;
        faculty.salary = req.body.salary;
        faculty.city = req.body.city;

        faculty.save(function(err){
            if(err){
                console.log(err);
                return;
            } else {
                req.flash('success','Faculty Added');
                res.redirect('/');
            }
        });
    }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Faculty.findById(req.params.id, function(err, faculty){
        if(faculty.admin != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        res.render('edit_faculty', {
            title:'Edit Faculty Details',
            faculty:faculty
        });
    });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
    let faculty = {};
    faculty.name = req.body.name;
    faculty.department = req.body.department;
    faculty.salary = req.body.salary;
    faculty.city = req.body.city;

    let query = {_id:req.params.id}

    Faculty.update(query, faculty, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            req.flash('success', 'Faculty Details Updated');
            res.redirect('/');
        }
    });
});

// Delete Faculty
router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    let query = {_id:req.params.id}

    Faculty.findById(req.params.id, function(err, faculty){
        if(faculty.admin != req.user._id){
            res.status(500).send();
        } else {
            Faculty.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});

// Get Single Faculty
router.get('/:id', function(req, res){
    Faculty.findById(req.params.id, function(err, faculty){
        User.findById(faculty.admin, function(err, user){
            res.render('faculty', {
                faculty:faculty,
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
