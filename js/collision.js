function axisSeparatesPolys(axis, a, b) {

	var a = polyIntervalOnAxis(axis,a);
	var b = polyIntervalOnAxis(axis,b);
	var separating = (a[0] > b[1]) || (b[0] > a[1]);
	return separating;
}

function axisSeparatesPolyCircle(axis,p,c) {
	var a = polyIntervalOnAxis(axis,p);
	var b = circleIntervalOnAxis(axis,c);
	var separating = (a[0] > b[1]) || (b[0] > a[1]);
	return separating;
}

function dot(a,b) {
	return a.x*b.x + a.y*b.y;
}

function polyIntervalOnAxis(axis, p) {
	var points = p.map(function(vert) {
		return dot(vert,axis);
	});
	return [min(points), max(points)];
}

function circleIntervalOnAxis(axis, c) {
	var d = dot(c.pos,axis);
	var points = [-c.r + d, c.r + d];
	return [min(points), max(points)];
}

function detectCollisionPolyPoly(a, b) {
	for (var i = 0; i < a.length; i++) {
		var indexLast = mod((i-1), a.length);
		var edgeDir = createVector(a[i].x - a[indexLast].x, a[i].y - a[indexLast].y);
		var normal = createVector(edgeDir.y, -edgeDir.x);

		if (axisSeparatesPolys(normal, a, b)) return false;
		if (col_debug) {
			push();
			stroke(200,0,100);
			strokeWeight(2);
			translate((a[i].x + a[indexLast].x) / 2, (a[i].y + a[indexLast].y) / 2);
			line(0,0,normal.x,normal.y);
			pop();
		}
	}
	for (var i = 0; i < b.length; i++) {
		var indexLast = mod((i-1), b.length);
		var edgeDir = createVector(b[i].x - b[indexLast].x, b[i].y - b[indexLast].y);
		var normal = createVector(edgeDir.y, -edgeDir.x);

		if (axisSeparatesPolys(normal, a, b)) return false;
		if (col_debug) {
			push();
			stroke(200,0,100);
			strokeWeight(2);
			translate((b[i].x + b[indexLast].x) / 2, (b[i].y + b[indexLast].y) / 2);
			line(0,0,normal.x,normal.y);
			pop();
		}
	}
	return true;
}

function detectCollisionCircleCircle(a,b) {
	var axis = b.pos.copy().sub(a.pos);
  var dist = axis.mag();
  if (dist > (a.r + b.r)) return false;
  if (col_debug) {
    push();
    stroke(200,0,100);
    strokeWeight(2);
    translate(a.pos.x,a.pos.y);
    line(0,0,axis.x,axis.y);
    pop();
  }
	return true;

}

function detectCollisionCirclePoly(c, p) {
	var radSq = pow(c.r,2);
	var minDist = Number.MAX_VALUE;
	var nearestVert = -1;
	for (var i = 0; i < p.length; i++) {
		var dist = pow(c.pos.x - p[i].x,2) + pow(c.pos.y - p[i].y,2) - radSq;
		if (dist <= 0) {
			return true;
		} else if (dist < minDist) {
			nearestVert = vert;
			minDist = dist;
		}
	}

	var vert = p[nearestVert];

	for (var i = 0; i < p.length; i++) {
		var indexLast = mod((i-1), p.length);
		var edgeDir = createVector(p[i].x - p[indexLast].x, p[i].y - p[indexLast].y);
		var normal = createVector(edgeDir.y, -edgeDir.x);

		if (axisSeparatesPolyCircle(normal, p, c)) return false;
		if (col_debug) {
			push();
			stroke(200,0,100);
			strokeWeight(2);
			translate((p[i].x + p[indexLast].x) / 2, (p[i].y + p[indexLast].y) / 2);
			line(0,0,normal.x,normal.y);
			pop();
		}
	}
	return true;
}
