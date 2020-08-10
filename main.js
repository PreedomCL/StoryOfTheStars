let fps = 60;
let tps = 30;


const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
ctx.imageSmoothingEnabled = false;
const WIDTH = document.getElementById('canvas').width;
const HEIGHT = document.getElementById('canvas').height;

assets.init();



//GameCamera
let gameCamera = {
    xOffset: 1000,
    yOffset: 0,
    scale: 0.5,
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
        
    },
    resetOffset: function() {
        this.xOffset = 500;
        this.yOffset = 0;
        this.scale = 1;
    }
}
cvs.onwheel = function (event){
    event.preventDefault();
    
    let mousex = event.clientX - cvs.offsetLeft;
    let mousey = event.clientY - cvs.offsetTop;
    let wheel = event.deltaY < 0 ? 1 : -1;

    let zoomIntensity = 0.2;
    let zoom = Math.exp(wheel*zoomIntensity);
    
    if(gameCamera.scale * zoom < 1 && gameCamera.scale * zoom > 0.25) {
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
        if(this.selectedTile != null && !this.selectedTile.selected) {
            this.selectedTile = null;
        }
        if(this.selectedTile != null && (this.selectedTile.owner == this || this.selectedTile.owner == null)) { 
            this.selectedTile.ui.forEach(element => {
                if(element.active)
                    element.tick();
            })

            if(this.selectedTile.resource != null) {
                this.selectedTile.resource.ui.forEach(element => {
                    if(element.active)
                        element.tick();
                })
            }
            if(this.selectedTile.structure != null) {
                this.selectedTile.structure.ui.forEach(element => {
                    if(element.active)
                        element.tick();
                })
            }
        }
    }

    render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.fillStyle = 'red';
        ctx.font = "italic 15px sans-serif";
        
        ctx.fillText("Hello my name is " + this.name + " and my id is: " + this.id, 0, 15);
        ctx.fillText(`Agricultural Resources: ${this.resources[0]} | Mining Resources: ${this.resources[1]} | Forestry Resources: ${this.resources[2]} | Technological Resources: ${this.resources[3]}`, 0, 30);
        if(this.selectedTile != null) {
            ctx.fillText(`Selected Tile: (${this.selectedTile.id.x}, ${this.selectedTile.id.y}), Type: ${this.selectedTile.type}, Owner: ${this.selectedTile.owner == null? "unowned": this.selectedTile.owner.name}`, 0, 500);
            ctx.fillText("Contains:", 0, 515);
            if(this.selectedTile.resource != null){
                let resourceData;
                resourceData = this.selectedTile.resource.name + "(";
                for(let j = 0; j < this.selectedTile.resource.data.length; j++){
                    resourceData += this.selectedTile.resource.data[j].property;
                    resourceData += ": " + this.selectedTile.resource.data[j].value + ", ";
                }
                resourceData += ")";
                
                ctx.fillText(resourceData, 10, 530);
            }
            if(this.selectedTile.structure != null){
                let structureData;
                structureData = this.selectedTile.structure.name + "(";
                for(let j = 0; j < this.selectedTile.structure.data.length; j++){
                    structureData += this.selectedTile.structure.data[j].property;
                    structureData += ": " + this.selectedTile.structure.data[j].value + ", ";
                }
                structureData += ")";
                ctx.fillText(structureData, 10, 545);
            }

        }
        

        
        if(this.selectedTile != null && (this.selectedTile.owner == this || this.selectedTile.owner == null)) { 
            this.selectedTile.ui.forEach(element => {
                if(element.active)
                    element.render();
            })
            if(this.selectedTile.resource != null) {
                this.selectedTile.resource.ui.forEach(element => {
                    if(element.active)
                        element.render();
                })
            }
            if(this.selectedTile.structure != null) {
                this.selectedTile.structure.ui.forEach(element => {
                    if(element.active)
                        element.render();
                })
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

    ctx.setTransform(gameCamera.scale, 0, 0, gameCamera.scale, gameCamera.xOffset*gameCamera.scale, gameCamera.yOffset*gameCamera.scale);

    if(this.selectedTile != null) {
        ctx.drawImage(assets.textures.misc.selected, this.selectedTile.x, this.selectedTile.y, this.selectedTile.width, 58);
    }
    }
}
let currentPlayer = 0;
let players = [new Player(0, "Carl"), new Player(1, "John")];

function nextTurn() {
    players[currentPlayer].selectedTile = null;
    currentPlayer = (currentPlayer+1 == players.length)? 0 : currentPlayer+1;
    tileManager.tiles.forEach(element => {
        element.forEach(tile => {
            if(currentPlayer == 0) {
                tile.onNextTurn();
            }
            tile.selected = false;
        })
    })
    gameCamera.resetOffset();
}
tileManager.generateMap(15, 15, 0.55);


uiManager.add(new UIButton(20, 540, 100, 40, nextTurn));
function render() {
    ctx.clearRect(-10000,-10000,20000,20000);
    
    ctx.setTransform(gameCamera.scale, 0, 0, gameCamera.scale, gameCamera.xOffset*gameCamera.scale, gameCamera.yOffset*gameCamera.scale);
    
    

    tileManager.render();
    entityManager.render();
    uiManager.render();

    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, 1, 1);

    players[currentPlayer].render();
}

function tick(){
    if(!uiManager.hoveringOverUi){
        gameCamera.calculateOffset();
    }
    players[currentPlayer].tick();
    entityManager.tick();
    tileManager.tick();
    uiManager.tick();  
    

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
