let isHovering = function(points, transformed) {
    let collision = false;

    for(let i = 0; i<points.length; i++){
        let vc = points[i];
        let vn = (i+1 == points.length)? points[0] : points[i+1];
        let px = transformed != false? (mouseListener.mouseX - (gameCamera.xOffset * gameCamera.scale)) / gameCamera.scale : mouseListener.mouseX;
        let py = transformed != false? (mouseListener.mouseY - (gameCamera.yOffset * gameCamera.scale)) / gameCamera.scale : mouseListener.mouseY;
        if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) && (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
            collision = !collision;
        }
    }
    return(collision);
}

let uiManager = {
    elements: [],
    hoveringOverUi: false,
    add: function(element) {
        this.elements[this.elements.length] = element;
    },
    tick() {
        this.hoveringOverUi = false;
        for(let i = 0; i < this.elements.length; i++){
            let element = this.elements[i];

            if(!element.active){
                this.elements.splice(i, 1);
                continue;
            }

            element.tick();
        }
    },
    render() {
        for(let i = 0; i < this.elements.length; i++){
            this.elements[i].render();
        }
    },

};

class UIButton {
    points = [];
    active = true;
    trigger = function() {
        console.log("Button Pressed");
    };
    constructor(x, y, width, height, trigger) {

        if(typeof x == "object") {
            this.points = x;
            if(trigger != undefined){
                this.trigger = y;
            }
        }else {
            this.points = [
                {x: x, y: y},
                {x: x + width, y: y},
                {x: x + width, y: y + height},
                {x: x, y: y + height}
            ];
            if(trigger != undefined){
                this.trigger = trigger;
            }
        }
    }

    tick() {
        if(isHovering(this.points, false)) {
            uiManager.hoveringOverUi = true;
        }
        if(isHovering(this.points, false) && mouseListener.buttonUp[0]) {
            this.trigger();
        }
    }

    render() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = 'rgb(50,50,255)';
        if(isHovering(this.points, false)) {
            ctx.fillStyle = 'rgb(0,0,255';
        }
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(let i = 0; i < this.points.length; i++){
            if(i == 0){
                ctx.moveTo(this.points[i].x, this.points[i].y);
            }else {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
        }
        ctx.closePath();
        ctx.fill();

        ctx.setTransform(gameCamera.scale, 0, 0, gameCamera.scale, gameCamera.xOffset*gameCamera.scale, gameCamera.yOffset*gameCamera.scale);
    }
}