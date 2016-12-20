function Asteroid(pos,r,vel,aVel) {
  this.pos = pos || createVector(random(0,width), random(0,height));
  this.r = r || random(Math.min(width,height)*0.025,Math.min(width,height)*0.06);
  this.a = random(0,2*PI);
  this.vMag = vel != null ? vel.magSq() : random(0.5,2);
  this.vel = vel || p5.Vector.random2D().mult(this.vMag);
  this.aVel = aVel != null ? aVel : random(-0.01,0.01);
  this.minSize = Math.min(width,height)*0.02;
  // Generate verts
  this.nVerts = floor(random(8,15));
  this.verts = [];
  for (var i = 0; i<this.nVerts; i++) {
    var offset = createVector(random()*this.r/2, random()*this.r/2, random(-PI/(1.5*this.nVerts), PI/(1.5*this.nVerts)));
    var x = this.r * cos(map(i, 0,this.nVerts, 0,2*PI)+offset.z) + offset.x;
    var y = this.r * sin(map(i, 0,this.nVerts, 0,2*PI)+offset.z) + offset.y;
    this.verts[i] = createVector(x,y);
  }

  var center = createVector();
  var area = 0;
  for (var i = 0; i < this.verts.length - 1; i++) {
    area += (this.verts[i].x*this.verts[i+1].y - this.verts[i+1].x*this.verts[i].y)
  }
  area *= 0.5

  for (var i=0; i< this.verts.length - 1; i++) {
    center.x += (this.verts[i].x + this.verts[i+1].x)*(this.verts[i].x*this.verts[i+1].y - this.verts[i+1].x*this.verts[i].y)
    center.y += (this.verts[i].y + this.verts[i+1].y)*(this.verts[i].x*this.verts[i+1].y - this.verts[i+1].x*this.verts[i].y)
  }
  center.x *= 1/(6*area)
  center.y *= 1/(6*area)

  this.verts = this.verts.map(function(value) {
    return createVector(value.x - center.x, value.y - center.y)
  });

  this.vertDistFromCenter = []
  for (var i=0; i<this.verts.length; i++) {
    this.vertDistFromCenter[i] = dist(center.x, center.y, this.verts[i].x, this.verts[i].y)
  }

  function average(data) {
    var sum = data.reduce(function(sum, value) {
      return sum + value;
    }, 0);

    return sum / data.length;
  }

  function stDev(data) {
    var avg = average(data)

    var sqDiffs =  data.map(function(value){
      var diff = value-avg;
      return pow(diff,2);
    });
    return sqrt(average(sqDiffs));
  }

  this.stdDev = stDev(this.vertDistFromCenter);
  this.hitboxType = this.stdDev > 6 ? HITBOX_POLY : HITBOX_CIRCLE;

  this.update = function(fr,ts) {
    this.move(fr,ts);
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

  this.destruct = function() {
    if (this.r*sqrt(1/2) < this.minSize) {
      return false;
    } else {
      var a1 = random(0.3,0.7);
      var a2 = 1-a1;
      var r1 = sqrt(a1)*this.r;
      var r2 = sqrt(a2)*this.r;
      var k = random(0.5,2);
      var j = random(0.5,1);
      var a = this.a + PI/2;
      var dVec1Mag = r1+random(r1/8,r1/4)
      var dVec1 = p5.Vector.fromAngle(a).setMag(dVec1Mag);
      var dVec2Mag = r2+random(r1/8,r1/4)
      var dVec2 = p5.Vector.fromAngle(a+PI).setMag(dVec2Mag);
      var dVecMult = random(0.02,0.04)
      var n1 = new Asteroid(this.pos.copy().add(dVec1), r1, this.vel.copy().add(dVec1.copy().mult(dVecMult)).setMag(this.vMag*j), this.aVel*k);
      var n2 = new Asteroid(this.pos.copy().add(dVec2), r2, this.vel.copy().add(dVec2.copy().mult(dVecMult)).setMag(this.vMag*(1-j)), this.aVel/-k);
      return [n1,n2];
    }
  }

  this.move = function(fr,ts) {
    this.pos.add(this.vel.copy().mult(61*ts/(fr+1)));
    this.a += this.aVel*61*ts/(fr+1);
  }

  this.draw = function(r,g,b) {
    push();
    stroke(r||200,g||200,b||200);
    strokeWeight(2);
    noFill();
    translate(this.pos.x, this.pos.y);
    rotate(this.a);
    beginShape();
    for (vert of this.verts) {
      vertex(vert.x, vert.y);
    }
    endShape(CLOSE);

    /*
    if (this.hitboxType == HITBOX_CIRCLE) {
      ellipseMode(RADIUS)
      ellipse(0,0,this.r,this.r);
    } else if (this.hitboxType == HITBOX_POLY) {
      beginShape();
      for (vert of this.verts) {
        vertex(vert.x, vert.y);
      }
      endShape(CLOSE);
    }
    */


    pop();
  }
}
