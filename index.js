const   express = require('express'),
        app     = express();

var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

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

app.listen(port, () => {
    console.log("Server is running on port: " + port);
});