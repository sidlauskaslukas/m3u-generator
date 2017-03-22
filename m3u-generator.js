#! /usr/bin/env node

var fs = require('fs');
var writer = require('m3u').extendedWriter();
var audioExtensions = require('audio-extensions');
var path = process.cwd();

fs.readdir(path, function(err, files) {
	if(err) {
		if(err.code === 'ENOENT') {
			console.log('This folder does not exist.');
			return;
		} else {
			throw err;
		}
	} else {
		readFiles(files, function() {
			createPlaylistFile();
		}, function() {
			console.log('There are no audio files in this folder!');
		});
	}
});

function readFiles(files, onSuccess, onError) {
	var writeFile = false;

	files.forEach(function(file) {
		var ext = file.split('.')[1];

		if(audioExtensions.indexOf(ext) !== -1) {
			writeFile = true;
			writer.file(file, 0, file);
		}
	});

	writeFile ? onSuccess() : onError();
}

function createPlaylistFile() {
	var playlistName = path.match(/([^\/]*)\/*$/)[1];

	fs.writeFile(playlistName + '.m3u', writer.toString(), function(err) {
		if(err) {
			return console.log(err);
		}
		console.log('Playlist file was successfuly generated!')
	});
}