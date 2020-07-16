let fps = 60;
let tps = 30;


const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
const WIDTH = document.getElementById('canvas').width;
const HEIGHT = document.getElementById('canvas').height;

let currentPlayer = 0;
assets.init();

tileManager.generateMap(10, 10, 10);

tileManager.tiles[0].addDependent(new FeildBerries(-49, 0));

//GameCamera
let gameCamera = {
    xOffset: 500,
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
    selectedTile;
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
    ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.fillStyle = 'red';
        ctx.font = "italic 15px sans-serif";
        
        ctx.fillText("Hello my name is " + this.name + " and my id is: " + this.id, 0, 15);
        ctx.fillText(`Agricultural Resources: ${this.resources[0]} | Mining Resources: ${this.resources[1]} | Forestry Resources: ${this.resources[2]} | Technological Resources: ${this.resources[3]}`, 0, 30);
        if(this.selectedTile != (null || undefined)) {
            ctx.fillText(`Selected Tile: ${this.selectedTile.id}, Type: ${this.selectedTile.type}`, 0, 500);

            let dependantInfo = [];
            for(let i = 0; i < this.selectedTile.dependents.length; i++){
                dependantInfo[i] = this.selectedTile.dependents[i].name + "(";
                for(let j = 0; j < this.selectedTile.dependents[i].info.length; j++){
                    dependantInfo[i] += this.selectedTile.dependents[i].info[j].property;
                    dependantInfo[i] += ": " + this.selectedTile.dependents[i].info[j].value + ", ";
                }
                dependantInfo[i] += ")";
            }

            ctx.fillText("Contains:", 0, 515);
            for(let i = 0; i < dependantInfo.length; i++) {
                ctx.fillText(dependantInfo[i], 0, 530 + (15*i));
            }
            
        }

    ctx.setTransform(gameCamera.scale, 0, 0, gameCamera.scale, gameCamera.xOffset*gameCamera.scale, gameCamera.yOffset*gameCamera.scale);
    }
}
let players = [new Player(0, "Carl"), new Player(1, "John")];




function render() {
    ctx.clearRect(-10000,-10000,20000,20000);
    
    ctx.setTransform(gameCamera.scale, 0, 0, gameCamera.scale, gameCamera.xOffset*gameCamera.scale, gameCamera.yOffset*gameCamera.scale);
    
    

    tileManager.render();
    entityManager.render();
    

    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, 1, 1);

    players[currentPlayer].render();
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
