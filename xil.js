var path = require('path');
var join = path.join;
var sep = path.sep;
var exec = require('child_process').exec;
var cwd = process.cwd();
var os = require('os');

// Audio
function doAudio() {

  var audio = join(cwd, 'audio', 'xil.wav');
  var audio_tmp = join(cwd, 'audio', 'tmp.wav');
  var sox = join(cwd, 'libs', 'sox-14.3.2', 'sox');
  var effect = "echo 0.8 0.88 60 0.4";
  var command = [sox, audio, audio_tmp, effect].join(" ");

  exe(command, function(err) {
    if (!err) exe('mv -f ' + audio_tmp + " " + audio);
  })

}




// Image
function doImage() {
  var imversion = parseInt(os.release()) >= 12 ? '6.8.8' : '6.6.7';
  var imhome = join(cwd, "libs", "ImageMagick-" + imversion);
  var mogrify = join(imhome, 'bin', 'mogrify');
  var env = { DYLD_LIBRARY_PATH: join(imhome, 'lib'), MAGICK_HOME: imhome }
  var effect = '-blur 4x2 -negate';
  var image = join(cwd, 'img', 'xil.jpg');
  var command = [mogrify, effect, image].join(" ");

  exe(command, env);
}



// Helper


function exe(cmd, env, cb) {
  if (typeof env === 'function') {
    cb = env;
  }
  exec(cmd, {env: env}, function(err) {
    if (err) {
      console.log('Fail: ' + cmd);
    } else {
      cmd = cmd.split(" ").shift().split(path.sep).pop();
      console.log('Success: ' + cmd);
      cb && cb(err);
    }
  })
}


// Execute!
doAudio();
doImage();