function Laser(pos,a,ship) {
  this.pos = pos || createVector(0,0);
  this.a = a != null ? a : 0;
  this.vMag = 8;
  this.vel = p5.Vector.fromAngle(a).setMag(this.vMag);
  this.r=3;
  this.hitboxType = HITBOX_CIRCLE;
  this.lifespan = 4;
  this.timeAlive = 0;
  this.ship = ship;

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

  this.destruct = function() {
    ship.destroy(this);
  }

  this.update = function(fr,ts) {
    if (this.timeAlive >= this.lifespan) {
      this.destruct();
		}
    this.move(fr,ts);
    this.edges();
    this.draw();
    this.timeAlive += ts/fr;
  }

  this.move = function(fr,ts) {
    this.pos.add(this.vel.copy().mult(61*ts/(fr+1)));
    this.a += this.aVel*ts*61/(fr+1);
  }

  this.draw = function(r,g,b) {
    push();
    stroke(r || 200, g||200, b||200);
    strokeWeight(this.r*2);
    point(this.pos.x,this.pos.y);
    pop();
  }
}
