let tileManager = {
    tiles: [],
    tick: function() {
        for(let i = 0; i < this.tiles.length; i++){
            for(let j = 0; j < this.tiles[i].length; j ++) {
                let tile = this.tiles[i][j];
                tile.tick();
            }
        }
    },
    render: function() {
        for(let i = 0; i < this.tiles.length; i++){
            for(let j = 0; j < this.tiles[i].length; j ++) {
                let tile = this.tiles[i][j];
                tile.render();
            }
        }
    },
    generateMap: function(width, height, density, seed) {
        let random;
        let map = [];
        let newMap = [];
        if(seed == null) {
            seed = Math.random();
            random = new RNG(seed);
        }else {
            random = new RNG(seed);
        }
        console.info(`Seed: ${seed}`);
        for(let i = 0; i < height; i ++) {
            map[i] = [];
            newMap[i] = [];
            this.tiles[i] = [];
        }
        
        for(let x = 0; x < width; x++){
            for(let y = 0; y < height; y++){
                if(random.uniform() < density){
                    map[x][y] = 0;
                }else{
                    map[x][y] = 1;
                }
                random = new RNG(random.uniform());
            }
        }

        for(let i = 0; i < 3; i++) {

            for(let x = 0; x < width; x++){
                for(let y = 0; y < height; y++){
                    let alive = 0;
                    let neighboors = 0;
                    for(let nx = x-1; nx <= (x+1); nx++){
                        for(let ny = y-1; ny <= (y+1); ny++){
                            if((nx == x && ny == y) || (nx < 0 || nx > width-1 || ny < 0 || ny > height-1)) {
                                continue;
                            }
                            if(map[nx][ny] == 1){
                                alive ++;
                            }
                            neighboors ++;
                        }
                    }
                    if(neighboors = 8){
                        if(alive > 2 && map[x][y] == 1) {
                            newMap[x][y] = 1;
                        }else if(alive > 4 && map[x][y] == 0){
                            newMap[x][y] = 1;
                        }else {
                            newMap[x][y] = 0;
                        }
                    }else if(neighboors = 5) {
                        if(alive > 1 && map[x][y] == 1) {
                            newMap[x][y] = 1;
                        }else if(alive > 1 && map[x][y] == 0){
                            newMap[x][y] = 1;
                        }else {
                            newMap[x][y] = 0;
                        }
                    }else if(neighboors = 3) {
                        if(alive > 1 && map[x][y] == 1) {
                            newMap[x][y] = 1;
                        }else if(alive > 2 && map[x][y] == 0){
                            newMap[x][y] = 1;
                        }else {
                            newMap[x][y] = 0;
                        }
                    }
                    
                }
            }
            map = newMap;
            
        }

        let land = 0;
        for(let x = 0; x < width; x++){
            for(let y = 0; y < height; y++){
                if(map[x][y] == 0) {
                    this.tiles[x][y] = new FieldTile((x * 50) - (y * 50) - 50, (y * (29)) + (x * 29), {x: x, y: y});
                    land ++;
                }else if(map[x][y] == 1) {
                    this.tiles[x][y] = new WaterTile((x * 50) - (y * 50) - 50, (y * (29)) + (x * 29), {x: x, y: y});
                
                }
            }
        }
        console.info(`%${Math.round((land/(width*height)) * 100)} land`);
        if(land/(width*height) <= 0.5 || land/(width*height) > 0.8) {
            newSeed = new RNG(seed);
            this.generateMap(width, height, density, newSeed.uniform());
        }
    }
};
class Tile {
    x;
    y;
    width;
    height;
    id;
    texture;
    type;
    owner = null;
    protected = false;

    ui = [];

    resource;
    structure;

    selected = false;
    positionChange = {
        lastX: 0,
        lastY: 0,
    };
    constructor(x, y, texture, id, type){
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 92;
        this.id = id;
        this.texture = texture;
        this.type = type;
    }

    render() {

        if(this.owner != players[currentPlayer] && this.owner != null) {
            ctx.filter = "grayscale(50%)";
        }
        ctx.drawImage(this.texture, this.x,this.y, this.width, this.height);

        if(this.resource != null) {
            this.resource.render();
        }
        if(this.structure != null) {
            this.structure.render();
        }
        ctx.filter = "none";
    }

    tick() {
        let points = [
            {x:this.x + 49, y:this.y},
            {x:this.x + 98, y:this.y + 28.87},
            {x:this.x + 49, y:this.y + 57.74},
            {x:this.x, y:this.y + 28.87}
        ];

        if(isHovering(points) && mouseListener.justPressedButton[0]){
            this.positionChange.lastX = gameCamera.xOffset;
            this.positionChange.lastY = gameCamera.yOffset;
        }
        
        if(isHovering(points) && mouseListener.buttonUp[0] && !uiManager.hoveringOverUi && (this.positionChange.lastX == gameCamera.xOffset && this.positionChange.lastY == gameCamera.yOffset)){
            this.selected = !this.selected;
            players[currentPlayer].selectedTile = (this.selected)? this : null;
        }else if(mouseListener.buttonUp[0] && !uiManager.hoveringOverUi) {
            this.selected = false;
        }

        if(this.resource != null) {
            if(!this.resource.active){
                this.resource = null;
            }else {
                this.resource.tick();
            }
        }

        if(this.structure != null) {
            if(!this.structure.active) {
                this.structure = null;
            }else {
                this.structure.tick();
            }
        }
    }

    onNextTurn() {
        if(this.resource != null) {
            this.resource.onNextTurn();
        }
        if(this.structure != null) {
            this.structure.onNextTurn();
        }
    }

    addResource(resource) {
        this.resource = resource;
        this.resource.tile = this;

        this.resource.x = this.x;
        this.resource.y = this.y;

    }
    
    addStructure(structure) {
        this.structure = structure;
        this.structure.tile = this;

        this.structure.x = this.x;
        this.structure.y = this.y;

    }
}
    

class FieldTile extends Tile {
    constructor(x, y, id) {
        super(x, y, assets.textures.tile.field, id, "Feild");
    }
}

class WaterTile extends Tile {
    constructor(x, y, id) {
        super(x, y, assets.textures.tile.water, id, "Water");
    }
}