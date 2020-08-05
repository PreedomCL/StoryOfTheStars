let base = new Image();
base.src = '/res/textures/misc_base.gif';

let entityManager = {
    entities: [],
    add: function(entity) {
        this.entities[this.entities.length] = entity;
    },
    tick: function() {
        
        for(let i = 0; i < this.entities.length; i++){
            let entity = this.entities[i];

            if(!entity.active){
                this.entities.splice(i, 1);
                continue;
            }

            entity.tick();
        }
    },
    render: function() {
        for(let i = 0; i < this.entities.length; i++){
            let entity = this.entities[i];
            entity.render();
        }
    }
};

class Entity {
    x;
    y;
    width;
    height;
    size;
    texture;
    name;
    tags = [];

    data = [];
    constructor(x, y, size, texture, name, tags) {
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size * .5774;
        this.active = true;
        this.texture = texture;
        this.name = name;
        this.tags = tags;
    };

    render() {
        
        
        
        if(keyListener.key[66]){
            ctx.drawImage(base, (this.x+gameCamera.xOffset) * gameCamera.zoom, (this.y-(base.naturalHeight * (this.width/base.naturalWidth))+this.height+gameCamera.yOffset) * gameCamera.zoom, this.width * gameCamera.zoom, base.naturalHeight * (this.width/base.naturalWidth));
        }else {
            ctx.drawImage(this.texture, this.x, (this.y-(this.texture.naturalHeight * (this.width/this.texture.naturalWidth))+this.height), this.width, this.texture.naturalHeight * (this.width/this.texture.naturalWidth));
        }
        
        if(keyListener.key[88]){
            ctx.lineWidth = 0;
            ctx.fillStyle = "black";
            ctx.strokeRect(this.x+gameCamera.xOffset, this.y+gameCamera.yOffset, this.width, this.height);
        }
        

    };

    tick() {};
}

////////STATIC////////

class StaticEntity extends Entity {
    constructor(x, y, size, texture, name, tags) {
        super(x, y, size, texture, name, tags);
    }
}

class Resource extends StaticEntity {
    structure;
    tile;
    resources = 10;
    id;
    ui = [new UIButton(10, 50, 20, 20, function(){
        players[currentPlayer].selectedTile.addStructure(new FeildForaging());
        players[currentPlayer].selectedTile.owner = players[currentPlayer];
        this.active = false;
    })];
    constructor(x, y, size, texture, name, id, tags) {
        super(x, y, size, texture, name, tags);
        this.id = id;

    }
    
    render() {
        if(keyListener.key[66]){
            ctx.drawImage(base, (this.x+gameCamera.xOffset) * gameCamera.zoom, (this.y-(base.naturalHeight * (this.width/base.naturalWidth))+this.height+gameCamera.yOffset) * gameCamera.zoom, this.width * gameCamera.zoom, base.naturalHeight * (this.width/base.naturalWidth));
        }else {
            ctx.drawImage(this.texture, this.x, (this.y-(this.texture.naturalHeight * (this.width/this.texture.naturalWidth))+this.height), this.width, this.texture.naturalHeight * (this.width/this.texture.naturalWidth));
        }
        
        if(keyListener.key[88]){
            ctx.lineWidth = 0;
            ctx.fillStyle = "black";
            ctx.strokeRect(this.x+gameCamera.xOffset, this.y+gameCamera.yOffset, this.width, this.height);
        }
    }

    tick() {}

    onNextTurn() {}

   
}

class FeildBerries extends Resource {
    constructor() {
        super(0, 0, 100, assets.textures.entity.static.fields.berries_1, "Berries", 0);
    }

    tick() {
        this.data[0] = {property: "Resources", value: this.resources};
        if(this.resources <= 0) {
            this.active = false;
        }
    }
    

}

class Structure extends StaticEntity {
    tile;
    ui = [new UIButton(10, 80, 20, 20, function(){
        players[currentPlayer].selectedTile.structure.active = false;
        players[currentPlayer].selectedTile.resource.ui[0].active = true;
        players[currentPlayer].selectedTile.owner = players[currentPlayer].selectedTile.protected? players[currentPlayer] : null;
    })];
    constructor(x, y, size, texture, name, tags) {
        super(x, y, size, texture, name, tags);
    }

    onNextTurn() {

    }
}

class FeildForaging extends Structure {
    constructor() {
        super(0, 0, 100, assets.textures.entity.static.fields.foraging_1, "Foraging");
    }

    onNextTurn() {
        if(this.tile.resource != null && this.tile.resource.id == 0) {
            this.tile.owner.resources[0][0] ++;
            this.tile.resource.resources --;
        }
    }
}
////////DYNAMIC////////

