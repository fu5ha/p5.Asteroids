function Score() {
    this.score = 0;
    this.size = floor(height/20);
    this.scoreString = "0000"

    this.draw = function() {
            push();
            textFont(SystemFont);
            textSize(this.size);
            fill(255);
            text(this.scoreString, this.size/2, this.size*3/2);
            pop();
    }

    this.increment = function() {
        this.score += 1;
        var string = this.score.toString();
        this.scoreString = "";
        for (var i = 0; i<(4-string.length); i++) {
            this.scoreString = this.scoreString + "0";
        }
        this.scoreString = this.scoreString + string;
    }
}
