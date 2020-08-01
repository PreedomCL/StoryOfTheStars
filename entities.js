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
    tags;

    info = [];
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
    constructor(x, y, size, texture, name, tags) {
        super(x, y, size, texture, name, tags);

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
        
        if(this.structure != null) {
            this.structure.render();
            let structureInfo = this.structure.name + "(";
            for (let i = 0; i < this.structure.info.length; i++) {
                structureInfo += this.structure.info[i].property + ": ";
                structureInfo += this.structure.info[i].value + ", ";
            }
            structureInfo += ")"
            this.info[0] = {
                property: "Structure",
                value: structureInfo
            }
        }
    };

    addStructure(structure) {
        this.structure = structure;
        this.structure.resource = this;

        this.structure.x = this.x;
        this.structure.y = this.y;
    }
}

class FeildBerries extends Resource {
    constructor() {
        super(0, 0, 100, assets.textures.entity.static.fields.berries_1, "Berries");
    }

}

class Structure extends StaticEntity {
    owner;
    resource;
    constructor(x, y, size, texture, name, owner, tags) {
        super(x, y, size, texture, name, tags);
        this.owner = owner;
    }
}

class FeildForaging extends Structure {
    constructor(owner) {
        super(0, 0, 100, assets.textures.entity.static.fields.foraging_1, "Foraging", owner);
    }
}
////////DYNAMIC////////

