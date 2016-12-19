const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_Q = 81;
const KEY_C = 67;

var ship;
var quadtree;
var col_debug = false;

var asteroids = [];
var allObjects = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	ship = new Ship();
	allObjects.push(ship);
	for (var i = 0; i<20; i++) {
		asteroids[i] = new Asteroid();
		allObjects.push(asteroids[i]);
	}

	quadtree = new Quadtree(0, new Quaternion(0,0,width,height));
}

function handleInput() {
	if (keyIsDown(LEFT_ARROW) || keyIsDown(KEY_A)) {
		ship.applyRForce(-ship.r_mag);
	}
	if (keyIsDown(RIGHT_ARROW) || keyIsDown(KEY_D)) {
		ship.applyRForce(ship.r_mag);
	}
	if (keyIsDown(UP_ARROW) || keyIsDown(KEY_W)) {
		ship.applyForce(ship.l_mag);
	}
}

function keyPressed() {
	if (keyCode === KEY_Q) {
		quadtree.debug = !quadtree.debug
	}
	if (keyCode === KEY_C) {
		col_debug = !col_debug
	}
}

function update() {
	for (object of allObjects) {
		object.update();
	}
	quadtree.update(allObjects);

	if (col_debug) {
		var colObjs = quadtree.retrieve(ship);
		for (obj of colObjs) {
			push();
			stroke(200, 0, 100);
			strokeWeight(4);
			noFill();
			translate(obj.pos.x, obj.pos.y);
			rotate(obj.a || obj.heading);
			if (obj.verts) {
				beginShape();
				for (vert of obj.verts) {
					vertex(vert.x, vert.y);
				}
				endShape(CLOSE);
			}
			pop();
		}
	}
}

function draw(){

	handleInput();


	background(20);
	update();
}
