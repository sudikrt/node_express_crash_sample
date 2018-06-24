let express = require ('express');
let bodyParser = require ('body-parser');
let path = require ('path');
let expressValidator = require ('express-validator');
let mongojs = require('mongojs');
let db = mongojs('customerApp', ['users']);
let ObjectId = mongojs.ObjectId;

let app = express ();

/*let logger  = function (req, resp, next) {
    console.log ('Logging ....');
    next ();
};

app.use (logger);*/
//Global error variable 
app.use (function (req, resp, next) {
    resp.locals.errors = null;
    next ()
})

//View Engine
app.set ('view engine', 'ejs' );
app.set ('views', path.join (__dirname, 'views'))

//Body Parser middleware
app.use (bodyParser.json () );
app.use (bodyParser.urlencoded ({extended : false}));

//static resources
app.use (express.static (path.join (__dirname, 'public')));

// Express validator middleware
app.use (expressValidator ({
    errorFormatter : function (param, msg, val) {
        let nameSpace = param.split('.')
            ,root = nameSpace.shift ()
            ,formParam = root;
        while (nameSpace.length) {
            formParam += '[' + nameSpace.shift () + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : val
        };
    }
}));


/*
let person = [
    {
        name : 'Jack',
        age : 20
    },
    {
        name:"Cool",
        age:2
    }
];
resp.json (person);
*/

let users = [
    {
        id : 0,
        firstName : 'Subba',
        lastName : 'Dabba',
        email : 'sd@mail.com'
    },
    {
        id : 1,
        firstName : 'Subba_1',
        lastName : 'Dabba',
        email : 'sd@mail.comm'
    },
    {
        id : 0,
        firstName : 'Subba_2',
        lastName : 'Dabba',
        email : 'sd@mail.commm'
    }
];

app.get ('/', function (req, resp) {
    //resp.send ('Hi this my first app');

    db.users.find (function (error, docs) {
        if (error) {
            console.log ('Error occured while loading data');
        } else {
            resp.render ('index', {
                title : 'Sample Title',
                users : docs
            });
        }
    })
    // resp.render ('index', {
    //     title : 'Sample Title',
    //     users : users
    // });
});

app.post ('/users/add', function (req, resp) {
    console.log ('Form submitted');

    req.checkBody ('firstName', 'First name is required').notEmpty ();
    req.checkBody ('lastName', 'last name is required').notEmpty ();
    req.checkBody ('email', 'email is required').notEmpty ();

    let errors = req.validationErrors ();

    if (errors) {
        console.log (errors);
        resp.render ('index', {
            title : 'Sample Title',
            users : users,
            errors : errors
        });
    } else {
        let user = {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email
        }
        console.log (user);
        db.users.insert (user, function (err, res) {
            if (err) {
                console.log ('Error while inserting');
            }
            resp.redirect ('/');
        });
    }
});

app.delete ('/users/delete/:id', function (req, resp) {
    console.log ('Id :' + req.params.id);
    db.users.remove ({_id : ObjectId (req.params.id) }, function (err, result) {
        if (err) {
            console.log ('error in Deleting row');
            resp.sendStatus(401);
        } else {
            resp.sendStatus(200);
            console.log ('DELETE Successful');
        }
        resp.send ();
    });
})

app.listen (1221, function () {
    console.log ('Started listining :' + 1221);
});