game.PlayerEntity = me.Entity.extend ({
        init: function(x, y, settings){
            this._super(me.Entity, 'init', [x, y, {  
              image: "player",
              width: 64,
              height: 64,
              spritewidth: "64",
              spriteheight: "64",                                               /*adds the charcater and its spawn point */
              getShape: function(){
                  return(new me.Rect(0, 0, 64, 64)).toPolygon();
              }
              
              
            }]);
            this.body.setVelocity(5, 20);// x and y value
        },
        
        update: function(delta){
            if(me.input.isKeyPressed("right")){
                //sets postion of player
                //sets speed of the player
                //makes the player movent look smooth
                this.body.vel.x += this.body.accel.x * me.timer.tick;
            }
            if(me.input.isKeyPressed("left")){
                //sets postion of player
                //sets speed of the player
                //makes the player movent look smooth
                this.body.vel.x += this.body.accel.x * me.timer.tick;
            }
            else{
                this.body.vel.x = 0;
            }
            
            this.body.update(delta);
            return true;
        }
});