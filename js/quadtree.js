function Quadtree(level, bounds) {
  this.nodes = [];
  this.MAX_LEVELS = 3;
  this.MAX_SIZE = 4;
  this.level = level;
  this.objects = [];
  this.bounds = bounds;
  this.debug = false;

  this.clear = function() {
    this.objects = [];
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].clear;
    }
    this.nodes = [];
  }

  this.subdivide = function() {
    var halfWidth = floor(this.bounds.getWidth()/2);
    var halfHeight = floor(this.bounds.getHeight()/2);
    var x = floor(this.bounds.x1);
    var y = floor(this.bounds.y1);

    this.nodes[0] = new Quadtree(this.level + 1, new Quaternion(x+halfWidth, y, x+halfWidth*2, y+halfHeight));
    this.nodes[1] = new Quadtree(this.level + 1, new Quaternion(x,y, x+halfWidth,y+halfHeight));
    this.nodes[2] = new Quadtree(this.level + 1, new Quaternion(x,y+halfHeight,x+halfWidth,y+halfHeight*2));
    this.nodes[3] = new Quadtree(this.level + 1, new Quaternion(x+halfWidth, y+halfHeight, x+halfWidth*2, y+halfHeight*2));
  }

  this.getIndecies = function(object) {
    var xMid = this.bounds.x1 + this.bounds.getWidth()/2;
    var yMid = this.bounds.y1 + this.bounds.getHeight()/2;

    var fitMidVert = (object.pos.y + object.r > yMid && object.pos.y - object.r < yMid) ? 1 : 0;
    var fitTop = (object.pos.y + object.r < yMid) && (fitMidVert == 0) ? 2 : 0;
    var fitBot = (object.pos.y - object.r > yMid) && (fitMidVert == 0) ? 4 : 0;
    var fitMidHoriz = (object.pos.x + object.r > xMid && object.pos.x - object.r < xMid) ? 8 : 0;
    var fitLeft = (object.pos.x + object.r < xMid) && (fitMidHoriz == 0) ? 16 : 0;
    var fitRight = (object.pos.x - object.r > xMid) && (fitMidHoriz == 0) ? 32 : 0;

    var sum = fitTop + fitBot + fitLeft + fitRight + fitMidVert + fitMidHoriz;

    var lut = [];
    lut[34] = [0];
    lut[18] = [1];
    lut[20] = [2];
    lut[36] = [3];
    lut[9] = [0,1,2,3];
    lut[17] = [1,2];
    lut[33] = [0,3];
    lut[10] = [0,1];
    lut[12] = [2,3];


    return lut[sum];
  }

  this.insert = function(obj) {
    if (this.nodes[0]) {
      var i = this.getIndecies(obj);
      if (i != null) {
        for (index of i) {
          this.nodes[index].insert(obj);
        }
        return;
      }
    }

    this.objects.push(obj);

    if ((this.objects.length > this.MAX_SIZE) && (this.level < this.MAX_LEVELS)) {
      if (!this.nodes[0]) {
        this.subdivide();
      }

      for (var n = this.objects.length - 1; n >= 0; n--) {
        var i = this.getIndecies(this.objects[n]);
        if (i != null) {
          for (index of i) {
            this.nodes[index].insert(this.objects[n]);
          }
          this.objects.splice(n,1);
        }
      }
    }
  }

  this.retrieve = function(targetObj) {
    var retObjs = [];
    var i = this.getIndecies(targetObj);
    if (i != null && this.nodes[0]) {
      for (index of i) {
        var nextObjs = this.nodes[index].retrieve(targetObj);
        for (obj of nextObjs) {
          retObjs.push(obj);
        }
      }
    }

    for (obj of this.objects) {
      var dist = (pow((obj.pos.x - targetObj.pos.x),2) + pow((obj.pos.y - targetObj.pos.y),2));
      if ((dist < pow(targetObj.r,2)*8 + pow(obj.r, 2)*8) && (obj != targetObj)) {
        retObjs.push(obj);
      }
    }

    return retObjs;
  }

  this.draw = function() {
    push();
    noFill();
    stroke(10,150,250*(this.level+1)/this.MAX_LEVELS);
    strokeWeight(this.MAX_LEVELS/this.level+1 * 2/this.MAX_LEVELS);
    rect(this.bounds.x1, this.bounds.y1, this.bounds.getWidth(), this.bounds.getHeight());
    for (node of this.nodes) {
      node.draw();
    }
  }

  this.update = function(allObjects) {
    this.clear();
    for (var i = 0; i < allObjects.length; i++) {
      this.insert(allObjects[i]);
    }
    if (this.debug) {
      this.draw();
    }
  }
}
