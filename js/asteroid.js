function Asteroid() {
  this.pos = createVector(random(0,width), random(0,height));
  this.r = random(35,75);
  this.a = random(0,2*PI);
  this.vMag = random(0.5,2);
  this.vel = p5.Vector.random2D().mult(this.vMag);
  this.aVel = random(-0.01,0.01);

  // Generate verts
  this.nVerts = floor(random(8,15));
  this.verts = [];
  for (var i = 0; i<this.nVerts; i++) {
    var offset = createVector(random()*this.r/2, random()*this.r/2, random(-PI/(1.5*this.nVerts), PI/(1.5*this.nVerts)));
    var x = this.r * cos(map(i, 0,this.nVerts, 0,2*PI)+offset.z) + offset.x;
    var y = this.r * sin(map(i, 0,this.nVerts, 0,2*PI)+offset.z) + offset.y;
    this.verts[i] = createVector(x,y);
  }

  this.center = createVector();
  this.area = 0;
  for (vert of this.verts) {

  }

  this.update = function() {
    this.move();
    this.edges();
    this.draw();
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

  this.move = function() {
    var fr = getFrameRate();
    this.pos.add(this.vel.x*61/(fr+1),this.vel.y*61/(fr+1));
    this.a += this.aVel*61/(fr+1);
  }

  this.draw = function() {
    push();
    stroke(200);
    strokeWeight(2);
    noFill();
    translate(this.pos.x, this.pos.y);
    rotate(this.a);
    beginShape();
    for (vert of this.verts) {
      vertex(vert.x, vert.y);
    }
    endShape(CLOSE);
    //ellipseMode(RADIUS)
    //ellipse(0,0,this.r,this.r);
    pop();
  }
}
