// TODOS
// build locking support for multiple IPs

// includes
var videohub = require('./lib/videohub.js');
var net = require('net');

// config
var simType = videohub.TYPE_SMART_VIDEOHUB;

// simulator start
var Simulator = (function (type) {
	var sim = this;
	var v = new videohub.videohub(type);
	var sockets = [];
	v.on('change', sendClientUpdate);

	function handleConnection(socket) {
		// send protocol preamble
		var dump = "PROTOCOL PREAMBLE:\n";
		dump += "Version: "+videohub.PROTOCOL_VERSION+"\n";
		dump += "\n";

		// send information about device
		dump += "VIDEOHUB DEVICE:\n";
		dump += "Device present: true\n";
		dump += "Model name: "+v.getName()+"\n";
		dump += "Video inputs: "+v.getInterfaceCount(videohub.INTERFACE_LABELS_IN)+"\n";
		dump += "Video processing units: "+v.getInterfaceCount(videohub.INTERFACE_ROUTES_PROCESS)+"\n";
		dump += "Video outputs: "+v.getInterfaceCount(videohub.INTERFACE_LABELS_OUT)+"\n";
		dump += "Video monitoring outputs: "+v.getInterfaceCount(videohub.INTERFACE_LABELS_MON_OUT)+"\n";
		dump += "Serial ports: "+v.getInterfaceCount(videohub.INTERFACE_LABELS_SERIAL)+"\n";
		dump += "\n";

		// send status dump
		for (var inf = 1; inf <= 15; inf++) {
			var block = generateStatusBlock(socket, inf);
			if (block)
				dump += block;
		}
		socket.write(dump);

		socket.data = '';
		sockets.push(socket);
		socket.on('end', function () {
			sockets.splice(sockets.indexOf(socket), 1);
		});
		socket.on('data', handleSocketData);
	}

	function handleSocketData(data) {
		this.data += data.toString();
		var blocks = this.data.split("\n\n");
		
		// process blocks
		while (blocks.length > 1) {
			// block is a update request block
			var block = blocks.splice(0, 1);
			var lines = block[0].split("\n");
			if (lines[0] == '') // remove initial blank line
				lines.splice(0, 1);
			if (lines[0] == 'PING:') {
				this.write("ACK\n\n");
			} else if (typeof videohub.blockTitlesDecode[lines[0]] != 'undefined') {
				// this block header is recognized
				var inf = videohub.blockTitlesDecode[lines[0]];
				if (lines.length == 1) {
					// this is a status request block
					var statusBlock = generateStatusBlock(this, inf);
					if (statusBlock) {
						this.write("ACK\n\n");
						this.write(statusBlock);
					}
				} else {
					// this is an update block
					lines.splice(0, 1);
					var hasFailed = false;
					for (l in lines) {
						// handle the updates
						var tl = lines[l];
						var firstSpace = tl.indexOf(" ");
						var index = parseInt(tl.substr(0, firstSpace));
						var value = tl.substr(firstSpace+1);
						var validUpdate = v.queueUpdate(inf, index, value);
						if (!validUpdate) break;
					}
					if (validUpdate) {
						this.write("ACK\n\n");
						v.doUpdate();
					} else {
						this.write("NAK\n\n");
						v.clearUpdates();
					}
				}
			} else {
				// the block header given is unimplemented or non-standard
				// and should be ignored (according to spec)
			}
		}
		this.data = blocks[0];
	}

	function sendClientUpdate(update) {

		// build the update message
		var output = "";
		for (var i = 0; i < 15; i++) { // iterate through all the updated interfaces
			if (update[i].length == 0) continue;
			var inf = i+1;
			output += videohub.blockTitlesEncode[inf]+"\n";
			for (var n = 0; n < v.getInterfaceCount(inf); n++) { // iterate through each port
				if (typeof update[i][n] != 'undefined')
					output += n+" "+v.getInterfacePort(inf, n)+"\n";
			}
			output += "\n";
		}

		// send it to all the clients
		for (s in sockets) {
			sockets[s].write(output);
		}
	}

	function generateStatusBlock(socket, inf) {
		if (!v.getInterfaceCount(inf)) return false;
		var output = videohub.blockTitlesEncode[inf]+"\n";
		for (var p = 0; p < v.getInterfaceCount(inf); p++) {
			output += p+' '+v.getInterfacePort(inf, p)+"\n";
		}
		output += "\n";
		return output;
	}

	return {
		handleConnection: handleConnection
	}
})(simType);

var server = net.createServer(Simulator.handleConnection);
server.listen(9990);
