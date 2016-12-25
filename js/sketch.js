const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_Q = 81;
const KEY_C = 67;
const KEY_SPACE = 32;

const HITBOX_POLY = 4;
const HITBOX_CIRCLE = 5;

var ship;
var quadtree;
var col_debug = false;
var qt_objs = [];

var params = {timescale: 1};

var asteroids = [];
var allObjects = [];
var fr = 60;
var score;
var gameover = false;

var mod = function (n, m) {
    var remain = n % m;
    return Math.floor(remain >= 0 ? remain : remain + m);
};

function setup() {
	createCanvas(windowWidth, windowHeight);
	ship = new Ship();
  score = new Score();
	allObjects.push(ship);
	for (var i = 0; i<15; i++) {
		asteroids[i] = new Asteroid();
		allObjects.push(asteroids[i]);
	}

	quadtree = new Quadtree(0, new Quaternion(0,0,width,height));
	fr = getFrameRate();
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
		quadtree.debug = !quadtree.debug;
	}
	if (keyCode === KEY_C) {
		col_debug = !col_debug;
	}
	if (keyCode === KEY_SPACE) {
		ship.fire();
	}
}

function detectShipCollisions() {

	var quadObjs = quadtree.retrieve(ship);
	if (col_debug) {
		for (obj of quadObjs) {
			obj.draw(50,150,125);
		}
	}/*
	var quadObjs = [];
	for (object of allObjects) {
		quadObjs.push(object);
		if (object.children != null) {
			for (child of object.children) {
				quadObjs.push(child);
			}
		}
	}*/
	var colObjs = quadObjs.filter(function(obj) {

		var colliding = false;

		var shipPoly = ship.verts.map(function(vert) {
			return createVector((vert.x*cos(ship.a) - vert.y*sin(ship.a))+ship.pos.x, (vert.x*sin(ship.a) + vert.y*cos(ship.a))+ship.pos.y);
		});

		if (obj.hitboxType == HITBOX_POLY) {
			var objPoly = obj.verts.map(function(vert) {
				return createVector((vert.x*cos(obj.a) - vert.y*sin(obj.a))+obj.pos.x, (vert.x*sin(obj.a) + vert.y*cos(obj.a))+obj.pos.y);
			});

			colliding = detectCollisionPolyPoly(objPoly,shipPoly);
		} else if (obj.hitboxType == HITBOX_CIRCLE) {
			var objCircle = new Circle(obj.pos, obj.r);

			colliding = detectCollisionCirclePoly(objCircle, shipPoly);
		}

		return colliding;
	});
	if (colObjs.length > 0) {
		if (col_debug) {
			ship.draw(200,1,100);
			for (obj of colObjs) {

				obj.draw(200,1,100);

			}
		} else {
			ship.destruct(params);
			gameover = true;
		}
	}
}

function detectLaserCollisions() {
	ship.children.forEach(function(laser) {
		var quadObjs = quadtree.retrieve(laser);
		if (col_debug) {
			quadObjs.forEach(function(obj) {
				obj.draw(1,100,125);
			});
		}

		var colObjs = quadObjs.filter(function(obj) {
			if (obj == ship) {
				return false;
			}
			var colliding = false;
			var laserCircle = new Circle(laser.pos, laser.r);
			if (obj.hitboxType == HITBOX_POLY) {
				var objPoly = obj.verts.map(function(vert) {
					return createVector((vert.x*cos(obj.a) - vert.y*sin(obj.a))+obj.pos.x, (vert.x*sin(obj.a) + vert.y*cos(obj.a))+obj.pos.y);
				});

				colliding = detectCollisionCirclePoly(laserCircle,objPoly);
			} else if (obj.hitboxType == HITBOX_CIRCLE) {
				var objCircle = new Circle(obj.pos, obj.r);

				colliding = detectCollisionCircleCircle(objCircle, laserCircle);
			}

			return colliding;
		});
		if (colObjs.length > 0) {
			if (col_debug) {
				laser.draw(200,150,100);
			} else {
				laser.destruct();
			}
			for (obj of colObjs) {
				if (col_debug) {
					obj.draw(200,150,100);
				} else {
					var new_asteroids = obj.destruct();
					asteroids.splice(asteroids.indexOf(obj),1);
					allObjects.splice(allObjects.indexOf(obj),1);
					obj = null;
					if (new_asteroids) {
						new_asteroids.forEach(function(asteroid) {
							asteroids.push(asteroid);
							allObjects.push(asteroid);
						});
					} else {
            score.increment();
					}
				}
			}
		}
	});
}

function update() {
	var centis = floor(0.1 * millis());
	if (centis % 400 == 0) {
		var newAst = new Asteroid();
		asteroids.push(newAst);
		allObjects.push(newAst);
	}
	fr = getFrameRate();
	qt_objs = [];
	for (object of allObjects) {
		object.update(fr,params.timescale);
		qt_objs.push(object);
		if (object.children != null) {
			for (child of object.children) {
				qt_objs.push(child);
			}
		}
	}
  score.draw();
	quadtree.update(qt_objs);

	if (!gameover) {
		detectShipCollisions();
	}
	detectLaserCollisions();
}

function draw(){

	handleInput();


	background(20);
	update();
}
