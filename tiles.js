let tileManager = {
    tiles: [],
    add: function(tile) {
        this.tiles[this.tiles.length] = tile;
    },
    tick: function() {
        
        for(let i = 0; i < this.tiles.length; i++){
            let tile = this.tiles[i];
            tile.tick();
        }
    },
    render: function() {
        for(let i = 0; i < this.tiles.length; i++){
            let tile = this.tiles[i];
            tile.render();
        }
    },
    generateMap: function(width, height, difficulty) {
        for(let x = 0; x < width; x++){
            for(let y = 0; y < height; y++){
                this.add(new FieldTile((x * 49) - (y * 49) - 49, (y * 28.87) + (x * 28.87), (x*10)+y));
            }
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

    resource;

    selected = false;
    positionChange = {
        lastX: 0,
        lastY: 0,
    };
    constructor(x, y, texture, id, type){
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = this.width*0.5774;
        this.id = id;
        this.texture = texture;
        this.type = type;
    }

    render() {

        ctx.drawImage(this.texture, this.x, this.y, this.width, this.texture.naturalHeight * (this.width/this.texture.naturalWidth) + 2);

        if(this.selected){
            ctx.drawImage(assets.textures.misc.base, this.x, this.y, this.width, assets.textures.misc.base.naturalHeight * (this.width/assets.textures.misc.base.naturalWidth) + 2);
        }

        if(this.resource != null) {
            this.resource.render();
        }
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
        
        if(isHovering(points) && mouseListener.buttonUp[0] && (this.positionChange.lastX == gameCamera.xOffset && this.positionChange.lastY == gameCamera.yOffset)){
            this.selected = !this.selected;
            this.mouseDown = false;
            players[currentPlayer].selectedTile = (this.selected)? this : null;
        }else if(mouseListener.justPressedButton[0]) {
            this.selected = false;
        }

        if(this.resource != null) {
            if(!this.resource.active){
                this.resource = null;
            }

            this.resource.tick();
        }
        
    }

    addResource(resource) {
        this.resource = resource;
        this.resource.tile = this;

        this.resource.x = this.x;
        this.resource.y = this.y;
    }
}
    

class FieldTile extends Tile {
    constructor(x, y, id) {
        super(x, y, assets.textures.tile.field, id, "Feild");
    }
}