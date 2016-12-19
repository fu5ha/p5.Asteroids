function Quaternion(x1, y1, x2, y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;

  this.getWidth = function() {
    return Math.abs(this.x2 - this.x1);
  }

  this.getHeight = function() {
    return Math.abs(this.y2 - this.y1);
  }
}
