var repl = require('repl');
var color = require('ansi-color').set;

function Presentation(slides) {
    this.slides = slides || [];
    this.index = 0;
}

Presentation.prototype.add = function(slide) { this.slides.push(slide); }
Presentation.prototype.show = function() { this.slides[this.index].show(); }
// advance to next slide and show it
Presentation.prototype.f = function() {
    if (this.index === this.slides.length-1) {
        console.log(color("At the end.", "red+bold"))
        return;
    }
    this.index += 1;
    this.show();
}
// rewind to previous slide and show it
Presentation.prototype.r = function() {
    if (this.index === 0) {
        console.log(color("At the beginning", "red+bold"));
        return;
    }
    this.index -= 1;
    this.show();
};
Presentation.prototype.first = function() { this.index = 0; }
Presentation.prototype.start = function() { repl.start(prompt='> ').context.p = this; }

function Slide(title, content) {
    this.title = title;
    this.content = content;
}

Slide.prototype.show = function() {
    console.log(color(this.title, "green+bold"));
    if (typeof this.content === 'object') {
        for (key in this.content) {
            console.log(color("\t"+this.content[key], "white+bold"));
        }
    }
    else {
        console.log(color("\t"+this.content, "white+bold"));
    }
}


var pres = new Presentation();

exports.pres = pres;
exports.Slide = Slide;
