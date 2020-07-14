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
                this.add(new FieldTile((x * 49) - (y * 49) - 49, (y * 28.87) + (x * 28.87)));
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
    constructor(x, y, texture, id){
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = this.width*0.5774;
        this.id = id;
        this.texture = texture;
    }

    render() {
        
        ctx.drawImage(this.texture, this.x, this.y, this.width, this.texture.naturalHeight * (this.width/this.texture.naturalWidth) + 2);
        if(keyListener.key[66]){
            ctx.drawImage(assets.textures.misc.base, this.x, this.y, this.width, assets.textures.misc.base.naturalHeight * (this.width/assets.textures.misc.base.naturalWidth) + 2);
        }
    }

    tick() {}
}

class FieldTile extends Tile {
    constructor(x, y) {
        super(x, y, assets.textures.tile.field, 1);
    }
}