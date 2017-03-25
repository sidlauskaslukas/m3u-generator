#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
var readdir = require('recursive-readdir');
var writer = require('m3u');
var audioExtensions = require('audio-extensions');
var currentDir = process.cwd();

readdir(currentDir, function(err, files) {
	if(err) {
		if(err.code === 'ENOENT') {
			console.log('This folder does not exist.');
			return;
		} else {
			throw err;
		}
	} else {
		readFiles(files, function(audioFiles) {
			createPlaylistFile(audioFiles);
		}, function() {
			console.log('There are no audio files in this folder!');
		});
	}
});

function readFiles(files, onSuccess, onError) {
	var audioFiles = filterFiles(files);

	audioFiles.length ? onSuccess(audioFiles) : onError();
}

function filterFiles(files) {
	var filtered = [];

	files.forEach(function(file) {
		var ext = file.split(/[. ]+/).pop();

		if(audioExtensions.indexOf(ext) !== -1) filtered.push(file);
	});

	return filtered;
}

function writeFile(playlist, file) {
	var relativePath = file.split(currentDir + path.sep)[1];
	var fileName = path.parse(file).name;

	playlist.file(relativePath, 0, fileName);
}

function createPlaylistFile(audioFiles) {
	var playlist = writer.extendedWriter();
	var playlistName = path.parse(currentDir).name;

	audioFiles.forEach(function(file) {
		writeFile(playlist, file);
	});

	fs.writeFile(playlistName + '.m3u', playlist.toString(), function(err) {
		if(err) {
			return console.log(err);
		}
		console.log('Playlist file was successfuly generated!')
	});
}