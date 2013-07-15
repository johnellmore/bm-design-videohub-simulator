// includes
var c = require('./configs.js'); // useful configuration information
var EventEmitter = require('events').EventEmitter;
var util = require('util');

// HELPER FUNCTION

// VIDEOHUB CLASS
var Videohub = function (type) {
	this.type = type;
	this.name = c.models[type].name;
	this.available = c.models[type];
	this.clearUpdates();
	this.labels = {};
	this.routes = {};
	this.locks = {};
	this.labels[c.INTERFACE_LABELS_IN] = [];
	this.labels[c.INTERFACE_LABELS_OUT] = [];
	this.labels[c.INTERFACE_LABELS_MON_OUT] = [];
	this.labels[c.INTERFACE_LABELS_SERIAL] = [];
	this.labels[c.INTERFACE_LABELS_FRAME] = [];
	this.routes[c.INTERFACE_ROUTES_VIDEO_OUT] = [];
	this.routes[c.INTERFACE_ROUTES_MON_OUT] = [];
	this.routes[c.INTERFACE_ROUTES_SERIAL] = [];
	this.routes[c.INTERFACE_ROUTES_FRAME] = [];
	this.routes[c.INTERFACE_ROUTES_PROCESS] = [];
	this.locks[c.INTERFACE_LOCKS_VIDEO_OUT] = [];
	this.locks[c.INTERFACE_LOCKS_MON_OUT] = [];
	this.locks[c.INTERFACE_LOCKS_SERIAL] = [];
	this.locks[c.INTERFACE_LOCKS_FRAME] = [];
	this.locks[c.INTERFACE_LOCKS_PROCESS] = [];
}
util.inherits(Videohub, EventEmitter); // Videohub will emit events


// METHODS

// queueUpdate makes sure that the given update is valid
Videohub.prototype.queueUpdate = function (inf, i, v) {
	if (!this.isValidChange(inf, i, v)) return false;
	this.updates[inf-1][i] = v;
	return true;
}

// doUpdate takes all the validated updates and executes them
Videohub.prototype.doUpdate = function () {
	// iterate through each each interface
	for (inf in this.updates) {
		inf = Number(inf);
		// then through each update for this interface
		for (n in this.updates[inf]) {
			// and make the change
			this.doChange(inf+1, n, this.updates[inf][n]);
		}
	}
	this.emit('change', this.updates);
	this.clearUpdates();
}

Videohub.prototype.clearUpdates = function () {
	this.updates = {};
	for (var i = 0; i < 15; i++)
		this.updates[i] = [];
}

Videohub.prototype.isValidChange = function (inf, index, value) {
	// check that the index is correct
	if (index < 0 || index >= this.getInterfaceCount(inf)) return false;

	// check value based on its interface type
	if (inf >= 1 && inf <= 5) {
		// a label
		return true;
	} else if (inf >= 6 && inf <= 10) {
		// a route
		if (value != String(Number(value))) return false;
		if (value < 0) return false;
		if (inf == c.INTERFACE_ROUTES_SERIAL) {
			if (index == value) return false; // can't route serial port to itself
			if (index >= this.getInterfaceCount(c.INTERFACE_ROUTES_SERIAL)) return false;
			return true;
		}
		if (index >= this.getInterfaceCount(c.INTERFACE_LABELS_IN)) return false;
		return true;
	} else if (inf >= 11 && inf <= 15) {
		// a lock
		if (value != 'U') return true;
		if (value != 'O') return true;
		return false;
	}
	return false;
}

Videohub.prototype.doChange = function (inf, index, value) {
	if (inf >= 1 && inf <= 5) {
		// a label
		this.labels[inf][index] = String(value);
	} else if (inf >= 6 && inf <= 10) {
		// a route
		this.routes[inf][index] = Number(value);
	} else if (inf >= 11 && inf <= 15) {
		// a lock
		this.locks[inf][index] = value;
	}
}

Videohub.prototype.getName = function () {
	return this.name;
}

Videohub.prototype.getInterfaceCount = function (inf) {
	if (typeof this.available[inf] == 'undefined') return false;
	return this.available[inf];
}

Videohub.prototype.getInterfacePort = function (inf, index) {
	var infCount = this.getInterfaceCount(inf);
	if (index < 0 || index >= infCount) return false;
	if (inf >= 1 && inf <= 5) {
		// a label
		if (typeof this.labels[inf][index] == 'undefined') return 'no label';
		else return this.labels[inf][index];
	} else if (inf >= 6 && inf <= 10) {
		// a route
		if (typeof this.routes[inf][index] == 'undefined') return (index + 1) % infCount;
		else return this.routes[inf][index];
	} else if (inf >= 11 && inf <= 15) {
		// a lock
		if (typeof this.locks[inf][index] == 'undefined') return 'U';
		else return this.locks[inf][index];
	}
}


// EXPORTS
c.videohub = Videohub;
module.exports = c;