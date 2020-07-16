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

    info = [];
    constructor(x, y, size, texture, name) {
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size * .5774;
        this.active = true;
        this.texture = texture;
        this.name = name;
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
    constructor(x, y, size, texture, name) {
        super(x, y, size, texture, name);
    }
}

class Resource extends StaticEntity {
    constructor(x, y, size, texture, name) {
        super(x, y, size, texture, name);
    }
}

class FeildBerries extends Resource {
    quantity = 1000;
    constructor(x, y) {
        super(x, y, 100, assets.textures.entity.static.resources.fields.berries_1, "Berries");
    }

    tick() {
        this.quantity --;
        this.info[0] = {property: "Quantity", value: this.quantity};
        this.active = (this.quantity > 0)? true: false;
    }
}

////////DYNAMIC////////

