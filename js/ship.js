function Ship() {
	this.hitboxType = HITBOX_POLY;
	this.r = 10;
	this.l = this.r*2.25;
	this.pos = createVector(windowWidth/2, windowHeight/2);
	this.vel = createVector(0,0);
	this.acc = createVector(0, 0);
	this.a = 0;
	this.avel = 0;
	this.aacc = 0;
	this.mass = 10;
	this.r_mag = 0.042;
	this.l_mag = 1.5;
	this.nVerts = 3;
	this.verts = [createVector(-this.l/3, this.r),
								createVector(-this.l/3, -this.r),
								createVector(this.l*2/3, 0)];

	this.children = [];

	this.fire = function() {
		var tip = p5.Vector.fromAngle(this.a).setMag(this.l*2/3 + 5).add(this.pos);
		var laser = new Laser(tip.copy(), this.a,this);
		this.children.push(laser);
		return laser;
	}

	this.destruct = function(params) {
		params.timescale = 0.05;
	}

	this.destroy = function(laser) {
		var index = this.children.indexOf(laser);
		this.children[index] = null;
		this.children.splice(index,1);
	}

	this.edges = function() {
		if (this.pos.x + this.r < 0) {
			this.pos.x = width + this.r;
		} else if (this.pos.x - this.r > width) {
			this.pos.x = -this.r;
		}

		if (this.pos.y - this.r > height) {
			this.pos.y = -this.r;
		} else if (this.pos.y + this.r < 0) {
			this.pos.y = height + this.r;
		}
	}


	this.applyForce = function(mag) {
		var force = createVector(cos(this.a), sin(this.a)).setMag(mag);
		var da = force.div(this.mass);
		this.acc.add(da);
	}

	this.applyRForce = function(mag) {
		var acc = mag/this.mass;
		this.aacc += acc;
	}

  this.update = function(fr,ts) {
		this.children.forEach(function(child) {
			child.update(fr,ts);
		});
		this.move(fr,ts);
		this.edges();
    this.draw();
  }

	this.move = function(fr,ts) {
		this.vel.add(createVector(this.vel.x,this.vel.y).setMag(ts*-1/6*this.vel.mag()).div(this.mass*3));
		this.applyRForce(-1/3.5*this.avel);
		this.vel.add(this.acc.copy().mult(ts)).limit(5);
		this.pos.add(this.vel.copy().mult(61*ts/(fr+1)));
		this.avel += this.aacc*ts;
		this.a += (this.avel*61*ts/(fr+1));
		this.acc = createVector(0,0);
		this.aacc = 0;
	}

	this.draw = function(r,g,b) {
		push();
		stroke(r||200, g||200, b||200);
		strokeWeight(2);
		noFill();
		translate(this.pos.x, this.pos.y);
		rotate(this.a);
		beginShape();
		vertex(this.verts[0].x, this.verts[0].y);
		vertex(this.verts[1].x, this.verts[1].y);
		vertex(this.verts[2].x, this.verts[2].y);
		endShape(CLOSE);
		pop();
	}
}
