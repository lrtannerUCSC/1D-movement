class Player3 extends Phaser.Scene {
    constructor() {
        super("playerScene");
        this.my = {sprite: {}};
        //player starting location
        this.playerX = game.config.width/2;
        this.playerY = game.config.height - 25;
        //initialize player movement variables
        this.moveLeft = null;
        this.moveRight = null;
        this.playerSpeed = 10;

        //enemy movement speeds
        this.greenWormSmallSpeedY = 2;
        this.greenWormSmallSpeedX = 2;
        this.greenSlugSpeed = .5;
        this.blueSlugSpeed = 2;
        this.greenWormLargeSpeed = .5;
        this.redInfectedSpeed = 3;

        //bullet variables
        this.my.sprite.bullets = [];
        this.maxBullets = 20;
        this.bulletCooldown = 2;
        this.bulletCooldownCounter = 0;
        this.bulletSpeed = 7;

        //infected bullet variables
        this.my.sprite.infectedBullets = [];
        this.maxInfectedBullets = 20;
        this.infectedBulletCooldown = 40;
        this.infectedBulletCooldownCounter = 0;
        this.infectedBulletSpeed = 3;

        //worm bullet variables
        this.my.sprite.wormBullets = [];
        this.maxwormBullets = 20
        this.wormBulletCooldown = 60;
        this.wormBulletCooldownCounter = 0;
        this.wormBulletSpeed = 3;

        //score and points variables
        this.score = 0;
        this.greenWormSmallPoints = 5;
        this.greenSlugPoints = 15;
        this.blueSlugPoints = 20;
        this.greenWormLargePoints = 100;
        this.infectedRedPoints = 500;

        //health, hitpoints, and damage variables
        this.playerHealth = 5;
        // this.escapees = 0;
        this.maxEscapees = 20;
        this.greenWormSmallDamage = 1;
        this.slugDamage = 5;
        this.redInfectedDamage = 20;
        this.blueSlugInitialHealth = 3;
        this.greenSlugInitialHealth = 3;
        this.greenWormLargeInitialHealth = 9;
        this.redInfectedInitialHealth = 9;

        //wave variables
        this.waveTimer = 10;
        this.waveTimerCooldown = 800;
        this.waveNumber = 0;

        //wave spawning flag
        this.waveSpawning = false;

        //length of wave spawning
        this.waveSpawnerTimer = 600;
        this.waveSpawnerTimerCooldown = 600;

        //enemy variables

        //green worm small
        this.greenWormSmallSpeed = 2;
        this.greenWormSmallCooldown = 5;
        this.greenWormSmallCooldownCounter = 0;
        this.greenWormSmallCount = 0;

        //blue slug
        this.blueSlugSpeed = 1;
        this.blueSlugCooldown = 10;
        this.blueSlugCooldownCounter = 10;
        this.blueSlugMoveCooldown = 30;
        this.blueSlugMoveCooldownCounter = 0;
        this.blueSlugJump = 30;
        this.blueSlugCount = 0;

        //green slug
        this.greenSlugSpeed = 1;
        this.greenSlugCooldown = 25;
        this.greenSlugCooldownCounter = 5;
        this.greenSlugMoveCooldown = 30;
        this.greenSlugMoveCooldownCounter = 0;
        this.greenSlugCount = 0;

        //green worm large
        this.greenWormLargeSpeed = 1;
        this.greenWormLargeCooldown = 55;
        this.greenWormLargeCooldownCounter = 200; //200
        this.greenWormLargeCount = 0;

        //infected red
        this.redInfectedSpeedX = 3;
        this.redInfectedSpeedY = 1;
        this.redInfectedCooldown = 600;
        this.redInfectedCooldownCounter = 400; //400
        this.infectedRedCount = 0;
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
        this.load.image("wormBullet", "alienYellow_badge1.png");

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
        this.load.image("infectedBullet", "alienPink_badge1.png");

        //Text
        this.load.bitmapFont('pixel_font', 'pixel.png', 'pixel.xml');

        //Audio
        this.load.audio('player_shoot', 'laserLarge_003.ogg');
        this.load.audio('enemy_death', 'explosionCrunch_000.ogg');
    }




    create() {
        let my = this.my;

        //player sprite initialization
        my.sprite.player = this.add.sprite(this.playerX, this.playerY,"tanAlien");
        my.sprite.player.setScale(.5);

        //movement keys
        this.moveLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.moveRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        //shoot key
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //reset key
        this.reset = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.reset.on('down', (key, event) => {
        //   console.log("restart");
        //   console.log(this);
            this.restart();
        });
        //bullet sprites made invisible
        my.sprite.bullets.visible = false;
        my.sprite.infectedBullets.visible = false;
        my.sprite.wormBullets.visible = false;

    //text
        //score text
        this.playerScore = this.add.bitmapText(15, game.config.height-25, 'pixel_font', 'Samples\nCollected: ' + this.score, 10);
        this.playerScore.maxWidth = 200;

        //health text
        this.health = this.add.bitmapText(game.config.width - 120, 25, 'pixel_font', 'Health:' + this.playerHealth, 10);
        this.health.maxWidth = 100;

        //escapees text
        // this.escaped = this.add.bitmapText(game.config.width - 120, 50, 'pixel_font', 'Infected Escaped: ' + this.escapees + "/" + this.maxEscapees, 10);
        // this.escaped.maxWidth = 100;
        //wave text
        this.numWave = this.add.bitmapText(game.config.width/2, game.config.height/2, 'pixel_font', 'Wave: ' + this.waveNumber, 30);
        
        //defeat screen
        this.defeatScreen = this.add.bitmapText(game.config.width/2, game.config.height/2, 'pixel_font', 'Defeat\nScore: ' + this.score, 24 + "\nPress R to Restart");
        this.defeatScreen.visible = false;

        //bullet initialization
        this.createBullets();
        
        //enemy initialization
        this.createEnemies();
    }

    


    update() {
        let my = this.my;
        //gamestate check
        if (this.playerHealth <= 0){
            // my.sprite.player.x = -300;
            // my.sprite.player.y = -300;
            my.sprite.player.active = false;
            my.sprite.player.visible = false;
            this.defeatScreen.visible = true;
        }

        //player movement
        console.log(this.moveLeft);
        if (this.moveLeft && this.moveLeft.isDown) {
            if (this.playerX > 0 + my.sprite.player.displayWidth/2){
                this.playerX -= this.playerSpeed;
                my.sprite.player.setPosition(this.playerX, this.playerY);
            }
        }
        
        if (this.moveRight && this.moveRight.isDown) {
            if (this.playerX < game.config.width - my.sprite.player.displayWidth/2){
                this.playerX += this.playerSpeed;
            }
            my.sprite.player.setPosition(this.playerX, this.playerY);
        }


        //bullet spawning
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
                        this.sound.play('player_shoot', {
                            volume: 0.25
                        });
                        this.bulletCooldownCounter = this.bulletCooldown;
                        break;
                    }
                }
            }
        }
        //bullet movement
        for (let bullet of my.sprite.bullets) {
            if (bullet.visible) {
                bullet.y -= this.bulletSpeed;
            }

            if (bullet.y < 0) {
                bullet.x = game.config.width + 150;
                bullet.y = -150;
              //console.log("bullet went off screen");
                bullet.visible = false;
                bullet.active = false;
                
            }
        }
        for (let bullet of my.sprite.bullets) {

            //green worm small collision
            for (let gws of my.sprite.greenWormSmallGroup.getChildren()){
                if (this.collides(gws, bullet)){
                    gws.x = -150;
                    gws.y = -150;
                    bullet.active = false;
                    bullet.visible = false;
                    bullet.x = game.config.width + 150;
                    gws.visible = false;
                    gws.active = false;
                    
                    this.sound.play('enemy_death', {
                        volume: 0.25
                    });
                    this.score += this.greenWormSmallPoints;
                    this.playerScore.setText('Samples\nCollected:' + this.score);
                    this.playerScore.maxWidth = 200;  
                    break;
                }
            }

            //green slug collision
            for (let gs of my.sprite.greenSlugGroup.getChildren()){
                if (this.collides(gs, bullet)){
                    gs.health--;
                  //console.log(gs.health);
                    bullet.active = false;
                        bullet.visible = false;
                        bullet.x = game.config.width + 150;
                    if (gs.health <= 0){
                      //console.log("gs health is 0");
                        gs.x = -150;
                        gs.y = -150;
                        
                        gs.visible = false;
                        gs.active = false;
                        
                        this.sound.play('enemy_death', {
                            volume: 0.25
                        });
                        this.score += this.greenSlugPoints;
                        this.playerScore.setText('Samples\nCollected:' + this.score);
                        this.playerScore.maxWidth = 200;  
                    }
                    break;
                }
            }

            //blue slug collision
            for (let bs of my.sprite.blueSlugGroup.getChildren()){
                if (this.collides(bs, bullet)){
                    bs.health--;
                    bullet.active = false;
                    bullet.visible = false;
                    bullet.x = game.config.width + 150;
                    if (bs.health <= 0){
                        bs.x = -150;
                        bs.y = -150;
                        
                        bs.visible = false;
                        bs.active = false;
                        
                        this.sound.play('enemy_death', {
                            volume: 0.25
                        });
                        this.score += this.blueSlugPoints;
                        this.playerScore.setText('Samples\nCollected:' + this.score);
                        this.playerScore.maxWidth = 200;  
                    }
                    break;
                }
            }

            //large green worm collision
            for (let gwl of my.sprite.greenWormLargeGroup.getChildren()){
                if (this.collides(gwl, bullet)){
                    gwl.health--;
                    bullet.active = false;
                    bullet.visible = false;
                    bullet.x = game.config.width + 150;
                    if (gwl.health <= 0){
                        gwl.x = -150;
                        gwl.y = -150;
                        
                        gwl.visible = false;
                        gwl.active = false;
                    }

                    this.sound.play('enemy_death', {
                        volume: 0.25
                    });
                    this.score += this.greenWormLargePoints;
                    this.playerScore.setText('Samples\nCollected:' + this.score);
                    this.playerScore.maxWidth = 200;  
                    break;
                }
            }

            //red infected collision
            for (let ri of my.sprite.redInfectedGroup.getChildren()){
                if (this.collides(ri, bullet)){
                    ri.x = -150;
                    ri.y = -150;
                    bullet.active = false;
                    bullet.visible = false;
                    bullet.x = game.config.width + 150;
                    ri.visible = false;
                    ri.active = false;

                    this.sound.play('enemy_death', {
                        volume: 0.25
                    });
                    this.score += this.infectedRedPoints;
                    this.playerScore.setText('Samples\nCollected:' + this.score);
                    this.playerScore.maxWidth = 200;
                    
                    break;
                }
            }
        }

        //infected bullet spawning
        this.infectedBulletCooldownCounter--;
        if (this.infectedBulletCooldownCounter < 0){
            for (let ri of my.sprite.redInfectedGroup.getChildren()){
                if (ri.visible || ri.active){
                    for (let IBullet of my.sprite.infectedBullets){
                        if (!IBullet.visible){
                          //console.log("infected bullet should be fired");
                            IBullet.visible = true;
                            IBullet.active = true;
                            IBullet.x = ri.x;
                            IBullet.y = ri.y - IBullet.displayWidth;
                            
                            this.infectedBulletCooldownCounter = this.infectedBulletCooldown;
                            break;
                        }
                    }
                }
            }
        }

        //infected bullet movement
        for (let IBullet of my.sprite.infectedBullets) {
            if (IBullet.visible) {
                IBullet.y += this.infectedBulletSpeed;
            }

            if (IBullet.y > game.config.height) {
                IBullet.visible = false;
                IBullet.x = game.config.width + 150;
            }
        }

        //infected bullet collision
        for (let IBullet of my.sprite.infectedBullets){
          //console.log(IBullet.x);
            if (this.collides(my.sprite.player, IBullet) && IBullet.visible == true){
              //console.log("collided with infected bullet");
                IBullet.x = -150;
                IBullet.y = -150;
                IBullet.active = false;
                IBullet.visible = false;
                this.playerHealth--;
                this.health.setText("Health:" + this.playerHealth)
                this.health.maxWidth = 100;
            }
        }
            

        //worm bullet spawning
        this.wormBulletCooldownCounter--;
        if (this.wormBulletCooldownCounter < 0){
            for (let gwl of my.sprite.greenWormLargeGroup.getChildren()){
                if (gwl.visible || gwl.active){
                    for (let WBullet of my.sprite.wormBullets){
                        if(!WBullet.visible){
                            WBullet.visible = true;
                            WBullet.active = true;
                            WBullet.x = gwl.x;
                            WBullet.y = gwl.y + gwl.displayHeight/2;

                            this.wormBulletCooldownCounter = this.wormBulletCooldown;
                            break;
                        }
                    }
                }
            }
        }

        //worm bullet movement
        for (let WBullet of my.sprite.wormBullets) {
            if (WBullet.visible) {
                WBullet.y += this.wormBulletSpeed;
            }

            if (WBullet.y < -(WBullet.displayHeight/2)) {
                WBullet.visible = false;
                WBullet.x = game.config.width + 150;
            }
        }

        //worm bullet collision
        for (let WBullet of my.sprite.wormBullets) {
            if (this.collides(my.sprite.player, WBullet)){
              //console.log("collided with worm bullet");
                WBullet.x = -150;
                WBullet.y = -150;
                WBullet.active = false;
                WBullet.visible = false;
                this.playerHealth--;
                this.health.setText("Health:" + this.playerHealth)
                this.health.maxWidth = 100;
            }
        }

        //player enemy collision

        //green worm small v player collision
        for (let gws of my.sprite.greenWormSmallGroup.getChildren()){
            if (this.collides(my.sprite.player, gws)){
            //console.log("collided with green worm small");
                gws.x = -150;
                gws.y = -150;
                gws.active = false;
                gws.visible = false;
                this.playerHealth--;
                this.health.setText("Health:" + this.playerHealth)
                this.health.maxWidth = 100;
            }
        }

        //blue slug v player collision
        for (let bs of my.sprite.blueSlugGroup.getChildren()){
            if (this.collides(my.sprite.player, bs)){
            //console.log("collided with blue slug");
                bs.x = -150;
                bs.y = -150;
                bs.active = false;
                bs.visible = false;
                this.sound.play('enemy_death', {
                    volume: 0.25
                })
                this.playerHealth--;
                this.health.setText("Health:" + this.playerHealth)
                this.health.maxWidth = 100;
            }
        }

        //green slug v player collision
        for (let gs of my.sprite.greenSlugGroup.getChildren()){
            if (this.collides(my.sprite.player, gs)){
            //console.log("collided with green slug");
                gs.x = -150;
                gs.y = -150;
                gs.active = false;
                gs.visible = false;
                this.sound.play('enemy_death', {
                    volume: 0.25
                })
                this
                this.playerHealth--;
                this.health.setText("Health:" + this.playerHealth)
                this.health.maxWidth = 100;
            }
        }

        //infected red v player collision
        for (let ri of my.sprite.redInfectedGroup.getChildren()){
            if (this.collides(my.sprite.player, ri)){
            //console.log("collided with green slug");
                ri.x = -150;
                ri.y = -150;
                ri.active = false;
                ri.visible = false;
                this.sound.play('enemy_death', {
                    volume: 0.25
                })
                this
                this.playerHealth--;
                this.health.setText("Health:" + this.playerHealth)
                this.health.maxWidth = 100;
            }
        }

        //wave counter decrement
        this.waveTimer--;
      //console.log(this.waveTimer);
        //wave check
        if (this.waveTimer <= 0) {
            this.waveNumber++;
            this.numWave.setText('Wave: ' + this.waveNumber);
            this.numWave.visible = true;
          //console.log("wave starting");
            this.waveSpawnerTimer = 600;
            this.waveSpawning = true;
            this.greenWormSmallCount = 0;
            this.blueSlugCount = 0;
            this.greenSlugCount = 0;
            this.greenWormLargeCount = 0;
            this.infectedRed = 0;
            this.waveTimer = this.waveTimerCooldown;
        }
        if (this.waveTimer <= this.waveTimerCooldown - this.waveTimerCooldown/6){
            this.numWave.visible = false;
        }
        if (this.waveSpawning) {
            this.waveSpawnerTimer--;
            //enemy spawning
            
        
            //green worm small spawning
            this.greenWormSmallCooldownCounter--;
            let gws = my.sprite.greenWormSmallGroup.getFirstDead();

            if (gws != null){
                if (this.greenWormSmallCooldownCounter < 0 && this.greenWormSmallCount < 20){
                    
                    gws.x = Phaser.Math.Between(0, game.config.width);
                    gws.y = 0;
                    gws.active = true;
                    gws.visible = true;
                    this.greenWormSmallCooldownCounter = this.greenWormSmallCooldown;
                    this.greenWormSmallCount++;
                    // console.log(this.greenWormSmallCount);
                }
            }
            for (let gws of my.sprite.greenWormSmallGroup.getChildren()){
                if (gws.y > game.config.height){
                //console.log("gws made it to end\n");
                    gws.y = -10;
                    // gws.active = false;
                    // gws.visible = false;
                    // this.escapees += this.greenWormSmallDamage;
                    // this.escaped.setText('Infected Escaped: ' + this.escapees + "/" + this.maxEscapees);

                }
                if (gws.x < 5){
                    gws.x = 5;
                }
                if (gws.x > game.config.width){
                    gws.x = game.config.width;
                }
            }
            my.sprite.greenWormSmallGroup.getChildren().forEach(function(worm) {
                worm.setRotation(Phaser.Math.DegToRad(-90));
                worm.setScale(.5);
            });

            //green worm small movement
            let scene = this;
            my.sprite.greenWormSmallGroup.children.iterate(function(gws) {
                if (gws.visible) {
                    gws.y += this.greenWormSmallSpeedY;

                    // Initialize speedX property if not already initialized
                    if (gws.speedX === undefined) {
                        gws.speedX = Phaser.Math.Between(-2, 2);
                    }

                    // Change X direction less frequently
                    if (Phaser.Math.Between(1, 20) < 2) { 
                        gws.speedX = Phaser.Math.Between(-2, 2);
                    }

                    // Update X position with the updated speedX
                    gws.x += gws.speedX;

                    // Keep the worm within the screen bounds
                    if (gws.x < 0) {
                        gws.x = 0;
                        gws.speedX *= -1; // Change direction if hitting left boundary
                    } else if (gws.x > game.config.width) {
                        gws.x = game.config.width;
                        gws.speedX *= -1; // Change direction if hitting right boundary
                    }
                }
            }, this);


            //blue slug spawning
            this.blueSlugCooldownCounter--;
            this.blueSlugMoveCooldownCounter--;
            let bs = my.sprite.blueSlugGroup.getFirstDead();
            if (bs != null){
                if (bs.y <= 10){
                    my.sprite.blueSlugGroup.children.iterate(function(blueSlug) {
                        blueSlug.health = scene.blueSlugInitialHealth;
                      //console.log("blueSlug.health " + blueSlug.health);
                    });
                }
                if (this.blueSlugCooldownCounter < 0 && this.blueSlugCount < 10){
                  //console.log("blue slug found");
                    bs.x = Phaser.Math.Between(100, game.config.width-100);
                    bs.y = -10;
                    bs.active = true;
                    bs.visible = true;
                    
                    
                    this.blueSlugCooldownCounter = this.blueSlugCooldown;
                    this.blueSlugCount++;

                }
            }
            for (let bs of my.sprite.blueSlugGroup.getChildren()){
                if (bs.y > game.config.height){
                //console.log("bs made it to end\n");
                    bs.y = -10;
                    // bs.active = false;
                    // bs.visible = false;
                    
                    // console.log("blue slug escaped");
                    // this.escapees += this.slugDamage;
                    // this.escaped.setText('Infected Escaped: ' + this.escapees + "/" + this.maxEscapees);
                }
            }
            my.sprite.blueSlugGroup.getChildren().forEach(function(bs) {
                bs.setRotation(Phaser.Math.DegToRad(180));
                bs.setScale(.5);
            });
            if (this.blueSlugMoveCooldownCounter < 0){
                for (let bs of my.sprite.blueSlugGroup.getChildren()){
                    bs.y += this.blueSlugJump;
                }
                this.blueSlugMoveCooldownCounter = this.blueSlugMoveCooldown;
            }

            //blue slug movement
            my.sprite.blueSlugGroup.children.iterate(function(bs) {
                if (bs.visible) {
                    bs.y += this.blueSlugSpeed;
                }
            }, this);

            //green slug spawning
            this.greenSlugCooldownCounter--;
            let gs = my.sprite.greenSlugGroup.getFirstDead();
          //console.log();
            if (gs != null){
                if (gs.y <= 10){
                    my.sprite.greenSlugGroup.children.iterate(function(greenSlug) {
                        greenSlug.health = scene.greenSlugInitialHealth;
                      //console.log("greenSlug.health " + greenSlug.health);
                    });
            
                }
                if (this.greenSlugCooldownCounter < 0 && this.greenSlugCount < 10){
                  //console.log("green slug found");
                    gs.x = Phaser.Math.Between(100, game.config.width-100);
                    gs.y = 0;
                    gs.active = true;
                    gs.visible = true;
                    
                    
                    this.greenSlugCooldownCounter = this.greenSlugCooldown;
                    this.greenSlugCount++;

                }
            }
            for (let gs of my.sprite.greenSlugGroup.getChildren()){
                if (gs.y > game.config.height){
                //console.log("gs made it to end\n");
                    gs.y = -10;
                    // gs.active = false;
                    // gs.visible = false;
                    // this.escapees += this.slugDamage;
                    // this.escaped.setText('Infected Escaped: ' + this.escapees + "/" + this.maxEscapees);
                }
            }
            my.sprite.greenSlugGroup.getChildren().forEach(function(gs) {
                gs.setRotation(Phaser.Math.DegToRad(180));
                gs.setScale(1.25);
            });

            // Green slug movement
            my.sprite.greenSlugGroup.children.iterate(function(gs) {
                if (gs.visible) {
                    gs.y += this.greenSlugSpeed;

                    // Initialize speedX property if not already initialized
                    if (gs.speedX === undefined) {
                        gs.speedX = Phaser.Math.Between(-2, 2);
                    }

                    // Change X direction less frequently
                    if (Phaser.Math.Between(1, 40) < 2) { 
                        gs.speedX = Phaser.Math.Between(-1, 1);
                    }

                    // Update X position with the updated speedX
                    gs.x += gs.speedX;

                    // Keep the slug within the screen bounds
                    if (gs.x < 0) {
                        gs.x = 0;
                        gs.speedX *= -1; // Change direction if hitting left boundary
                    } else if (gs.x > game.config.width) {
                        gs.x = game.config.width;
                        gs.speedX *= -1; // Change direction if hitting right boundary
                    }
                }
            }, this);



            //green worm large
            this.greenWormLargeCooldownCounter--;
            let gwl = my.sprite.greenWormLargeGroup.getFirstDead();
            if (gwl != null){
                if (gwl.y <= 10){
                    my.sprite.blueSlugGroup.children.iterate(function(greenWormLarge) {
                        greenWormLarge.health = scene.greenWormLargeInitialHealth;
                    });
            
                }
                if (this.greenWormLargeCooldownCounter < 0 && this.greenWormLargeCount < 2){
                  //console.log("green slug found");
                    gwl.x = Phaser.Math.Between(100, game.config.width-100);
                    gwl.y = 0;
                    gwl.active = true;
                    gwl.visible = true;
                    
                    

                    this.greenWormLargeCooldownCounter = this.greenWormCooldown;
                    this.greenWormLargeCount++;

                }
            }
            my.sprite.greenWormLargeGroup.getChildren().forEach(function(gwl) {
                gwl.setRotation(Phaser.Math.DegToRad(180));
                gwl.setScale(1.25);
            });

            //green worm large movement
            my.sprite.greenWormLargeGroup.children.iterate(function(gwl) {
                if (gwl.visible) {

                    if (gwl.y < 50){
                        gwl.y += this.greenWormLargeSpeed;
                    }
                    // Initialize speedX property if not already initialized
                    if (gwl.speedX === undefined) {
                        gwl.speedX = Phaser.Math.Between(-2, 2);
                    }
                    // Change X direction less frequently
                    if (Phaser.Math.Between(1, 20) < 2) { 
                        gwl.speedX = Phaser.Math.Between(-2, 2);
                    }
                    // Update X position with the updated speedX
                    gwl.x += gwl.speedX;
                    // Keep the worm within the screen bounds
                    if (gwl.x < 0) {
                        gwl.x = 0;
                        gwl.speedX *= -1; // Change direction if hitting left boundary
                    } else if (gwl.x > game.config.width) {
                        gwl.x = game.config.width;
                        gwl.speedX *= -1; // Change direction if hitting right boundary
                    }
                }   
            }, this);

            //infected red
            this.redInfectedCooldownCounter--;
            // console.log(this.redInfectedCooldownCounter);
            let ri = my.sprite.redInfectedGroup.getFirstDead();
            if (ri != null){
                if (ri.y <= 10){
                    my.sprite.redInfectedGroup.children.iterate(function(redInfected) {
                        redInfected.health = scene.redInfectedInitialHealth;
                    });
                }
                if (this.redInfectedCooldownCounter < 0 && this.infectedRedCount < 1){

                    ri.x = Phaser.Math.Between(100, game.config.width-100);
                    ri.y = 0;
                    ri.active = true;
                    ri.visible = true;
                    

                    this.redInfectedCooldownCounter = this.redInfectedCooldown;
                    this.infectedRedCount++;
                }
            }
            my.sprite.redInfectedGroup.getChildren().forEach(function(ri) {
                ri.setRotation(Phaser.Math.DegToRad(0));
                ri.setScale(.5);
            });

            //infected red movement
            my.sprite.redInfectedGroup.children.iterate(function(ri) {
                if (ri != null){
                    if (ri.x <= 0){
                        this.redInfectedSpeedX = -this.redInfectedSpeedX
                    }
                    if (ri.x >= game.config.width){
                        this.redInfectedSpeedX = -this.redInfectedSpeedX;
                    }
                    if (ri.x != null && ri.y != null){
                        if (ri.visible && ri.y < game.config.height) {
                        //console.log("red infected found");
                            ri.x += this.redInfectedSpeedX;
                            ri.y += this.redInfectedSpeedY;
                        }
                    }
                }
            }, this);

            for (let ri of my.sprite.redInfectedGroup.getChildren()){
                if (ri.y >= game.config.height){
                // //console.log("ri made it to end\n");
                    ri.y = -10;
                    ri.active = false;
                    ri.visible = false;
                    // this.escapees += this.redInfectedDamage;
                    // this.escaped.setText('Infected Escaped: ' + this.escapees + "/" + this.maxEscapees);
                }
            }

            if (this.waveSpawnerTimer <= 0) {
                // console.log("wave done spawning");
                this.waverSpawning = false;
                this.waveSpawnerTimer = this.waveSpawnerTimerCooldown;
            }


        }
        
        


    }

    //bullet initialization method
    createBullets() { 
        let my = this.my;

        //initialize bullets
        for (let i = 0; i < this.maxBullets; i++) {
            let bullet = this.add.sprite(-200, -200, "bullet");
            bullet.setScale(0.25);
            bullet.active = false;
            bullet.visible = false;
            my.sprite.bullets.push(bullet);
        }

        //initialize infected bullets
        for (let i = 0; i < this.maxInfectedBullets; i++) {
            let IBullet = this.add.sprite(-200, -200, "infectedBullet");
            IBullet.setScale(.25);
            IBullet.active = false;
            IBullet.visible = false;
            IBullet.x = game.config.width + 300;
            my.sprite.infectedBullets.push(IBullet);
        }

        //initialize worm bullets
        for (let i = 0; i < this.maxwormBullets; i++) {
            let WBullet = this.add.sprite(-200, -200, "wormBullet");
            WBullet.setScale(1);
            WBullet.active = false;
            WBullet.visible = false;
            WBullet.x = game.config.width + 300;
            my.sprite.wormBullets.push(WBullet);
        }
    }

    createEnemies() {
        let my = this.my;

        //initialize green worm small
        my.sprite.greenWormSmallGroup = this.add.group({
            defaultKey: "greenWormSmall",
            maxSize: 20,
        });

        my.sprite.greenWormSmallGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.greenWormSmallGroup.defaultKey,
            repeat: my.sprite.greenWormSmallGroup.maxSize - 1,
            createCallback: function (worm) {
            worm.speedX = Phaser.Math.Between(-2, 2);
            }
        });

        //initialize blue slug group
        my.sprite.blueSlugGroup = this.add.group({
            defaultKey: "blueSlug",
            maxSize: 5,
        });

        my.sprite.blueSlugGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.blueSlugGroup.defaultKey,
            repeat: my.sprite.blueSlugGroup.maxSize - 1,

            createCallback: function (slug) {
                slug.health = 3;
            }
        });

        //initialize green slug group
        my.sprite.greenSlugGroup = this.add.group({
            defaultKey: "greenSlug",
            maxSize: 5,
        });

        my.sprite.greenSlugGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.greenSlugGroup.defaultKey,
            repeat: my.sprite.greenSlugGroup.maxSize - 1,
            
            createCallback: function (slug) {
                slug.speedX = Phaser.Math.Between(-2, 2);
                slug.health = 3;
            }
        });

        // my.sprite.greenSlugGroup.children.iterate(function(slug) {
        //     slug.health = slug.initialHealth;
        // });

        //initialization green worm large group
        my.sprite.greenWormLargeGroup = this.add.group({
            defaultKey: "greenWormLarge",
            maxSize: 2,
        });

        my.sprite.greenWormLargeGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.greenWormLargeGroup.defaultKey,
            repeat: my.sprite.greenWormLargeGroup.maxSize - 1,
            createCallback: function (worm) {
                worm.speedX = Phaser.Math.Between(-2, 2);
                worm.health = 9;
            }
        });

        //initialization infected red group
        my.sprite.redInfectedGroup = this.add.group({
            defaultKey: "redAlien",
            maxSize: 1,
        });

        my.sprite.redInfectedGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.redInfectedGroup.defaultKey,
            repeat: my.sprite.redInfectedGroup.maxSize - 1,
            createCallback: function (infected) {
                infected.health = 9;
            }
        });

    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    restart() {
        let my = this.my;
        // Reset player starting location
        this.player.destroy;
        // Reset player movement variables
        this.moveLeft = null;
        this.moveRight = null;
        this.playerSpeed = 10;

        // Reset player health
        this.playerHealth = 5;

        // Enable player visibility and activity


        // Set player position
        my.sprite.player.setPosition(this.playerX, this.playerY);
        for (let bullet of my.sprite.bullets){
            bullet.visible = false;
            bullet.active = false;
            bullet.x = -150;
            bullet.y = -150;
        }
        for (let IBullet of my.sprite.infectedBullets){
            IBullet.visible = false;
            IBullet.active = false;
            IBullet.x = -150;
            IBullet.y = -150;
        }
        for (let WBullet of my.sprite.wormBullets){
            WBullet.visible = false;
            WBullet.active = false;
            WBullet.x = -150;
            WBullet.y = -150;
        }
        
        // Reset player starting location
        this.playerX = game.config.width / 2;
        this.playerY = game.config.height - 25;
    
        // Reset player movement variables
        this.moveLeft = null;
        this.moveRight = null;
        this.playerSpeed = 10;
    
        // Reset enemy movement speeds
        this.greenWormSmallSpeedY = 2;
        this.greenWormSmallSpeedX = 2;
        this.greenSlugSpeed = 0.5;
        this.blueSlugSpeed = 2;
        this.greenWormLargeSpeed = 0.5;
        this.redInfectedSpeed = 3;
    
        // Reset bullet variables
        this.maxBullets = 20;
        this.bulletCooldown = 2;
        this.bulletCooldownCounter = 0;
        this.bulletSpeed = 7;
    
        // Reset infected bullet variables
        this.maxInfectedBullets = 20;
        this.infectedBulletCooldown = 40;
        this.infectedBulletCooldownCounter = 0;
        this.infectedBulletSpeed = 3;
    
        // Reset worm bullet variables
        this.maxwormBullets = 20;
        this.wormBulletCooldown = 60;
        this.wormBulletCooldownCounter = 0;
        this.wormBulletSpeed = 3;
    
        // Reset score and points variables
        this.score = 0;
        this.greenWormSmallPoints = 5;
        this.greenSlugPoints = 15;
        this.blueSlugPoints = 20;
        this.greenWormLargePoints = 100;
        this.infectedRedPoints = 500;
    
        // Reset health, hitpoints, and damage variables
        this.playerHealth = 5;
        this.maxEscapees = 20;
        this.greenWormSmallDamage = 1;
        this.slugDamage = 5;
        this.redInfectedDamage = 20;
        this.blueSlugInitialHealth = 3;
        this.greenSlugInitialHealth = 3;
        this.greenWormLargeInitialHealth = 9;
        this.redInfectedInitialHealth = 9;
    
        // Reset wave variables
        this.waveTimer = 10;
        this.waveTimerCooldown = 800;
        this.waveNumber = 0;
        this.waveSpawning = false;
        this.waveSpawnerTimer = 600;
        this.waveSpawnerTimerCooldown = 600;
    
        // Reset enemy variables
        this.greenWormSmallSpeed = 2;
        this.greenWormSmallCooldown = 5;
        this.greenWormSmallCooldownCounter = 0;
        this.greenWormSmallCount = 0;
    
        this.blueSlugSpeed = 1;
        this.blueSlugCooldown = 10;
        this.blueSlugCooldownCounter = 10;
        this.blueSlugMoveCooldown = 30;
        this.blueSlugMoveCooldownCounter = 0;
        this.blueSlugJump = 30;
        this.blueSlugCount = 0;
    
        this.greenSlugSpeed = 1;
        this.greenSlugCooldown = 25;
        this.greenSlugCooldownCounter = 5;
        this.greenSlugMoveCooldown = 30;
        this.greenSlugMoveCooldownCounter = 0;
        this.greenSlugCount = 0;
    
        this.greenWormLargeSpeed = 1;
        this.greenWormLargeCooldown = 55;
        this.greenWormLargeCooldownCounter = 200;
        this.greenWormLargeCount = 0;
    
        this.redInfectedSpeedX = 3;
        this.redInfectedSpeedY = 1;
        this.redInfectedCooldown = 600;
        this.redInfectedCooldownCounter = 400;
        this.infectedRedCount = 0;

        my.sprite.greenWormSmallGroup.children.iterate(function(enemy) {
            enemy.visible = false;
            enemy.active = false;
            enemy.x = -200;
            enemy.y = -200;
        });
    
        my.sprite.greenSlugGroup.children.iterate(function(enemy) {
            enemy.visible = false;
            enemy.active = false;
            enemy.x = -200;
            enemy.y = -200;
        });
    
        my.sprite.blueSlugGroup.children.iterate(function(enemy) {
            enemy.visible = false;
            enemy.active = false;
            enemy.x = -200;
            enemy.y = -200;
        });
    
        my.sprite.greenWormLargeGroup.children.iterate(function(enemy) {
            enemy.visible = false;
            enemy.active = false;
            enemy.x = -200;
            enemy.y = -200;
        });
    
        my.sprite.redInfectedGroup.children.iterate(function(enemy) {
            enemy.visible = false;
            enemy.active = false;
            enemy.x = -200;
            enemy.y = -200;
        });
        this.create();
    }

    
}