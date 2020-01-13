"use strict";

/* Variables declared here */
var myGameArea = {
	canvas: document.getElementById("canvas"),
	unit: 15,

	start: function() {
		this.canvas.style.display = "block";
		document.getElementById("startButton").style.display = "none";
		this.context = this.canvas.getContext("2d");
		this.interval = setInterval(updateGameArea, 80);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
};
var apple = {
	x: 0,
	y: 0,
	size: myGameArea.unit - 1,

	draw: function(color="red") {
		const ctx = myGameArea.context;
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.size, this.size);
		ctx.fillStyle = color;
		ctx.fill();
	},
	create: function() {
		var covered;
		do {
			covered = false;
			this.x = Math.floor(Math.random() * myGameArea.canvas.width /
			     myGameArea.unit) * myGameArea.unit;
			this.y = Math.floor(Math.random() * myGameArea.canvas.height /
			     myGameArea.unit) * myGameArea.unit;

			let block;
			for (block of snake.body) {
				if (this.x === block.x && this.y === block.y) {
					covered = true;
					break;
				}
			}
		}
		while (covered);
	}
};
var snake = {
	body: [{x: Math.floor(myGameArea.canvas.width / myGameArea.unit / 2) *
		       myGameArea.unit,
		    y: Math.floor(myGameArea.canvas.height / myGameArea.unit / 2) *
		       myGameArea.unit}],
	blockSize: myGameArea.unit - 1,
	direction: {dx: 0, dy: 0},

	growthLength: 4,

	draw: function(color="green") {
		const ctx = myGameArea.context;
		ctx.beginPath();
		let block;
		for (block of this.body) {
			ctx.rect(block.x, block.y, this.blockSize, this.blockSize);
			ctx.fillStyle = color;
			ctx.fill();
		}
	},
	move: function() {
		const head = this.body[0];
		this.body.unshift({x: head.x + this.direction.dx,
			               y: head.y + this.direction.dy});
		this.body.pop();
	},
	grow: function() {
		const tail = this.body[this.body.length - 1];

		let i;
		for (i = 0; i < this.growthLength; i++) {
			this.body.push({x: tail.x, y: tail.y});
		}
	},
	checkFeast: function() {
		if (apple.x !== this.body[0].x ||
			apple.y !== this.body[0].y) {  // snake head is not on apple
			return;
		}
		this.grow();
		apple.create();
	}
};

/* Keyboard events */
window.onkeydown = function(evt) {
	evt = evt || window.event;
	if (evt.keyCode == 38 &&                              // up, and
		snake.direction.dy != myGameArea.unit) {          // not going down
		snake.direction.dx = 0;
		snake.direction.dy = -myGameArea.unit;
	} else if (evt.keyCode == 40 &&                       // down, and
		       snake.direction.dy != -myGameArea.unit) {  // not going up
		snake.direction.dx = 0;
		snake.direction.dy = myGameArea.unit;
	} else if (evt.keyCode == 37 &&                       // left, and
		       snake.direction.dx != myGameArea.unit) {   // not going right
		snake.direction.dx = -myGameArea.unit;
		snake.direction.dy = 0;
	} else if (evt.keyCode == 39 &&                       // right, and
		       snake.direction.dx != -myGameArea.unit) {  // not going left
		snake.direction.dx = myGameArea.unit;
		snake.direction.dy = 0;
	}
}

/* Check lose functions */
function hitWalls() {
	const head = snake.body[0];
	if (0 <= head.x && head.x < myGameArea.canvas.width &&
		0 <= head.y && head.y < myGameArea.canvas.height) {
		return false;
	}
	return true;
}
function hitBody() {
	const head = snake.body[0];
	const length = snake.body.length;

	if (length === 1) { return false; }

	let block;
	let i;
	for (i = 1; i < length; i++) {
		block = snake.body[i];
		if (head.x === block.x && head.y === block.y) {
			return true;
		}
	}
	return false;
}
function checkLose() {
	return hitWalls() || hitBody();
}
/*function checkWin() {
	if (myGameArea.canvas.width / myGameArea.unit *
		myGameArea.canvas.height / myGameArea.unit <=
		snake.body.length) {  // snake body fills up canvas
		return true;
	}
	return false;
}*/

/* Game functions */
function startGame() {
	apple.create();
	myGameArea.start();
}
function updateGameArea() {
	if (checkLose()) {
		clearInterval(myGameArea.interval);
		apple.draw("gray");
		snake.draw("darkgray");
		return;
	}

	snake.checkFeast();

	myGameArea.clear();
	apple.draw();
	snake.move();
	snake.draw();
}