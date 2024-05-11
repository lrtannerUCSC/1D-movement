class Player extends Phaser.Scene {
    constructor() {
        super("playerScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.playerX = game.config.width/2;
        this.playerY = game.config.height - 25;
        this.moveLeft = null;
        this.moveRight = null;
        this.playerSpeed = 10;
        

        //Bullet stuff
        this.my.sprite.bullets = [];
        this.maxBullets = 20;
        this.bulletCooldown = 4;
        this.bulletCooldownCounter = 0;
        this.bulletSpeed = 7;

        //infected red bullet stuff
        this.my.sprite.infectedBullets = [];
        this.maxInfectedBullets = 20;
        this.infectedBulletCooldown = 40;
        this.infectedBulletCooldownCounter = 0;
        this.infectedBulletSpeed = 3;

        //worm bullet stuff
        this.my.sprite.wormBullets = [];
        this.maxwormBullets = 20
        this.wormBulletCooldown = 60;
        this.wormBulletCooldownCounter = 0;
        this.wormBulletSpeed = 3;

        //Score
        this.score = 0;
        this.greenWormSmallPoints = 5;
        this.greenSlugPoints = 15;
        this.blueSlugPoints = 20;
        this.greenWormLargePoints = 100;
        this.infectedRedPoints = 500;

        //Health
        this.playerHealth = 3;
        this.escapees = 0;
        this.maxEscapees = 20;
        this.greenWormSmallDamage = 1;
        this.slugDamage = 5;
        this.redInfectedDamage = 20;

        //Waves
        this.waveTimer = 1200;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("bullet", "snail_shell.png");

        //small green worm
        this.load.image("greenWormSmall", "snake.png")
        this.load.image("walkGreenWormSmall", "snake_walk.png");
        this.load.image("deadGreenWormSmall", "snake_dead.png");

        //large green worm
        this.load.image("greenWormLarge", "snakeSlime.png");
        this.load.image("moveGreenWormLarge", "snakeSlime_ani.png");
        this.load.image("projectileGreenWormLarge", "alienYellow_badge.png");

        //green slug
        this.load.image("greenSlug", "slimeGreen.png");
        this.load.image("walkGreenSlug", "slimeGreen_walk.png");
        this.load.image("deadGreenSlug", "slimeGreen_dead.png");
        this.load.image("particleGreenSlug", "slimeGreen_squash.png");

        //blue slug
        this.load.image("blueSlug", "slimeBlue.png");
        this.load.image("walkBlueSlug", "slimeBlue_walk.png");
        this.load.image("deadBlueSlug", "slimeBlue_dead.png");
        this.load.image("particleBlueSlug", "slimeBlue_squash.png");
            //slugs explode into particles when killed

        //player
        this.load.image("tanAlien", "alienBeige.png");
        
        //infected green
        this.load.image("greenAlien", "alienGreen.png");

        //infected red
        this.load.image("redAlien", "alienPink.png");

        //old player sprite
        this.load.atlasXML("scribblerParts", "spritesheet_default.png", "spritesheet_default.xml");
        
        //Text
        this.load.bitmapFont('pixel_font', 'pixel.png', 'pixel.xml');
    }

    create() {
        let my = this.my;
        
        my.sprite.player = this.add.sprite(this.playerX, this.playerY,"tanAlien");
        my.sprite.player.setScale(.5);
        my.sprite.bullets.visible = false;
        my.sprite.infectedBullets.visible = false;
        this.moveLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.moveRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //Text
            //Score Text
        this.playerScore = this.add.bitmapText(15, game.config.height-25, 'pixel_font', 'Samples\nCollected: ' + this.score, 10);
        this.playerScore.maxWidth = 200;   
            //Health Text
        this.health = this.add.bitmapText(game.config.width - 120, 25, 'pixel_font', 'Health:' + this.playerHealth, 10);
        this.health.maxWidth = 100;
            //Escapees Text
        this.escaped = this.add.bitmapText(game.config.width - 120, 50, 'pixel_font', 'Infected Escaped: ' + this.escapees + "/" + this.maxEscapees, 10);
        this.escaped.maxWidth = 100;
            //Defeat Screen
        this.defeatScreen = this.add.bitmapText(game.config.width/2, game.config.height/2, 'pixel_font', 'Defeat\n  Score: ' + this.score, 24);
        this.defeatScreen.visible = false;

        //Bullet
        for (let i=0; i < this.maxBullets; i++){
            let bullet = this.add.sprite(-200, -200, "bullet");
            bullet.setScale(0.25);
            bullet.visible = false;
            my.sprite.bullets.push(bullet);
        }

        //Infected Red Bullets
        for (let i=0; i < this.maxInfectedBullets; i++){
            let IBullet = this.add.sprite(-200, -200, "bullet");
            IBullet.setScale(0.25);
            IBullet.visible = false;
            my.sprite.infectedBullets.push(IBullet);
        }

        //Worm Bullets
        for (let i=0; i < this.maxwormBullets; i++){
            let WBullet = this.add.sprite(-200, -200, "bullet");
            WBullet.setScale(0.25);
            WBullet.visible = false;
            my.sprite.wormBullets.push(WBullet);
        }

        //Enemies
            //small green worm
        my.sprite.greenWormSmallGroup = this.add.group({
            defaultKey: "greenWormSmall",
            maxSize: 20,
        }
        );
        my.sprite.greenWormSmallGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.greenWormSmallGroup.defaultKey,
            repeat: my.sprite.greenWormSmallGroup.maxSize-1
        }
        );
                //speed, location, and cooldowns
        this.greenWormSmallSpeed = 2;
        this.greenWormSmallX = -150;
        this.greenWormSmallCooldown = 3;
        this.greenWormSmallCooldownCounter = 0;

            //blue slug
        my.sprite.blueSlugGroup = this.add.group({
            defaultKey: "blueSlug",
            maxSize: 5,
        }
        );
        my.sprite.blueSlugGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.blueSlugGroup.defaultKey,
            // health: Number(3),
            repeat: my.sprite.blueSlugGroup.maxSize-1
        }
        );
                //speed, location, and cooldowns
        this.blueSlugSpeed = .5;
        this.blueSlugX = 75;
        this.blueSlugCooldown = 10;
        this.blueSlugCooldownCounter = 10;
        this.blueSlugMoveCooldown = 60;
        this.blueSlugMoveCooldownCounter = 0;
        this.blueSlugJump = 100;

            //green slug
        my.sprite.greenSlugGroup = this.add.group({
            defaultKey: "greenSlug",
            maxSize: 5,
        }
        );
        my.sprite.greenSlugGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.greenSlugGroup.defaultKey,
            // health: Number(3),
            repeat: my.sprite.greenSlugGroup.maxSize-1
        }
        );
                //speed, location, and cooldowns
        this.greenSlugSpeed = .5;
        this.greenSlugX = game.config.width-175;
        this.greenSlugCooldown = 55;
        this.greenSlugCooldownCounter = 5;
        this.greenSlugMoveCooldown = 30;
        this.greenSlugMoveCooldownCounter = 0;

            //large green worm
        my.sprite.greenWormLargeGroup = this.add.group({
            defaultKey: "greenWormLarge",
            maxSize: 2,
        }
        );
        my.sprite.greenWormLargeGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.greenWormLargeGroup.defaultKey,
            // health: Number(3),
            repeat: my.sprite.greenWormLargeGroup.maxSize-1
        }
        );
                //speed, location, and cooldowns
        this.greenWormLargeSpeed = .5;
        this.greenWormLargeX = 175;
        this.greenWormLargeCooldown = 55;
        this.greenWormLargeCooldownCounter = 240;

            //infected red
        my.sprite.redInfectedGroup = this.add.group({
            defaultKey: "redAlien",
            maxSize: 1,
        }
        );
        my.sprite.redInfectedGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.redInfectedGroup.defaultKey,
            // health: Number(3),
            repeat: my.sprite.redInfectedGroup.maxSize-1
        }
        );
                //speed, location, and cooldowns
        this.redInfectedSpeedX = 3;
        this.redInfectedSpeedY = 1;
        this.redInfectedX = 600;
        this.redInfectedY = 0;
        this.redInfectedCooldown = 600;
        this.redInfectedCooldownCounter = 600;
    }

    update() {
        let my = this.my;
        this.waveTimer--;
        if (this.waveTimer <= 0){
            
        }
        if (this.escaped == this.maxEscapees){
            this.defeatScreen.visible = true;
        }
        // console.log;
        if (this.moveLeft.isDown) {
            if (this.playerX > 0 + my.sprite.player.displayWidth/2){
                this.playerX -= this.playerSpeed;
                my.sprite.player.setPosition(this.playerX, this.playerY);
            }
            
        }
        if (this.moveRight.isDown) {
            if (this.playerX < game.config.width - my.sprite.player.displayWidth/2){
                this.playerX += this.playerSpeed;
            }
            my.sprite.player.setPosition(this.playerX, this.playerY);
        }

        //Bullet spawning
        //collision detection
        this.bulletCooldownCounter--;
        if (this.shoot.isDown) {
            // console.log("space is down");
            if (this.bulletCooldownCounter < 0) {
                for (let bullet of my.sprite.bullets) {
                    // console.log("bullet");
                    if (!bullet.visible) {
                        bullet.x = my.sprite.player.x;
                        bullet.y = my.sprite.player.y - (bullet.displayHeight/2);
                        bullet.visible = true;
                        this.bulletCooldownCounter = this.bulletCooldown;
                        break;
                    }
                }
            }
        }
        //worm bullet spawning
        this.wormBulletCooldownCounter--;
        if (this.wormBulletCooldownCounter < 0){
            for (let gwl of my.sprite.greenWormLargeGroup.getChildren()){
                if (gwl.visible || gwl.active){
                    let offsetX = 10;
                    for (let i = 0; i < 5; i++){
                        let Wbullet = my.sprite.wormBullets[i];
                        if (!Wbullet.visible){
                            // console.log("gwl.x " + gwl.x);
                            Wbullet.x = gwl.x + (i * offsetX);
                            Wbullet.y = gwl.y - gwl.displayHeight/2;
                            // console.log("Wbullet.x " + Wbullet.x);
                            Wbullet.visible = true;
                            this.wormBulletCooldownCounter = this.wormBulletCooldown;
                        }
                    }
                }
            }
        }

        //Infected Red Bullet spawning
        this.infectedBulletCooldownCounter--;
        if (this.infectedBulletCooldownCounter < 0){
            for (let ri of my.sprite.redInfectedGroup.getChildren()){
                if (ri.visible || ri.active){
                    for (let Ibullet of my.sprite.infectedBullets){
                        if (!Ibullet.visible){
                            Ibullet.x = this.redInfectedX;
                            Ibullet.y = this.redInfectedY - Ibullet.displayWidth;
                            Ibullet.visible = true;
                            this.infectedBulletCooldownCounter = this.infectedBulletCooldown;
                            break;
                        }
                    }
                }
            }
        }
        //Infected Red Bullet movement
        for (let IBullet of my.sprite.infectedBullets) {
            if (IBullet.visible) {
                for (let ri of my.sprite.redInfectedGroup.getChildren()){
                    if (ri.visible || ri.active){
                        IBullet.y += this.infectedBulletSpeed;
                    }
                }
            }

            if (IBullet.y < -(IBullet.displayHeight/2)) {
                IBullet.visible = false;
            }
        }

        //worm bullet movement
        let i = 0;
        for (let WBullet of my.sprite.wormBullets){
            if (WBullet.visible){
                for (let gwl of my.sprite.greenWormLargeGroup.getChildren()){
                    if (gwl.visible || gwl.active){
                        WBullet.y += this.wormBulletSpeed;
                        WBullet.x += this.wormbulletSpeed;
                    }
                }
            }
        }

        //Bullet movement
        for (let bullet of my.sprite.bullets) {
            if (bullet.visible) {
                bullet.y -= this.bulletSpeed;
            }

            if (bullet.y < -(bullet.displayHeight/2)) {
                bullet.visible = false;
                bullet.x = game.config.width + 150;
            }
        }
        for (let bullet of my.sprite.bullets) {
            //green worm small collision
            for (let gws of my.sprite.greenWormSmallGroup.getChildren()){
                if (this.collides(gws, bullet)){
                    bullet.active = false;
                    bullet.visible = false;
                    gws.visible = false;
                    gws.x = -100;
                    this.score += this.greenWormSmallPoints;
                    this.playerScore.setText('Samples\nCollected:' + this.score);
                    this.playerScore.maxWidth = 200;  
                    break;
                }
            }
            //green slug collision
            for (let gs of my.sprite.greenSlugGroup.getChildren()){
                if (this.collides(gs, bullet)){
                    bullet.active = false;
                    bullet.visible = false;
                    // gs.health--;
                    // console.log(gs.health);
                    // if (gs.health <= 0){
                    //     console.log("green slug dead");
                    //     gs.visible = false;
                    //     gs.x = -100;
                    //     break;
                    // }
                    gs.visible = false;
                    gs.x = -100;
                    this.score += this.greenSlugPoints;
                    this.playerScore.setText('Samples\nCollected:' + this.score);
                    this.playerScore.maxWidth = 200;  
                    break;
                }
            }
            //blue slug collision
            for (let bs of my.sprite.blueSlugGroup.getChildren()){
                if (this.collides(bs, bullet)){
                    bullet.active = false;
                    bullet.visible = false;
                    bs.visible = false;
                    bs.x = -100;
                    this.score += this.blueSlugPoints;
                    this.playerScore.setText('Samples\nCollected:' + this.score);
                    this.playerScore.maxWidth = 200;  
                    break;
                }
            }
            //large green worm collision
            for (let gwl of my.sprite.greenWormLargeGroup.getChildren()){
                if (this.collides(gwl, bullet)){
                    bullet.active = false;
                    bullet.visible = false;
                    gwl.visible = false;
                    gwl.x = -100;
                    this.score += this.greenWormLargePoints;
                    this.playerScore.setText('Samples\nCollected:' + this.score);
                    this.playerScore.maxWidth = 200;  
                    break;
                }
            }
            //red infected
            for (let ri of my.sprite.redInfectedGroup.getChildren()){
                if (this.collides(ri, bullet)){
                    bullet.active = false;
                    bullet.visible = false;
                    ri.visible = false;
                    ri.x = -100;
                    this.score += this.infectedRedPoints;
                    this.playerScore.setText('Samples\nCollected:' + this.score);
                    this.playerScore.maxWidth = 200;
                
                    break;
                }
            }
        }

        
        //Enemies
            //green worm small
        this.greenWormSmallCooldownCounter--;
        let gws = my.sprite.greenWormSmallGroup.getFirstDead();
        if (gws != null){
            if (this.greenWormSmallCooldownCounter < 0){
                gws.active = true;
                gws.visible = true;
                gws.x = Phaser.Math.Between(0, game.config.width);
                gws.y = 0;
                this.greenWormSmallCooldownCounter = this.greenWormSmallCooldown;
            }
        }
        for (let gws of my.sprite.greenWormSmallGroup.getChildren()){
            if (gws.y > game.config.height){
                gws.active = false;
                gws.visible = false;
                gws.x = -150;
                this.escapees += this.greenWormSmallDamage;
                this.escaped.setText('Infected Escaped: ' + this.escapees + "/" + this.maxEscapees);

            }
        }
        my.sprite.greenWormSmallGroup.getChildren().forEach(function(worm) {
            worm.setRotation(Phaser.Math.DegToRad(-90));
            worm.setScale(.5);
        });
        my.sprite.greenWormSmallGroup.incY(this.greenWormSmallSpeed);

            //blue slug
        this.blueSlugCooldownCounter--;
        this.blueSlugMoveCooldownCounter--;
        let bs = my.sprite.blueSlugGroup.getFirstDead();
        if (bs != null){
            if (this.blueSlugCooldownCounter < 0){
                //console.log("blue slug found");
                bs.active = true;
                bs.visible = true;
                bs.x = Phaser.Math.Between(100, game.config.width-100);
                bs.y = 0;
                this.blueSlugCooldownCounter = this.blueSlugCooldown;
                //spawning timing and spacing
            }
        }
        for (let bs of my.sprite.blueSlugGroup.getChildren()){
            if (bs.y > game.config.height){
                bs.active = false;
                bs.visible = false;
                console.log("blue slug escaped");
                this.escapees += this.slugDamage;
                this.escaped.setText('Infected Escaped: ' + this.escapees + "/" + this.maxEscapees);
            }
        }
        my.sprite.blueSlugGroup.getChildren().forEach(function(bs) {
            bs.setRotation(Phaser.Math.DegToRad(180));
            bs.setScale(1.25);
        });
        if (this.blueSlugMoveCooldownCounter < 0){
            for (let bs of my.sprite.blueSlugGroup.getChildren()){
                bs.y += this.blueSlugJump;
            }
            this.blueSlugMoveCooldownCounter = this.blueSlugMoveCooldown;
        }
        my.sprite.blueSlugGroup.incY(this.blueSlugSpeed);

            //green slug
        this.greenSlugCooldownCounter--;
        let gs = my.sprite.greenSlugGroup.getFirstDead();
        if (gs != null){
            if (gs != null){
                if (this.greenSlugCooldownCounter < 0){
                    gs.active = true;
                    gs.visible = true;
                    gs.x = Phaser.Math.Between(100, game.config.width-100);
                    gs.y = 0;
                    this.greenSlugCooldownCounter = this.greenSlugCooldown;
                    //spawning timing and spacing
                    this.escapees += this.slugDamage;
                    this.escaped.setText('Infected Escaped: ' + this.escapees + "/" + this.maxEscapees);
                }
            }
        }
        for (let gs of my.sprite.greenSlugGroup.getChildren()){
            if (gs.y > game.config.height){
                gs.active = false;
                gs.visible = false;
            }
        }
        my.sprite.greenSlugGroup.getChildren().forEach(function(gs) {
            gs.setRotation(Phaser.Math.DegToRad(-90));
            gs.setScale(1.25);
        });
        if (this.greenSlugMoveCooldownCounter < 0){
            my.sprite.greenSlugGroup.incY(this.greenSlugSpeed*200);
            this.greenSlugMoveCooldownCounter = this.greenSlugMoveCooldown;
        }
        my.sprite.greenSlugGroup.incY(this.greenSlugSpeed);

            //large green worm
        this.greenWormLargeCooldownCounter--;
        let gwl = my.sprite.greenWormLargeGroup.getFirstDead();
        if (gwl != null){
            if (gwl != null){
                if (this.greenWormLargeCooldownCounter < 0){
                    gwl.active = true;
                    gwl.visible = true;
                    gwl.x = Phaser.Math.Between(100, game.config.width-100);
                    gwl.y = 0;
                    this.greenWormLargeCooldownCounter = this.greenWormLargeCooldown;
                    //spawning timing and spacing
                    this.greenWormLargeX+=400;
                }
            }
        }
        for (let gwl of my.sprite.greenWormLargeGroup.getChildren()){
            if (gwl.y > game.config.height){
                gwl.active = false;
                gwl.visible = false;
            }
        }
        my.sprite.greenWormLargeGroup.getChildren().forEach(function(gwl) {
            gwl.setRotation(Phaser.Math.DegToRad(180));
            gwl.setScale(1);
        });
        if (this.greenWormLargeMoveCooldownCounter < 0){
            my.sprite.greenWormLargeGroup.incY(this.greenWormLargeSpeed*200);
            this.greenWormLargeMoveCooldownCounter = this.greenWormLargeMoveCooldown;
        }
        for (let gwl of my.sprite.greenWormLargeGroup.getChildren()){
            if (gwl.y < 30){
                gwl.y+=this.greenWormLargeSpeed*5;
            }
        }

            //infected red
        this.redInfectedCooldownCounter--;
        let ri = my.sprite.redInfectedGroup.getFirstDead();
        if (ri != null){
            if (ri != null){
                if (this.redInfectedCooldownCounter < 0){
                    ri.active = true;

                    ri.visible = true;
                    ri.x = Phaser.Math.Between(100, game.config.width-100);
                    ri.y = 0;
                    this.redInfectedCooldownCounter = this.redInfectedCooldown;
                }
            }
        }
        for (let ri of my.sprite.redInfectedGroup.getChildren()){
            if (ri.y > game.config.height){
                ri.active = false;
                ri.visible = false;
                this.escapees += 1;
                this.escaped.setText('Infected Escaped: ' + this.escapees + "/" + this.maxEscapees);
            }
        }
        my.sprite.redInfectedGroup.getChildren().forEach(function(ri) {
            ri.setRotation(Phaser.Math.DegToRad(0));
            ri.setScale(.5);
        });
        for (let ri of my.sprite.redInfectedGroup.getChildren()){
            if (ri.y < -ri.displayHeight/2){
                ri.active = false;
                ri.visible = false;
            }

            ri.x += this.redInfectedSpeedX;
            ri.y += this.redInfectedSpeedY;

            if (ri.x >= game.config.width - ri.displayWidth/2){
                this.redInfectedSpeedX = -this.redInfectedSpeedX;
            }
            if (ri.x <= 0){
                this.redInfectedSpeedX = -this.redInfectedSpeedX;
            }
            this.redInfectedX = ri.x;
            this.redInfectedY = ri.y;
        }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}

