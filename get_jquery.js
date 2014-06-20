/**
 * @author gutianyu
 */
var nodegrass = require('nodegrass');
var fs = require('fs');

/**
 * get file from net
 */
var getFile = function(url, cb) {
    nodegrass.get(url, function(data, status, headers){
        //console.log(data);
        cb(data);
    }, 'utf8').on('error', function(e){
        console.log('error' + e.message);
    });
};

getFile('http://code.jquery.com/jquery/', function(data) {
    var buffer = new Buffer(data);
    var str = buffer.toString();
    var arr = str.split(/\r\n|[\r\n]/g);
    // console.log(arr);
    var reg = /href=("|')([^"']+\.js)\1/g;
    var names = [];
    for (var i = 0, len = arr.length; i < len; i ++) {
        //console.log(arr[i]);
        var result = null;
        while (result = reg.exec(arr[i])) {
            //console.log(arr[i]);
            result[2] && names.push(result[2]);
            //console.log(result);
        }
    }

    console.log(names);
    for (var i = 0, len = names.length; i < len; i ++) {
        (function(j){
            var name = names[j];
            getFile('http://code.jquery.com' + name, function(data){
                var fBuffer = new Buffer(data);
                fs.writeFile('jquery-code/' + name, data, function(err){
                    if (err) {
                        console.log(name + ' : ' + err.message);
                        throw err;
                    }
                    console.log(name + ' has written!');
                });
            });
        }(i));
    }
});
