function Ship() {
	this.r = 10;
	this.l = this.r*2.25;
	this.pos = createVector(windowWidth/2, windowHeight/2);
	this.vel = createVector(0,0);
	this.acc = createVector(0, 0);
	this.heading = 0;
	this.avel = 0;
	this.aacc = 0;
	this.mass = 10;
	this.r_mag = 0.042;
	this.l_mag = 1.5;

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
		var force = createVector(cos(this.heading), sin(this.heading)).setMag(mag);
		var da = force.div(this.mass);
		this.acc.add(da);
	}

	this.applyRForce = function(mag) {
		var acc = mag/this.mass;
		this.aacc += acc;
	}

  this.update = function() {
		this.move();
		this.edges();
    this.draw();
  }

	this.move = function() {
		var fr = getFrameRate()
		this.vel.add(createVector(this.vel.x,this.vel.y).setMag(-1/6*this.vel.mag()).div(this.mass*3));
		this.applyRForce(-1/3.5*this.avel);
		this.vel.add(this.acc).limit(6);
		this.pos.add(this.vel.x*61/(fr+1),this.vel.y*61/(fr+1));
		this.avel += this.aacc;
		this.heading += (this.avel*61/(fr+1));
		this.acc = createVector(0,0);
		this.aacc = 0;
	}

	this.draw = function() {
		push();
		stroke(200);
		strokeWeight(2);
		noFill();
		translate(this.pos.x, this.pos.y);
		rotate(this.heading);
		beginShape();
		vertex(-this.l/3, this.r);
		vertex(-this.l/3, -this.r);
		vertex(this.l*2/3, 0);
		endShape(CLOSE);
		pop();
	}
}
