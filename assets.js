let assets = {
    textures: {
        entity: {
            static: {
                fields: {
                    berries_1: new Image(),
                    foraging_1: new Image(),
                    init: function() {
                        this.berries_1.src = 'res/textures/entity_static_fields_berries_1.png';
                        this.foraging_1.src = 'res/textures/entity_static_fields_foraging_1.png';
                    }
                },
                init: function() {
                    this.fields.init();
                },
            },
            dynamic: {
                init: function() {

                }
            },
            init: function() {
                this.static.init();
                this.dynamic.init();
            }
        },
        tile: {
            field: new Image(),
            water: new Image(),
            init: function() {
                this.field.src = 'res/textures/tile_field.png';
                this.water.src = 'res/textures/tile_water.png';
            }
        },
        misc: {
            unknown: new Image(),
            selected: new Image(),
            init: function() {
                this.unknown.src = 'res/textures/misc_unknown.png';
                this.selected.src = 'res/textures/misc_selected.png';
            }
        },
        init: function() {
            this.entity.init();
            this.tile.init();
            this.misc.init();
        }
    },
    fonts: {
        init: function() {

        }
    },
    sounds: {
        init: function() {

        }
    },
    init: function() {
        this.textures.init();
        this.fonts.init();
        this.sounds.init();
    }
};