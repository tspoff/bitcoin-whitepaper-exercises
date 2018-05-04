"use strict";

var crypto = require("crypto");

const hexToBinaryLookup = {
	'0': '0000',
	'1': '0001',
	'2': '0010',
	'3': '0011',
	'4': '0100',
	'5': '0101',
	'6': '0110',
	'7': '0111',
	'8': '1000',
	'9': '1001',
	'a': '1010',
	'b': '1011',
	'c': '1100',
	'd': '1101',
	'e': '1110',
	'f': '1111',
	'A': '1010',
	'B': '1011',
	'C': '1100',
	'D': '1101',
	'E': '1110',
	'F': '1111'
};

// The Power of a Smile
// by Tupac Shakur
var poem = [
	"The power of a gun can kill",
	"and the power of fire can burn",
	"the power of wind can chill",
	"and the power of a mind can learn",
	"the power of anger can rage",
	"inside until it tears u apart",
	"but the power of a smile",
	"especially yours can heal a frozen heart",
];

var difficulty = 10;

var Blockchain = {
	blocks: [],
};

// Genesis block
Blockchain.blocks.push({
	index: 0,
	hash: "000000",
	data: "",
	timestamp: Date.now(),
});

for (let line of poem) {
	let bl = createBlock(line);
	Blockchain.blocks.push(bl);
	console.log(`Hash (Difficulty: ${difficulty}): ${bl.hash}`);

	difficulty++;
}

// **********************************

function createBlock(data) {
	var bl = {
		index: Blockchain.blocks.length,
		prevHash: Blockchain.blocks[Blockchain.blocks.length-1].hash,
		data,
		timestamp: Date.now(),
		nonce: 0
	};

	bl.hash = blockHash(bl);

	let proofOfWorkFound = false;
	while (!proofOfWorkFound) {
	
		if (hashIsLowEnough(bl.hash)) {
			proofOfWorkFound = true;
		}

		else {
			bl.nonce += 1;
			bl.hash = blockHash(bl);
		}
		
	}
	return bl;
}

function blockHash(bl) {
	// TODO
	return crypto.createHash("sha256").update(
		`${bl.index};${bl.prevHash};${JSON.stringify(bl.data)};${bl.timestamp};${bl.nonce}`
	).digest("hex");
}

function hashIsLowEnough(hash) {
	let binaryHash = hexToBinary(hash);

	let leadingBits = binaryHash.substring(0,difficulty);

	if (isZeroString(leadingBits)) return true;
	else return false;
}

function hexToBinary(s) {
	var ret = '';
	for (var i = 0, len = s.length; i < len; i++) {
		ret += hexToBinaryLookup[s[i]];
	}
	return ret;
}

function isZeroString(bitString) {
	let zeroString = "";
	for (let i = 0; i < bitString.length; i++) {
		zeroString += "0";
	}

	if (bitString == zeroString) return true;
	else return false;
}

function verifyBlock(bl) {
	if (bl.data == null) return false;
	if (bl.index === 0) {
		if (bl.hash !== "000000") return false;
	}
	else {
		if (!bl.prevHash) return false;
		if (!(
			typeof bl.index === "number" &&
			Number.isInteger(bl.index) &&
			bl.index > 0
		)) {
			return false;
		}
		if (bl.hash !== blockHash(bl)) return false;
	}

	return true;
}

function verifyChain(chain) {
	var prevHash;
	for (let bl of chain.blocks) {
		if (prevHash && bl.prevHash !== prevHash) return false;
		if (!verifyBlock(bl)) return false;
		prevHash = bl.hash;
	}

	return true;
}
