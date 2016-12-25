function Score() {
    this.score = 0;
    this.font = "Helvetica";
    this.size = height/20;

    this.draw = function() {
        push();
        textFont(this.font);
        textSize(this.size);
        fill(255);
        text(this.score.toString(), this.size/2, this.size*3/2);
        pop();
    }

    this.increment = function() {
        this.score += 1;
    }
}
