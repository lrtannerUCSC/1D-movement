class Player2 extends Phaser.Scene {
    constructor() {
        super("playerScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.playerX = game.config.width/2;
        this.playerY = game.config.height - 25;
        this.moveLeft = null;
        this.moveRight = null;
        this.playerSpeed = 10;
        //enemy movement speeds
        this.greenWormSmallSpeed = 2;
        this.greenSlugSpeed = .5;
        this.blueSlugSpeed = .5;
        this.greenWormLargeSpeed = .5;
        this.redInfectedSpeed = 3;
        

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
        this.waveTimer = 10;
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
        my.sprite.wormBullets.visible = false;
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

        // Bullet and enemy creation logic are moved to separate methods
        this.createBullets();
        this.createEnemies();
    }

    update() {
        let my = this.my;
        this.moveEnemies();
        // Decrement the waveTimer counter
        this.waveTimer--;
    
        // Check if the waveTimer counter has reached zero
        if (this.waveTimer <= 0) {
            // Call the method to spawn enemies
            this.spawnEnemies();
    
            // Reset the waveTimer counter to its initial value
            this.waveTimer = 1200; // Reset to your desired value
        }
        if (this.escaped == this.maxEscapees){
            this.defeatScreen.visible = true;
        }

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

        // Player movement and bullet spawning logic are unchanged

        // Bullet and enemy movement and collision detection logic are unchanged
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
    }

    

    // Methods for creating bullets and enemies
createBullets() {
    let my = this.my;

    // Create bullets
    for (let i = 0; i < this.maxBullets; i++) {
        let bullet = this.add.sprite(-200, -200, "bullet");
        bullet.setScale(0.25);
        bullet.visible = false;
        my.sprite.bullets.push(bullet);
    }

    // Create infected bullets
    for (let i = 0; i < this.maxInfectedBullets; i++) {
        let IBullet = this.add.sprite(-200, -200, "bullet");
        IBullet.setScale(0.25);
        IBullet.visible = false;
        my.sprite.infectedBullets.push(IBullet);
    }

    // Create worm bullets
    for (let i = 0; i < this.maxwormBullets; i++) {
        let WBullet = this.add.sprite(-200, -200, "bullet");
        WBullet.setScale(0.25);
        WBullet.visible = false;
        my.sprite.wormBullets.push(WBullet);
    }
}

moveEnemies() {
    let my = this.my;

    // Move small green worms
    my.sprite.greenWormSmallGroup.getChildren().forEach((gws) => {
        // Move small green worms downwards at a constant speed
        gws.y += this.greenWormSmallSpeed;
        
        // Check if the enemy is out of bounds and reset its position if necessary
        if (gws.y > game.config.height) {
            // Reset position of the enemy
            gws.y = 0;
            gws.x = Phaser.Math.Between(0, game.config.width);
        }
    });

    // Move blue slugs
    my.sprite.blueSlugGroup.getChildren().forEach((bs) => {
        // Implement movement logic for blue slugs
        // For example, you might move them downwards and then reset their position when they reach the bottom of the screen
        bs.y += this.blueSlugSpeed;
        
        // Check if the enemy is out of bounds and reset its position if necessary
        if (bs.y > game.config.height) {
            // Reset position of the enemy
            bs.y = 0;
            bs.x = Phaser.Math.Between(0, game.config.width);
        }
    });

    // Move green slugs
    my.sprite.greenSlugGroup.getChildren().forEach((gs) => {
        // Implement movement logic for green slugs
        // Similar to blue slugs, move them downwards and reset their position when they reach the bottom
        gs.y += this.greenSlugSpeed;
        
        // Check if the enemy is out of bounds and reset its position if necessary
        if (gs.y > game.config.height) {
            // Reset position of the enemy
            gs.y = 0;
            gs.x = Phaser.Math.Between(0, game.config.width);
        }
    });

    // Move large green worms
    my.sprite.greenWormLargeGroup.getChildren().forEach((gwl) => {
        // Implement movement logic for large green worms
        // You can adjust their movement pattern according to your game design
        gwl.y += this.greenWormLargeSpeed;
        
        // Check if the enemy is out of bounds and reset its position if necessary
        if (gwl.y > game.config.height) {
            // Reset position of the enemy
            gwl.y = 0;
            gwl.x = Phaser.Math.Between(0, game.config.width);
        }
    });

    // Move infected red enemies
    my.sprite.redInfectedGroup.getChildren().forEach((ri) => {
        // Implement movement logic for infected red enemies
        // Move them downwards or apply any other movement pattern you want
        ri.y += this.redInfectedSpeed;
        
        // Check if the enemy is out of bounds and reset its position if necessary
        if (ri.y > game.config.height) {
            // Reset position of the enemy
            ri.y = 0;
            ri.x = Phaser.Math.Between(0, game.config.width);
        }
    });
}


    createEnemies() {
        let my = this.my;

        // Create small green worm group
        my.sprite.greenWormSmallGroup = this.add.group({
            defaultKey: "greenWormSmall",
            maxSize: 20,
        });

        my.sprite.greenWormSmallGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.greenWormSmallGroup.defaultKey,
            repeat: my.sprite.greenWormSmallGroup.maxSize - 1
        });

        // Create blue slug group
        my.sprite.blueSlugGroup = this.add.group({
            defaultKey: "blueSlug",
            maxSize: 5,
        });

        my.sprite.blueSlugGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.blueSlugGroup.defaultKey,
            repeat: my.sprite.blueSlugGroup.maxSize - 1
        });

        // Create green slug group
        my.sprite.greenSlugGroup = this.add.group({
            defaultKey: "greenSlug",
            maxSize: 5,
        });

        my.sprite.greenSlugGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.greenSlugGroup.defaultKey,
            repeat: my.sprite.greenSlugGroup.maxSize - 1
        });

        // Create large green worm group
        my.sprite.greenWormLargeGroup = this.add.group({
            defaultKey: "greenWormLarge",
            maxSize: 2,
        });

        my.sprite.greenWormLargeGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.greenWormLargeGroup.defaultKey,
            repeat: my.sprite.greenWormLargeGroup.maxSize - 1
        });

        // Create infected red group
        my.sprite.redInfectedGroup = this.add.group({
            defaultKey: "redAlien",
            maxSize: 1,
        });

        my.sprite.redInfectedGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.redInfectedGroup.defaultKey,
            repeat: my.sprite.redInfectedGroup.maxSize - 1
        });
    }

    // Method for spawning enemies
    spawnEnemies() {
        let my = this.my;
        console.log("enemies should be spawning");
        // Spawning logic for small green worm
        this.greenWormSmallCooldownCounter--;
        let gws = my.sprite.greenWormSmallGroup.getFirstDead();
        if (gws != null) {
            for (let i = 0; i < 20; i++) {
                gws.active = true;
                gws.visible = true;
                gws.x = Phaser.Math.Between(0, game.config.width);
                gws.y = 0;
                this.greenWormSmallCooldownCounter = this.greenWormSmallCooldown;
            }
        }

        // Spawning logic for blue slug
        this.blueSlugCooldownCounter--;
        this.blueSlugMoveCooldownCounter--;
        let bs = my.sprite.blueSlugGroup.getFirstDead();
        if (bs != null) {
            if (this.blueSlugCooldownCounter < 0) {
                bs.active = true;
                bs.visible = true;
                bs.x = Phaser.Math.Between(100, game.config.width - 100);
                bs.y = 0;
                this.blueSlugCooldownCounter = this.blueSlugCooldown;
            }
        }
        if (this.blueSlugMoveCooldownCounter < 0) {
            my.sprite.blueSlugGroup.getChildren().forEach(function(bs) {
                bs.y += this.blueSlugJump;
            });
            this.blueSlugMoveCooldownCounter = this.blueSlugMoveCooldown;
        }

        // Spawning logic for green slug
        this.greenSlugCooldownCounter--;
        let gs = my.sprite.greenSlugGroup.getFirstDead();
        if (gs != null) {
            if (this.greenSlugCooldownCounter < 0) {
                gs.active = true;
                gs.visible = true;
                gs.x = Phaser.Math.Between(100, game.config.width - 100);
                gs.y = 0;
                this.greenSlugCooldownCounter = this.greenSlugCooldown;
            }
        }

        // Spawning logic for large green worm
        this.greenWormLargeCooldownCounter--;
        let gwl = my.sprite.greenWormLargeGroup.getFirstDead();
        if (gwl != null) {
            if (this.greenWormLargeCooldownCounter < 0) {
                gwl.active = true;
                gwl.visible = true;
                gwl.x = Phaser.Math.Between(100, game.config.width - 100);
                gwl.y = 0;
                this.greenWormLargeCooldownCounter = this.greenWormLargeCooldown;
            }
        }

        // Spawning logic for infected red
        this.redInfectedCooldownCounter--;
        let ri = my.sprite.redInfectedGroup.getFirstDead();
        if (ri != null) {
            if (this.redInfectedCooldownCounter < 0) {
                ri.active = true;
                ri.visible = true;
                ri.x = Phaser.Math.Between(100, game.config.width - 100);
                ri.y = 0;
                this.redInfectedCooldownCounter = this.redInfectedCooldown;
            }
        }
    }


    collides(a, b) {
        return Math.abs(a.x - b.x) < (a.displayWidth / 2 + b.displayWidth / 2) &&
            Math.abs(a.y - b.y) < (a.displayHeight / 2 + b.displayHeight / 2);
    }

}

