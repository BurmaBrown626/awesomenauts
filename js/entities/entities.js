game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64", /*adds the charcater and its spawn point */
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }


            }]);
        this.body.setVelocity(5, 20);// x and y value
        this.facing = "right";
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastAttack = new Date().getTime();//havent used this yet

        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta){
         this.now = new Date().getTime();
        if (me.input.isKeyPressed("right")) {
            //sets postion of player
            //sets speed of the player
            //makes the player movent look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);
        } else if (me.input.isKeyPressed("left")) {
            this.facing = "left";
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(false);
        }
        else {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed("jump") && !this.jumping && !this.falling) {
            this.body.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }

        if (me.input.isKeyPressed("attack")) {
            console.log("attack");
            if (!this.renderable.isCurrentAnimation("attack")) {
                console.log("attack");
                //sets animation to attack then goes to idle once finished
                this.renderable.setCurrentAnimation("attack", "idle");
                //makes it so that animation starts from the first frame not last leftoff frame
                this.renderable.setAnimationFrame();
            }
        }

        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if(!this.renderable.isCurrentAnimation("attack")){
            this.renderable.setCurrentAnimation("idle");
        }
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.y;

            console.log("xdif" + xdif + " ydif " + ydif);

            if(ydif<-40 && xdif< 70 && xdif>-35){
                this.body.falling = false;
                this.body.vel.y = -1;
            }
             else if(xdif>-35 && this.facing==='right' && (xdif<0)){
                this.body.vel.x = 0;
                this.pos.x = this.pos.x - 1;
            }else if(xdif<60 && this.facing==='left' && xdif>0){
                this.body.vel.x = 0;
                this.pos.x = this.pos.x - 1;
            }
            
            if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= 1000){
                console.log("tower Hit");
                  this.lastHit = this.now;
                  response.b.looseHealth();
            }
        }
    }
            
});
game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spritehieght: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 69)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "PlayerBaseEntity";

        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");


    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function() {

    }
});

game.EnemyBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spritehieght: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 69)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "EnemyBaseEntity";

        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");


    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");

        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function() {

    },
    
    looseHealth: function(){
        this.health--;
    }
});

game.EnemyCreep = me.Entity.extend({
        init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "creep1",
                width: 32,
                height: 64,
                spritewidth: "32",
                spriteheight: "64", /*adds the charcater and its spawn point */
                getShape: function() {
                    return(new me.Rect(0, 0, 32, 64)).toPolygon();
                }


            }]);
        this.health =10;
        this.alwaysUpdate = true;
        this.body.setVelocity(3, 20);
        this.type = "EnemyCreep";                       //adds creep in game
        this.renderable.addAnimation("walk",[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 80);
        this.renderable.setCurrentAnimation("walk");
    },
    update: function(delta){
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    }
}); // adds creep into game
game.GameManager = Object.extend({
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        
        this.alwaysUpdate = true;
    },
    update: function(){
        this.now = new Date().getTime();
        
        if(Math.round(this.now/1000)%10 ===0 &&(this.now - this.lastCreep >= 1000)){// times how long a creep will spawn ingame
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creepe, 5);
            
        }
        return true;
    }
});