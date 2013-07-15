module.exports = {
	// misc
	PROTOCOL_VERSION: '2.1',

	// hardware models
	TYPE_MICRO_VIDEOHUB: 1,
	TYPE_SMART_VIDEOHUB: 2,

	// interfaces
	INTERFACE_LABELS_IN: 1,
	INTERFACE_LABELS_OUT: 2,
	INTERFACE_LABELS_MON_OUT: 3,
	INTERFACE_LABELS_SERIAL: 4,
	INTERFACE_LABELS_FRAME: 5,
	INTERFACE_ROUTES_VIDEO_OUT: 6,
	INTERFACE_ROUTES_MON_OUT: 7,
	INTERFACE_ROUTES_SERIAL: 8,
	INTERFACE_ROUTES_FRAME: 9,
	INTERFACE_ROUTES_PROCESS: 10,
	INTERFACE_LOCKS_VIDEO_OUT: 11,
	INTERFACE_LOCKS_MON_OUT: 12,
	INTERFACE_LOCKS_SERIAL: 13,
	INTERFACE_LOCKS_FRAME: 14,
	INTERFACE_LOCKS_PROCESS: 15,

	models: {
		1: { // micro vh
			name: "Blackmagic Micro Videohub"
		},
		2: { // smart vh
			name: "Blackmagic Smart Videohub",
			1: 16, // input labels
			2: 16, // output labels
			3: 0, // monitor labels
			4: 0, // serial labels
			5: 0, // frame buffer labels
			6: 16, // video routes
			7: 0, // monitor routes
			8: 0, // serial routes
			9: 0, // frame routes
			10: 0, // processing routes
			11: 16, // video locks
			12: 0, // monitor locks
			13: 0, // serial locks
			14: 0, // frame locks
			15: 0 // process locks
		}
	},

	blockTitlesDecode: {
		'INPUT LABELS:': 1,
		'OUTPUT LABELS:': 2,
		'MONITORING OUTPUT LABELS:': 3,
		'SERIAL PORT LABELS:': 4,
		'FRAME LABELS:': 5,
		'VIDEO OUTPUT ROUTING:': 6,
		'VIDEO MONITORING OUTPUT ROUTING:': 7,
		'SERIAL PORT ROUTING:': 8,
		'FRAME BUFFER ROUTING:': 9,
		'PROCESSING UNIT ROUTING:': 10,
		'VIDEO OUTPUT LOCKS:': 11,
		'MONITORING OUTPUT LOCKS:': 12,
		'SERIAL PORT LOCKS:': 13,
		'PROCESSING UNIT LOCKS:': 14,
		'FRAME BUFFER LOCKS:': 15
	},

	blockTitlesEncode: {
		1: 'INPUT LABELS:',
		2: 'OUTPUT LABELS:',
		3: 'MONITORING OUTPUT LABELS:',
		4: 'SERIAL PORT LABELS:',
		5: 'FRAME LABELS:',
		6: 'VIDEO OUTPUT ROUTING:',
		7: 'VIDEO MONITORING OUTPUT ROUTING:',
		8: 'SERIAL PORT ROUTING:',
		9: 'FRAME BUFFER ROUTING:',
		10: 'PROCESSING UNIT ROUTING:',
		11: 'VIDEO OUTPUT LOCKS:',
		12: 'MONITORING OUTPUT LOCKS:',
		13: 'SERIAL PORT LOCKS:',
		14: 'PROCESSING UNIT LOCKS:',
		15: 'FRAME BUFFER LOCKS:'
	},

	emptyUpdate: [
		[],
		[],
		[],
		[],
		[],
		[],
		[],
		[],
		[],
		[],
		[],
		[],
		[],
		[],
		[]
	]
}