const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;
const formidable = require('formidable');
const request = require('request');

let timer = null;
let imageArray = new Array();
const imageFolder = 'http://pclmarketing.com/software/uwu9gen/load.php'
app.use(express.static(__dirname));

app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/ui/index.html');
});

app.get('/upload', function(req, res,next) {
    res.sendFile(__dirname + '/ui/upload.html');
});

app.get('/uploaddone', function(req, res,next) {
    res.sendFile(__dirname + '/ui/uploaddone.html');
});

app.get('/reset', function(req, res,next) {
    imageArray = [];
    console.log('reseted',imageArray);
    res.end();
});


app.post('/uploadnow', function(req, res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.image.path;
        var newpath = './uploads/' + parseInt(Math.random() * 1000) + '_' +  files.image.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.redirect('/uploaddone');
        });
    });
});



app.get('/scripts/main.js', function(req, res,next) {
    res.sendFile(__dirname + '/scripts/main.js');
});

app.get('/scripts/responsify.min.js', function(req, res,next) {
    res.sendFile(__dirname + '/scripts/responsify.min.js');
});

app.get('/css/style.css', function(req, res,next) {
    res.sendFile(__dirname + '/css/style.css');
});

server.listen(port, () => {
    console.log('app is listening to ' + port);
});


io.on('connection', function(client) {
    console.log('connect');
});

let load = () => {
    request(imageFolder, (err, res, body) => {
        console.log('res',body);
        files = JSON.parse(body);
        let diff = files.filter(x => imageArray.indexOf(x) < 0 );
        console.log(diff, imageArray);
        if(diff.length > 0 ) {
            imageArray = imageArray.concat(diff);
            io.emit('newImage', {
                images: diff,
            });
        }
    });
};

timer = setInterval(() => {
    load();
}, 5000);






