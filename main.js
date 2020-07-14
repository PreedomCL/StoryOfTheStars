let fps = 60;
let tps = 30;


const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
const staticCtx = cvs.getContext('2d');
const WIDTH = document.getElementById('canvas').width;
const HEIGHT = document.getElementById('canvas').height;
assets.init();

tileManager.generateMap(10, 10, 10);
entityManager.add(new FeildBerries(-49, 0));


//GameCamera
let gameCamera = {
    xOffset: 450,
    yOffset: 0,
    scale: 1,
    lastX: 0,
    lastY:0,
    calculateOffset: function() {
        if(mouseListener.justPressedButton[0]){
            this.lastX = mouseListener.mouseX;
            this.lastY = mouseListener.mouseY;
        }
        if(mouseListener.mouseD && mouseListener.button[0]){
            this.xOffset -= (this.lastX-mouseListener.mouseX)/this.scale;
            this.lastX = mouseListener.mouseX;
            
            this.yOffset -= (this.lastY-mouseListener.mouseY)/this.scale;
            this.lastY = mouseListener.mouseY;
        }

        // if(this.xOffset > 620) this.xOffset = 619;
        // if(this.xOffset < -320) this.xOffset = -319;
        // if(this.yOffset > 70) this.yOffset = 69;
        // if(this.yOffset < -500) this.yOffset = -499;
        
    }
}
cvs.onwheel = function (event){
    event.preventDefault();
    
    let mousex = event.clientX - cvs.offsetLeft;
    let mousey = event.clientY - cvs.offsetTop;
    let wheel = event.deltaY < 0 ? 1 : -1;

    let zoomIntensity = 0.2;
    let zoom = Math.exp(wheel*zoomIntensity);
    
    if(gameCamera.scale * zoom < 3 && gameCamera.scale * zoom > 0.5) {
        gameCamera.xOffset += (mousex/(gameCamera.scale*zoom) - mousex/gameCamera.scale);
        gameCamera.yOffset += (mousey/(gameCamera.scale*zoom) - mousey/gameCamera.scale);
        
        gameCamera.scale *= zoom;
    }
}


class Player {
    id;
    name;
    resources = [
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    tick() {

    }

    render() {
        staticCtx.fillStyle = 'red';
        staticCtx.font = "italic 10px sans-serif";
        staticCtx.textAlign = "center";
        staticCtx.fillText("Hello my name is " + this.name + " and my id is: " + this.id, 0, 20);
    }
}
let players = [new Player(0, "Carl"), new Player(1, "John")];


function render() {
    ctx.clearRect(-10000,-10000,20000,20000);
    ctx.setTransform(gameCamera.scale, 0, 0, gameCamera.scale, gameCamera.xOffset*gameCamera.scale, gameCamera.yOffset*gameCamera.scale);
    
    

    tileManager.render();
    entityManager.render();
    players[1].render();

    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, 1, 1);
}

function tick(){
    gameCamera.calculateOffset();
    entityManager.tick();
    tileManager.tick();
    mouseListener.tick();
    keyListener.tick();
}


function openFullScreen() {
    if (cvs.requestFullscreen) {
        cvs.requestFullscreen();
    } else if (cvs.mozRequestFullScreen) { /* Firefox */
        cvs.mozRequestFullScreen();
    } else if (cvs.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        cvs.webkitRequestFullscreen();
    } else if (cvs.msRequestFullscreen) { /* IE/Edge */
        cvs.msRequestFullscreen();
    }
}

let renderer = setInterval(render,1000/fps);
let ticker = setInterval(tick,1000/tps);
