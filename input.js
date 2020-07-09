
let keyListener = {
    key: [],
    justPressedKey: [],
    heldKey: [],
    
    checkKey: function(event){
        keyListener.key[event.keyCode] = true;
    },
    keyRelase: function(event){
        keyListener.key[event.keyCode] = false;
    },
    tick: function(){
        for(let i = 0; i < this.key.length; i++) {
			if(this.heldKey[i] && !this.key[i]) {
				this.heldKey[i] = false;
			}else if(this.justPressedKey[i]) {
				this.heldKey[i] = true;
				this.justPressedKey[i] = false;
			}
			if(!this.heldKey[i] && this.key[i]) {
				this.justPressedKey[i] = true;
            }
        }
    }
};

let mouseListener = {
    mouseX: 0,
    mouseY: 0,
    mouseD: false,
    button: [],
    justPressedButton: [],
    heldButton: [],
    
    mouseCoords: function(event){
        mouseListener.mouseX = event.clientX - cvs.offsetLeft;
        mouseListener.mouseY = event.clientY - cvs.offsetTop;
    },
    mouseDown: function(event){
        mouseListener.mouseD = true;
        mouseListener.button[event.button] = true;
        mouseListener.tick();
    },
    mouseUp: function(event){
        mouseListener.mouseD = false;
        mouseListener.button[event.button] = false;
        mouseListener.tick();
    },
    tick: function(){
        for(let i = 0; i < this.button.length; i++) {
			if(this.heldButton[i] && !this.button[i]) {
				this.heldButton[i] = false;
			}else if(this.justPressedButton[i]) {
				this.heldButton[i] = true;
				this.justPressedButton[i] = false;
			}
			if(!this.heldButton[i] && this.button[i]) {
				this.justPressedButton[i] = true;
            }
        }
    }
}
document.addEventListener("keydown", keyListener.checkKey);
document.addEventListener("keyup", keyListener.keyRelase);
document.addEventListener("mousedown", mouseListener.mouseDown);
document.addEventListener("mouseup", mouseListener.mouseUp);
document.addEventListener("mousemove", mouseListener.mouseCoords);