"use strict";

var crypto = require("crypto");

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

var Blockchain = {
	blocks: [],
};

const GENESIS_BLOCK = {
	index: 0,
	hash: "000000",
	data: "",
	timestamp: Date.now(),
};

// Genesis block
Blockchain.blocks.push(GENESIS_BLOCK);

// TODO: insert each line into blockchain
for (let line of poem) {
	createBlock(line);
}

console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);


// **********************************

function blockHash(bl) {
	return crypto.createHash("sha256").update(
		// TODO: use block data to calculate hash
		`${bl.prevHash};${bl.index};${JSON.stringify(bl.data)};${bl.timestamp}`
	).digest("hex");
}

function createBlock(data) {
	let block = {
		prevHash: Blockchain.blocks[Blockchain.blocks.length - 1].hash,
		index: Blockchain.blocks.length,
		data: data,
		timestamp: Date.now(),
	}
	block.hash = blockHash(block);

	if (verifyBlock(block)) {
		Blockchain.blocks.push(block);
		return block;
	}
	else {
		return false;
	}
}

function verifyChain() {
	if (Blockchain.blocks.length === 0) {
		return false;
	}

	//Ensure genesis block has genesis properties:
	if (Blockchain.blocks[0].hash != GENESIS_BLOCK.hash ||
		Blockchain.blocks[0].index != GENESIS_BLOCK.index) {
		return false;
	}

	for (let i = 1; i < Blockchain.blocks.length; i++) {

		const prevBlock = Blockchain.blocks[i - 1];
		const currentBlock = Blockchain.blocks[i];

		if (typeof currentBlock.data != "string" ||
			currentBlock.index != i ||
			currentBlock.hash != blockHash(currentBlock) ||
			currentBlock.prevHash != prevBlock.hash ||
			currentBlock.timestamp < prevBlock.timestamp) {
			return false;
		}
	}

	return true;
}

function verifyBlock(block) {
	if (block.hash === blockHash(block) &&
		block.data != null &&
		typeof block.data === 'string'	
	) {
		return true;
	} else {
		return false;
	}
}