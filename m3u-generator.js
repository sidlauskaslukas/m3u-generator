#! /usr/bin/env node

var fs = require('fs');
var writer = require('m3u').extendedWriter();
var audioExtensions = require('audio-extensions');
var path = process.cwd();
var dirname = path.match(/([^\/]*)\/*$/)[1];

if(!fs.existsSync(path)) return;

fs.readdirSync(path).forEach(function(file) {
	var ext = file.split('.')[1];

	if(audioExtensions.indexOf(ext) !== -1) {
		writer.file(file, 0, file);
	}
});

fs.writeFile(dirname + '.m3u', writer.toString(), function(err) {
	if(err) {
		return console.log(err);
	}
	console.log('Playlist file was successfuly generated!')
});