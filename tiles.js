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

    dependents = [];

    selected = false;
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

        if(this.isHovering() || this.selected){
            ctx.drawImage(assets.textures.misc.base, this.x, this.y, this.width, assets.textures.misc.base.naturalHeight * (this.width/assets.textures.misc.base.naturalWidth) + 2);
        }

        for(let i = 0; i < this.dependents.length; i++){
            this.dependents[i].render();
        }
    }

    tick() {
        if(this.isHovering() && mouseListener.justPressedButton[0]){
            this.selected = !this.selected;
            players[currentPlayer].selectedTile = (this.selected)? this : null;
        }else if(mouseListener.justPressedButton[0]) {
            this.selected = false;
        }

        for(let i = 0; i < this.dependents.length; i++){
            let d = this.dependents[i];

            if(!d.active){
                this.dependents.splice(i, 1);
                continue;
            }

            d.tick();
        }

        
    }

    isHovering() {
        let collision = false;
        let points = [
            {x:0, y:0},
            {x:0, y:0},
            {x:0, y:0},
            {x:0, y:0}
        ];

        points[0].x = this.x + 49;
        points[0].y = this.y;
        points[1].x = this.x + 98;
        points[1].y = this.y + 28.87;
        points[2].x = this.x + 49;
        points[2].y = this.y + 57.74;
        points[3].x = this.x;
        points[3].y = this.y + 28.87;

        for(let i = 0; i<points.length; i++){
            let vc = points[i];
            let vn = (i+1 == points.length)? points[0] : points[i+1];
            let px = (mouseListener.mouseX - (gameCamera.xOffset * gameCamera.scale)) / gameCamera.scale;
            let py = (mouseListener.mouseY - (gameCamera.yOffset * gameCamera.scale)) / gameCamera.scale;
            if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) && (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
                collision = !collision;
            }
        }
        return(collision);
    }

    addDependent(dependent) {
        this.dependents[this.dependents.length] = dependent;
    }
    
}

class FieldTile extends Tile {
    constructor(x, y, id) {
        super(x, y, assets.textures.tile.field, id, "Feild");
    }
}