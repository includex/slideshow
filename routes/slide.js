var express = require('express');
var fs = require('fs');


var router = express.Router();
var TOOL_PATH = "/Users/includex/WebstormProjects/slide/bin";
var STORAGE_PATH = "/Users/includex/WebstormProjects/slide/files"

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('slide_create', { title: 'Create Slide' });
});

router.get('/show/:id', function(req, res, next) {
    var id= req.params.id;
    var path = STORAGE_PATH + '/' + id;
    var isExist = fs.existsSync(path);
    if(isExist === false){
        res.redirect('/slide/notexist');
        return;
    }

    var glob = require("glob")
    glob(path + '/*.jpg', [], function (er, files) {
        var arr = [];
        for(var i = 1; i <= files.length; i++){
            arr.push(i);
        }
        res.render('slide_show_slide', { slideid: id, slides: arr });
    });
});

router.get('/notexist', function(req, res, next) {
    res.render('upload_complete', { title: 'Expres22s' });
});

router.post('/create', function(req, res, next) {
    fs.readFile(req.files.file.path, function(error, data){
        var skey = Date.now() + '_' + Math.round(Math.random()* 1000000000);
        var path = STORAGE_PATH + '/' + skey;
        var filepath = path + '/' + ".pdf";

        fs.mkdirSync(path);

        fs.writeFile(filepath, data, function(error){
            if(error){
                throw error;
            }

            var exec = require('child_process').exec;
            exec ('java -jar ' + TOOL_PATH + '/pdfbox-app-1.8.9.jar PDFToImage ' + filepath + ' &>/dev/null',{'timeout':20000}, function(){
                res.send('' +skey);
            });
        });
    });

    return false;
});

function run_cmd(cmd, args) {
    var exec = require('child_process').exec;
    exec(cmd);
    //spawn(cmd, args);
}

function pdfToImage(inputpath){
    var exec = require('child_process').exec;
    //new run_cmd('java -jar ' + TOOL_PATH + '/pdfbox-app-1.8.9.jar PDFToImage ' + inputpath);
    console.log('java -jar ' + TOOL_PATH + '/pdfbox-app-1.8.9.jar PDFToImage ' + inputpath);
    exe ('java -jar ' + TOOL_PATH + '/pdfbox-app-1.8.9.jar PDFToImage ' + inputpath, function(){

    });
    //new run_cmd('java', ['-jar', TOOL_PATH + '/pdfbox-app-1.8.9.jar', 'PDFToImage', inputpath]);
}

module.exports = router;
