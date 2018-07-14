const   express         = require('express'),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        methodOverride  = require('method-override'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),

        User            = require('./models/user'),
        app             = express();

var port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/portfolio_blog");

app.use(require("express-session")({
    secret: "Stella is the cutest dog ever",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

var Blog = mongoose.model("Blog", blogSchema);

app.get('/', (req,res) => {
    res.render('index');
});

app.get('/projects', (req, res) => {
    res.render('projects');
});

app.get('/certificates', (req, res) => {
    res.render('certificates');
});

app.get('/instafeed', (req, res) => {
    res.render('insta');
});


// BLOG //
app.get('/blogs', (req, res) => {
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error");
        } else {
            res.render("blogindex", {blogs: blogs});            
        }
    })
});

app.get('/blogs/new', (req, res) => {
    res.render('newblog');
});

app.post('/blogs', (req, res) => {
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render('newblog');
        } else {
            res.redirect('/blogs');
        }
    });
});

app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect('/blogs');
        } else {
            console.log(req.user);
            res.render('showblog', {blog: foundBlog, currentUser: req.user});
        }
    });
});

app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render("editblog", {blog: foundBlog});
        }
    });
});

app.put('/blogs/:id', (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    })
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect('/');
        });
    });
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/blogs',
    failureRedirect: '/login'
}), (req, res) => {
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(port, () => {
    console.log("Server is running on port: " + port);
});