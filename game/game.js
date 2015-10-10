//
// Copyright 2014 <c4miloei@gmail.com> (@camiloei at twitter)
// All the resources (graphics, code, sounds) were made by me, except the bitmap font.
// This software is distributed under the MIT License.
// (See accompanying file LICENSE or copy at)
// http://opensource.org/licenses/MIT)
//
var AstroCipher = (function() {
  var init = function() {
    if (navigator.isCocoonJS) {
      cocoonjsphaser.utils.fixDOMParser();
    }
    var w = window.innerWidth * window.devicePixelRatio;
    var h = window.innerHeight * window.devicePixelRatio;
    this.game = new Phaser.Game((h > w) ? h : w, (h > w) ? w : h, Phaser.CANVAS, 'gameCanvas');

    this.game.state.add('Boot', BootState);
    this.game.state.add('Preload', PreloadState);
    this.game.state.add('Menu', MenuState);
    this.game.state.add('Play', PlayState);

    this.game.state.start('Boot');
  };

  var BootState = {
    preload: function() {
      this.game.load.image('load_bar', 'assets/load_bar.png');
      var fileFormat = (this.game.device.cocoonJS) ? '.json' : '.xml';
      this.game.load.bitmapFont('font', 'assets/font.png', 'assets/font' + fileFormat);
    },
    create: function() {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.input.maxPointers = 1;
      this.game.stage.disableVisibilityChange = true;
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.pageAlignVeritcally = true;
      this.game.scale.setScreenSize(true);
      this.game.scale.forceLandscape = true;
      this.game.scale.setShowAll();
      this.game.scale.refresh();
      this.game.state.start('Preload');
    }
  };

  var PreloadState = {
    preload: function() {

      this.game.add.bitmapText(this.game.world.centerX - 55, this.game.world.centerY - 30, 'font', "Loading", 40);
      var loadBar = this.game.add.sprite(this.game.world.centerX - 58, this.game.world.centerY, 'load_bar');

      this.game.load.setPreloadSprite(loadBar, 0);

      this.game.load.spritesheet('astronaut', 'assets/astronaut.png', 33, 60);
      this.game.load.spritesheet('start_platform', 'assets/startPlatform.png', 40, 6);
      this.game.load.image('ui_share', 'assets/ui_share.png');
      this.game.load.image('avatar', 'assets/avatar.png')
      this.game.load.image('star', 'assets/star_particle.png');
      this.game.load.image('green_block', 'assets/green_block.png');
      this.game.load.image('pink_block', 'assets/pink_block.png');
      this.game.load.image('blue_block', 'assets/blue_block.png');
      this.game.load.image('orange_block', 'assets/orange_block.png');
      this.game.load.image('rainbow_block', 'assets/rainbow_block.png');
      this.game.load.image('bomb_block', 'assets/bomb_block.png');
      this.game.load.audio('jump', 'assets/sfx/jump.wav');
      this.game.load.audio('score', 'assets/sfx/score.wav');
      this.game.load.audio('pickup', 'assets/sfx/pickup.wav');
      this.game.load.audio('explode', 'assets/sfx/explode.wav');
    },
    create: function() {
      this.game.state.start('Menu');
    }
  };

  var MenuState = {
    create: function() {

      this.menuElements = this.game.add.group();
      this.astronaut = this.menuElements.create(this.game.world.centerX - 15, this.game.world.centerY - 120, 'astronaut');
      var scaleRatio = this.game.width / this.game.height;
      this.astronaut.scale.setTo(1 * scaleRatio, 1 * scaleRatio);

      this.instructions = this.game.add.group();

      this.instructions.create(this.game.world.centerX - 300, this.game.world.centerY + 180, 'green_block');
      this.instructions.create(this.game.world.centerX - 260, this.game.world.centerY + 180, 'green_block');
      this.instructions.create(this.game.world.centerX - 220, this.game.world.centerY + 180, 'green_block');
      this.instructions.create(this.game.world.centerX - 300, this.game.world.centerY + 220, 'pink_block');
      this.instructions.create(this.game.world.centerX - 260, this.game.world.centerY + 220, 'blue_block');
      this.instructions.create(this.game.world.centerX - 220, this.game.world.centerY + 220, 'orange_block');
      this.game.add.bitmapText(this.game.world.centerX - 160, this.game.world.centerY + 173, 'font', "= Give points", 64);
      this.game.add.bitmapText(this.game.world.centerX - 160, this.game.world.centerY + 215, 'font', "= Make you lose", 64);
      this.game.add.bitmapText(this.game.world.centerX - 160, this.game.world.centerY + 260, 'font', "beware of falling down!", 64);
      var title = this.game.add.bitmapText(this.game.world.centerX - 370, this.game.world.centerY - 280, 'font', "ASTRO CIPHER", 140);
      title.align = "center";

      this.tapMsg = this.game.add.bitmapText(this.game.world.centerX - 60, this.game.world.centerY + 10, 'font', "TAP TO\nSTART", 64);
      this.tapMsg.align = "center";

    },
    update: function() {
      this.astronaut.x = this.game.world.centerX - 15;
      this.astronaut.y = this.game.world.centerY - 120;
      if(this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown) {
        this.game.state.start('Play');
      }
    },
    render: function() {
      //this.game.debug.pointer(this.game.input.mousePointer);
      //this.game.debug.pointer(this.game.input.pointer1);
      //this.game.debug.spriteInfo(this.astronaut, 200, 32);
    }
  };

  var PlayState = {
    create: function() {

      this.jumpSound = this.game.add.audio('jump');
      this.scoreSound = this.game.add.audio('score');
      this.pickupSound = this.game.add.audio('pickup');
      this.explodeSound = this.game.add.audio('explode');

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.stage.backgroundColor = "#000000";
      this.stage.disableVisibilityChange = true;
      this.started = false;
      this.timer = 0;
      this.levels = { velocityFactor: 1, currentLevel: { number: 1, passed: false } };
      this.lastJump = 0;
      this.canJump = true;
      this.score = 0;
      this.bestScore = 0;
      this.alreadyDead = false;
      this.canReplay = false;

      this.emitter = this.game.add.emitter(this.game.world.width, 0, 50);
      this.emitter.angle = -270;
      this.emitter.width = this.game.world.width;
      this.emitter.height = this.game.world.height * 2;
      this.emitter.makeParticles('star');

      this.emitter.minParticleScale = 0.07;
      this.emitter.maxParticleScale = 0.2;
      this.emitter.emitX = 110;
      this.emitter.emitY = -800;
      this.emitter.setYSpeed(800, 100);
      this.emitter.setXSpeed(0, 0);
      this.emitter.minRotation = 0;
      this.emitter.maxRotation = 0;

      this.startPlatform = this.game.add.sprite(this.game.world.centerX - 18, this.game.world.centerY, 'start_platform');
      this.scaleElement(this.startPlatform);
      this.startPlatform.animations.add('idle', [0, 1, 2], 10, true);
      this.startPlatform.animations.play('idle');

      this.astronaut = this.game.add.sprite(this.game.world.centerX - 15, this.startPlatform.y, 'astronaut');
      this.astronaut.y = this.startPlatform.y - 60 * (this.game.width / this.game.height);
      this.scaleElement(this.astronaut);
      this.astronaut.animations.add('right', [1, 2], 10, true);

      this.startTween = this.game.add.tween(this.astronaut);
      this.startTween2 = this.game.add.tween(this.startPlatform);
      this.startTween.to({y: this.astronaut.y + 14}, 1000, null, true, 0, Number.MAX_VALUE ,true);
      this.startTween2.to({y: this.startPlatform.y + 13}, 1000, null, true, 0, Number.MAX_VALUE ,true);

      this.game.physics.arcade.enable(this.astronaut);
      this.astronaut.body.collideWorldBounds = true;
      this.astronaut.body.allowGravity = true;

      this.greenBlocks = this.game.add.group();
      this.scaleElement(this.greenBlocks);
      this.game.physics.arcade.enable(this.greenBlocks);
      this.greenBlocks.enableBody = true;
      this.greenBlocks.createMultiple(15, 'green_block', 0, false);

      this.pinkBlocks = this.game.add.group();
      this.scaleElement(this.pinkBlocks);
      this.game.physics.arcade.enable(this.pinkBlocks);
      this.pinkBlocks.enableBody = true;
      this.pinkBlocks.createMultiple(15, 'pink_block', 0, false);

      this.blueBlocks = this.game.add.group();
      this.scaleElement(this.blueBlocks);
      this.game.physics.arcade.enable(this.blueBlocks);
      this.blueBlocks.enableBody = true;
      this.blueBlocks.createMultiple(15, 'blue_block', 0, false);

      this.orangeBlocks = this.game.add.group();
      this.scaleElement(this.orangeBlocks);
      this.game.physics.arcade.enable(this.orangeBlocks);
      this.orangeBlocks.enableBody = true;
      this.orangeBlocks.createMultiple(15, 'orange_block', 0, false);

      this.rainbowBlocks = this.game.add.group();
      this.scaleElement(this.rainbowBlocks);
      this.game.physics.arcade.enable(this.rainbowBlocks);
      this.rainbowBlocks.enableBody = true;
      this.rainbowBlocks.createMultiple(5, 'rainbow_block', 0, false);

      this.bombBlocks = this.game.add.group();
      this.scaleElement(this.bombBlocks);
      this.game.physics.arcade.enable(this.bombBlocks);
      this.bombBlocks.enableBody = true;
      this.bombBlocks.createMultiple(5, 'bomb_block', 0, false);

      this.blockPile = this.game.add.group();
      this.scaleElement(this.blockPile);

      this.scoreText = this.game.add.bitmapText(95, 2, 'font', "SCORE 0", 64);
      this.levelText = this.game.add.bitmapText(95, 70, 'font', "LEVEL 1", 64);
      if(store.enabled) {
        this.bestScoreText = this.game.add.bitmapText(95, 36, 'font', "BEST 0", 64);
      } else {
        this.bestScoreText = this.game.add.bitmapText(95, 2, 'font', "", 64);;
      }

      this.bestScore = parseInt(this.getBestScore());
      this.setBestScoreText(this.bestScore);

      this.uiShare = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ui_share');
      this.scaleElement(this.uiShare);
      this.uiShare.alpha = 0;
      this.uiShare.kill();

    },
    update: function() {

      if(this.started == true) {

        if(this.startPlatform.exists) {
          this.startPlatform.x -= 15;
          if(this.startPlatform.x < 0) {
            this.startPlatform.destroy();
          }
        }

        if(this.startTween.isRunning || this.startTween2.isRunning) {
          this.startTween.stop();
          this.startTween2.stop();
        }

        this.game.physics.arcade.overlap(this.astronaut, this.greenBlocks, function(astronaut, block) {
          this.playSoundSafe(this.pickupSound);
          this.addToPile(0);
          block.kill();
        }, null, this);
        this.game.physics.arcade.overlap(this.astronaut, this.pinkBlocks, function(astronaut, block) {
          this.playSoundSafe(this.pickupSound);
          this.addToPile(1);
          block.kill();
        }, null, this);

        this.game.physics.arcade.overlap(this.astronaut, this.blueBlocks, function(astronaut, block) {
          this.playSoundSafe(this.pickupSound);
          this.addToPile(2);
          block.kill();
        }, null, this);

        this.game.physics.arcade.overlap(this.astronaut, this.orangeBlocks, function(astronaut, block) {
          this.playSoundSafe(this.pickupSound);
          this.addToPile(3);
          block.kill();
        }, null, this);

        this.game.physics.arcade.overlap(this.astronaut, this.rainbowBlocks, function(astronaut, block) {
          this.playSoundSafe(this.pickupSound);
          this.addToPile(Math.floor((Math.random() * 3) + 0));
          block.kill();
        }, null, this);

        this.game.physics.arcade.overlap(this.astronaut, this.bombBlocks, function(astronaut, block) {
          this.playSoundSafe(this.explodeSound);
          if(this.blockPile.getTop()) this.blockPile.remove(this.blockPile.getTop());
          block.kill();
        }, null, this);

        this.astronaut.body.gravity.y = 1700;
        this.startEmitter();

        this.lastJump -= 1;
        if(this.lastJump <= 0) {
          this.canJump = true;
        } else {
          this.canJump = false;
        }

        if((this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown && this.canJump == true) && this.alreadyDead == false) {
          this.astronaut.body.velocity.y = -600;
          this.lastJump = 28;
          this.playSoundSafe(this.jumpSound);
        }

        this.timer += this.game.time.elapsed;
        var respawnFactor = 550 - (50 * (this.levels.velocityFactor - 1));
        if(respawnFactor <= 30) {
          respawnFactor = 30;
        }
        if(this.timer >= respawnFactor) {
          this.timer -= respawnFactor;
          var random = Math.floor((Math.random() * 6) + 1);
          switch(random) {
            case 1:
              var greenblock = this.greenBlocks.getFirstDead();
              if(greenblock) greenblock.reset(this.game.world.width, this.game.world.randomY);
              break;
            case 2:
              var pinkBlock = this.pinkBlocks.getFirstDead();
              if(pinkBlock) pinkBlock.reset(this.game.world.width, this.game.world.randomY);
              break;
            case 3:
              var blueBlock = this.blueBlocks.getFirstDead();
              if(blueBlock) blueBlock.reset(this.game.world.width, this.game.world.randomY);
              break;
            case 4:
              var orangeBlock = this.orangeBlocks.getFirstDead();
              if(orangeBlock) orangeBlock.reset(this.game.world.width, this.game.world.randomY);
              break;
            case 5:
              var rainbowBlock = this.rainbowBlocks.getFirstDead();
              if(rainbowBlock) rainbowBlock.reset(this.game.world.width, this.game.world.randomY);
              break;
            case 6:
              var bombBlock = this.bombBlocks.getFirstDead();
              if(bombBlock) bombBlock.reset(this.game.world.width, this.game.world.randomY);
              break;
          }
        }

        var self = this;

        this.greenBlocks.forEachAlive(function(block) {
          block.x -= 3 + (1 * self.levels.velocityFactor);
          if(block.x < 0) {
            block.kill();
          }
        });
        this.pinkBlocks.forEachAlive(function(block) {
          block.x -= 3 + (1 * self.levels.velocityFactor);
          if(block.x < 0) {
            block.kill();
          }
        });

        this.blueBlocks.forEachAlive(function(block) {
          block.x -= 3 + (1 * self.levels.velocityFactor);
          if(block.x < 0) {
            block.kill();
          }
        });

        this.orangeBlocks.forEachAlive(function(block) {
          block.x -= 3 + (1 * self.levels.velocityFactor);
          if(block.x < 0) {
            block.kill();
          }
        });

        this.rainbowBlocks.forEachAlive(function(block) {
          block.x -= 3 + (1 * self.levels.velocityFactor);
          if(block.x < 0) {
            block.kill();
          }
        });

        this.bombBlocks.forEachAlive(function(block) {
          block.x -= 3 + (1 * self.levels.velocityFactor);
          if(block.x < 0) {
            block.kill();
          }
        });

        if(this.blockPile.countLiving() >= 10 && this.alreadyDead == false) {

          if(this.score >= this.bestScore) {
            store.set('bestScore', this.score.toString());
          }

          this.alreadyDead = true;
          this.playSoundSafe(this.explodeSound);
          this.astronaut.kill();

          this.dieSequence();
        }

        if(this.astronaut.y >= (this.game.world.height - this.astronaut.height) && this.alreadyDead == false) {

          if(this.score >= this.bestScore) {
            store.set('bestScore', this.score.toString());
          }

          this.alreadyDead = true;
          this.playSoundSafe(this.explodeSound);
          this.astronaut.kill();

          this.dieSequence();
        }

        if(this.alreadyDead == true && (this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown) && this.canReplay == true) {
          this.alreadyDead = false;
          this.canReplay = false;
          this.game.state.start('Play');
        }

        if(this.score >= this.bestScore) {
          this.setBestScoreText(this.score);
          this.bestScore = this.score;
        }

        this.checkPile();

        if(this.score > 10 && this.score < 30 && this.levels.currentLevel.number == 1 && this.levels.currentLevel.passed == false) {
          this.levels.currentLevel.passed = true;
        } else if(this.score > 30 && this.score < 80 && this.levels.currentLevel.number == 2 && this.levels.currentLevel.passed == false) {
          this.levels.currentLevel.passed = true;
        } else if(this.score > 80 && this.score < 150 && this.levels.currentLevel.number == 3 && this.levels.currentLevel.passed == false) {
          this.levels.currentLevel.passed = true;
        } else if(this.score > 150 && this.score < 220 && this.levels.currentLevel.number == 4 && this.levels.currentLevel.passed == false) {
          this.levels.currentLevel.passed = true;
        } else if(this.score > 220 && this.score < 320 && this.levels.currentLevel.number == 5 && this.levels.currentLevel.passed == false) {
          this.levels.currentLevel.passed = true;
        } else if(this.score > 320 && this.score < 420 && this.levels.currentLevel.number == 6 && this.levels.currentLevel.passed == false) {
          this.levels.currentLevel.passed = true;
        } else if(this.score > 420 && this.score < 540 && this.levels.currentLevel.number == 7 && this.levels.currentLevel.passed == false) {
          this.levels.currentLevel.passed = true;
        } else if(this.score > 540 && this.score < 660 && this.levels.currentLevel.number == 8 && this.levels.currentLevel.passed == false) {
          this.levels.currentLevel.passed = true;
        } else if(this.score > 660 && this.score < 860 && this.levels.currentLevel.number == 9 && this.levels.currentLevel.passed == false) {
          this.levels.currentLevel.passed = true;
        } else if(this.score > 860 && this.score < 1100 && this.levels.currentLevel.number == 10 && this.levels.currentLevel.passed == false) {
          this.levels.currentLevel.passed = true;
        } else if(this.score > 1100 && this.levels.currentLevel.number == 11 && this.levels.currentLevel.passed == false) {
          this.levels.currentLevel.passed = true;
        }

        if(this.levels.currentLevel.number == 1 && this.levels.currentLevel.passed == true) {
          this.levels.velocityFactor += 1;
          this.levels.currentLevel.number = 2;
          this.updateLevelText(this.levels.currentLevel.number);
          this.levels.currentLevel.passed = false;
        } else if(this.levels.currentLevel.number == 2 && this.levels.currentLevel.passed == true) {
          this.levels.velocityFactor += 1;
          this.levels.currentLevel.number = 3;
          this.updateLevelText(this.levels.currentLevel.number);
          this.levels.currentLevel.passed = false;
        } else if(this.levels.currentLevel.number == 3 && this.levels.currentLevel.passed == true) {
          this.levels.velocityFactor += 1;
          this.levels.currentLevel.number = 4;
          this.updateLevelText(this.levels.currentLevel.number);
          this.levels.currentLevel.passed = false;
        } else if(this.levels.currentLevel.number == 4 && this.levels.currentLevel.passed == true) {
          this.levels.velocityFactor += 1;
          this.levels.currentLevel.number = 5;
          this.updateLevelText(this.levels.currentLevel.number);
          this.levels.currentLevel.passed = false;
        } else if(this.levels.currentLevel.number == 5 && this.levels.currentLevel.passed == true) {
          this.levels.velocityFactor += 1;
          this.levels.currentLevel.number = 6;
          this.updateLevelText(this.levels.currentLevel.number);
          this.levels.currentLevel.passed = false;
        } else if(this.levels.currentLevel.number == 6 && this.levels.currentLevel.passed == true) {
          this.levels.velocityFactor += 1;
          this.levels.currentLevel.number = 7;
          this.updateLevelText(this.levels.currentLevel.number);
          this.levels.currentLevel.passed = false;
        } else if(this.levels.currentLevel.number == 7 && this.levels.currentLevel.passed == true) {
          this.levels.velocityFactor += 1;
          this.levels.currentLevel.number = 8;
          this.updateLevelText(this.levels.currentLevel.number);
          this.levels.currentLevel.passed = false;
        } else if(this.levels.currentLevel.number == 8 && this.levels.currentLevel.passed == true) {
          this.levels.velocityFactor += 1;
          this.levels.currentLevel.number = 9;
          this.updateLevelText(this.levels.currentLevel.number);
          this.levels.currentLevel.passed = false;
        } else if(this.levels.currentLevel.number == 9 && this.levels.currentLevel.passed == true) {
          this.levels.velocityFactor += 1;
          this.levels.currentLevel.number = 10;
          this.updateLevelText(this.levels.currentLevel.number);
          this.levels.currentLevel.passed = false;
        } else if(this.levels.currentLevel.number == 10 && this.levels.currentLevel.passed == true) {
          this.levels.velocityFactor += 3;
          this.levels.currentLevel.number = 11;
          this.levelText.setText("LEVEL " + "SUPER STAR");
          this.levels.currentLevel.passed = false;
        }

      }

      // if session is ready ends here

      if(this.started == false && (this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown)) {
        this.started = true;
        this.astronaut.animations.play('right');
      }

    },
    dieSequence: function() {
      var emitterTween = this.game.add.tween(this.emitter);
      emitterTween.to({alpha: 0}, 600, null, true, 0, 0, false);

      var centerScreenX = this.game.world.centerX - (this.uiShare.width / 2),
      centerScreenY = this.game.world.centerY - (this.uiShare.height / 2);

      var shareText = this.game.add.bitmapText(centerScreenX, centerScreenY, 'font', "SCORE: 0", 45),
      shareText2 = this.game.add.bitmapText(centerScreenX, centerScreenY, 'font', "BEST: 0", 45),
      shareText3 = this.game.add.bitmapText(centerScreenX, centerScreenY, 'font', "TAP TO REPLAY", 45);

      var avatar = this.game.add.sprite(centerScreenX, centerScreenX, 'avatar');
      avatar.x = centerScreenX + (this.uiShare.width / 11);
      avatar.y = centerScreenY + (this.uiShare.height / 6);
      avatar.alpha = 0;

      shareText.x = centerScreenX + (this.uiShare.width / 2.4);
      shareText.y = centerScreenY + (this.uiShare.height / 5);

      shareText2.x = centerScreenX + (this.uiShare.width / 2.4);
      shareText2.y = centerScreenY + (this.uiShare.height / 3);

      shareText3.x = centerScreenX + (this.uiShare.width / 11);
      shareText3.y = centerScreenY + (this.uiShare.height / 1.4);

      shareText.alpha = 0;
      shareText2.alpha = 0;
      shareText3.alpha = 0;

      shareText.setText("SCORE: " + this.score);
      shareText2.setText("BEST: " + this.bestScore);

      var self = this,
      shareTween = this.game.add.tween(this.uiShare),
      shareTween2 = this.game.add.tween(shareText),
      shareTween3 = this.game.add.tween(shareText2),
      shareTween4 = this.game.add.tween(shareText3),
      shareTween5 = this.game.add.tween(avatar);

      shareTween5.onComplete.add(function() {
        self.canReplay = true;
      }, this);

      this.uiShare.reset(centerScreenX, centerScreenY);

      shareTween.to({alpha: 1}, 500, null, true, 0, 0, false).start();
      shareTween2.to({alpha: 1}, 500, null, true, 0, 0, false).start();
      shareTween3.to({alpha: 1}, 500, null, true, 0, 0, false).start();
      shareTween4.to({alpha: 1}, 500, null, true, 0, 0, false).start();
      shareTween5.to({alpha: 1}, 500, null, true, 0, 0, false).start();

    },
    getBestScore: function() {
      var bestScore = store.get('bestScore');
      if(bestScore) {
        return bestScore;
      } else {
        return 0;
      }
    },
    setBestScoreText: function(score) {
      this.bestScoreText.setText("BEST " + score);
    },
    playSoundSafe: function(sound) {
      if(sound.isPlaying) {
        sound.restart();
      } else {
        sound.play("", 0, 0.5, false, true);
      }
    },
    scaleElement: function(element) {
      if(!element) return 1;
      var scaleRatio = this.game.width / this.game.height;

      element.scale.setTo(1 * scaleRatio, 1 * scaleRatio);
    },
    render: function() {
      //this.game.debug.pointer(this.game.input.mousePointer);
      //this.game.debug.pointer(this.game.input.pointer1);
      //this.game.debug.spriteInfo(this.astronaut, 500, 32);
      //this.game.debug.spriteInfo(this.startPlatform, 200, 400);
    },
    startEmitter: function() {
      this.emitter.start(false, 1200, 3, 0);
    },
    addToPile: function(type) {
      var posFactor = this.blockPile.countLiving();
      switch(type) {
        case 0:
          this.blockPile.create(5, 2 + 35 * posFactor, 'green_block', true);
          break;
        case 1:
          this.blockPile.create(5, 2 + 35 * posFactor, 'pink_block', true);
          break;
        case 2:
          this.blockPile.create(5, 2 + 35 * posFactor, 'blue_block', true);
          break;
        case 3:
          this.blockPile.create(5, 2 + 35 * posFactor, 'orange_block', true);
          break;
      }
    },
    updateScoreText: function(score) {
      this.scoreText.setText("SCORE " + score);
    },
    updateLevelText: function(level) {
      this.levelText.setText("LEVEL " + level);
    },
    checkPile: function() {
      var cache = { g: { count: 0, blocks: [] },
                    p: { count: 0, blocks: [] },
                    b: { count: 0, blocks: [] },
                    o: { count: 0, blocks: [] } };
      this.blockPile.forEachAlive(function(block) {
        switch(block.key) {
          case "green_block":
            cache.g.count += 1;
            cache.g.blocks.push(block);
            cache.p.count = 0;
            cache.p.blocks.length = 0;
            cache.b.count = 0;
            cache.b.blocks.length = 0;
            cache.o.count = 0;
            cache.o.blocks.length = 0;
            break;
          case "pink_block":
            cache.g.count = 0;
            cache.g.blocks.length = 0;
            cache.p.count += 1;
            cache.p.blocks.push(block);
            cache.b.count = 0;
            cache.b.blocks.length = 0;
            cache.o.count = 0;
            cache.o.blocks.length = 0;
            break;
          case "blue_block":
            cache.g.count = 0;
            cache.g.blocks.length = 0;
            cache.p.count = 0;
            cache.p.blocks.length = 0;
            cache.b.count += 1;
            cache.b.blocks.push(block);
            cache.o.count = 0;
            cache.o.blocks.length = 0;
            break;
          case "orange_block":
            cache.g.count = 0;
            cache.g.blocks.length = 0;
            cache.p.count = 0;
            cache.p.blocks.length = 0;
            cache.b.count = 0;
            cache.b.blocks.length = 0;
            cache.o.count += 1;
            cache.o.blocks.push(block);
            break;
        }
      });
      if(cache.g.count >= 3) {
        this.score += 10;
        if(this.pickupSound.isPlaying) {
          this.pickupSound.stop();
        }
        this.playSoundSafe(this.scoreSound);
        this.updateScoreText(this.score);
        this.blockPile.remove(cache.g.blocks[0]);
        this.blockPile.remove(cache.g.blocks[1]);
        this.blockPile.remove(cache.g.blocks[2]);
        cache.g.count = 0;
        cache.g.blocks.length = 0;
      } else if(cache.p.count >= 3) {
        this.score += 10;
        if(this.pickupSound.isPlaying) {
          this.pickupSound.stop();
        }
        this.playSoundSafe(this.scoreSound);
        this.updateScoreText(this.score);
        this.blockPile.remove(cache.p.blocks[0]);
        this.blockPile.remove(cache.p.blocks[1]);
        this.blockPile.remove(cache.p.blocks[2]);
        cache.p.count = 0;
        cache.p.blocks.length = 0;
      } else if(cache.b.count >= 3) {
        this.score += 10;
        if(this.pickupSound.isPlaying) {
          this.pickupSound.stop();
        }
        this.playSoundSafe(this.scoreSound);
        this.updateScoreText(this.score);
        this.blockPile.remove(cache.b.blocks[0]);
        this.blockPile.remove(cache.b.blocks[1]);
        this.blockPile.remove(cache.b.blocks[2]);
        cache.b.count = 0;
        cache.b.blocks.length = 0;
      } else if(cache.o.count >= 3) {
        this.score += 10;
        if(this.pickupSound.isPlaying) {
          this.pickupSound.stop();
        }
        this.playSoundSafe(this.scoreSound);
        this.updateScoreText(this.score);
        this.blockPile.remove(cache.o.blocks[0]);
        this.blockPile.remove(cache.o.blocks[1]);
        this.blockPile.remove(cache.o.blocks[2]);
        cache.o.count = 0;
        cache.o.blocks.length = 0;
      }
    }
  };

  return {
    init: init
  };

})();
