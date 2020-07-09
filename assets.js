let assets = {
    textures: {
        entity: {
            static: {
                resources: {
                    fields: {
                        berries_1: new Image(),
                        init: function() {
                            this.berries_1.src = 'res/textures/entity_static_resources_fields_berries_1.gif';
                        }
                    },
                    init: function() {
                        this.fields.init();
                    }
                },
                structures: {
                    init: function() {

                    }
                },
                init: function() {
                    this.resources.init();
                    this.structures.init();
                }
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
            init: function() {
                this.field.src = 'res/textures/tile_field.gif';
            }
        },
        misc: {
            unknown: new Image(),
            base: new Image(),
            init: function() {
                this.unknown.src = 'res/textures/misc_unknown.gif';
                this.base.src = 'res/textures/misc_base.gif';
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