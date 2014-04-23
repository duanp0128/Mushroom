/**
 * 2014-4-16
 * User: Abel
 */

var g_GameZOder = {bg: 0, ui: 1, front: 100};//gamelayer distance
var g_GameStatus={normal:0,stop:1,gameOver:2};
var GameScene = cc.Scene.extend({
    gameLayer: null, //all game elements be added in this layer
    mushroom: null,
    bear: null,
    lblScore: null,//score label
    score: 0,//score
    lblLives: null, //live label
    lives: 5, //lives
    btnStart: null,  //begin button
    leafList: [],//leaf array
    acornList: [],//acorn array
    flowerList: [],//flowers array
    winSize: cc.size(480, 320),
    gameStatus: 0,//game status，0：normal，1：pause

    onEnter: function () {
        this._super();
        this.initData();
        this.schedule(this.update, 0);
    },
    /**
     * initial data
     */
    initData: function () {
        this.winSize = cc.Director.getInstance().getWinSize();//get current windows size
        this.lives = 5;//initial lives
        this.score = 0;//initial score
        this.gameStatus =  g_GameStatus.stop;

        //Add Layer
        this.gameLayer = cc.Layer.create();
        this.addChild(this.gameLayer);

        //Add Background
        var bg = cc.Sprite.create(s_forest1);
        bg.setAnchorPoint(cc.p(0, 0));
        this.gameLayer.addChild(bg, g_GameZOder.bg);

        //Add Mushroom
        this.mushroom = new MushroomSprite();
        this.mushroom.setAnchorPoint(cc.p(0.5, 0));
        this.mushroom.setPosition(cc.p(240, 0));
        this.gameLayer.addChild(this.mushroom, g_GameZOder.ui);

        //Add Bear
        this.bear = new BearSprite();
        this.gameLayer.addChild(this.bear, g_GameZOder.ui);
        this.bear.initData();
        this.bear.curSence = this;

        //Add score background
        var bgScore = cc.Sprite.create(s_score);
        bgScore.setAnchorPoint(cc.p(1, 1));
        bgScore.setPosition(cc.p(this.winSize.width, this.winSize.height));
        this.gameLayer.addChild(bgScore, g_GameZOder.bg);

        //Add score label
        this.lblScore = cc.LabelTTF.create("0", "Arial", 18);
        this.lblScore.setPosition(cc.p(this.winSize.width - 30, this.winSize.height - 21));
        this.lblScore.setColor(cc.c3b(117, 76, 36));
        this.gameLayer.addChild(this.lblScore, g_GameZOder.ui);

        //Lives
        this.lblLives = cc.Sprite.create(s_lives4);
        this.lblLives.setAnchorPoint(cc.p(0, 1));
        this.lblLives.setPosition(cc.p(0, this.winSize.height));
        this.gameLayer.addChild(this.lblLives, g_GameZOder.bg);

        //Begin Button
        var start1 = cc.Sprite.create(s_start_button);
        var start2 = cc.Sprite.create(s_start_button);
        //cc.MenuItemSprite para1：normal para2：pressed para3：execute function para4：this
        this.btnStart = cc.MenuItemSprite.create(start1, start2, this.startGame, this);

        var infoMenu = cc.Menu.create(this.btnStart);
        this.gameLayer.addChild(infoMenu, g_GameZOder.front);

        //Initial prizes
        this.initAcorn();
        this.initFlower();
        this.initLeaf();

    },

    startGame: function () {
        if(this.gameStatus == g_GameStatus.gameOver){
               this.resetData();
        }
        this.gameStatus = g_GameStatus.normal;
        this.bear.beginRotate();
        this.btnStart.setVisible(false);
    },

    overGame:function(){
        this.gameStatus = g_GameStatus.gameOver;
        this.bear.stopRotate();
        this.btnStart.setVisible(true);
    },

    resetData:function(){
        this.lives = 5;
        this.lblLives.initWithFile("res/lives5.png");

        //reset mushroom status
        this.mushroom.setPosition(cc.p(240, 0));
        //reset bear status
        this.bear.initData();
        //reset prizes
        for (var i = 0; i < this.leafList.length; i++) {
            var prize = this.leafList[i];
            prize.isHit= false;
            prize.setVisible(true);
        }
        //reset flowers
        for (var i = 0; i < this.flowerList.length; i++) {
            var prize = this.flowerList[i];
            prize.isHit= false;
            prize.setVisible(true);
        }
        //reset acorn
        for (var i = 0; i < this.acornList.length; i++) {
            var prize = this.acornList[i];
            prize.isHit= false;
            prize.setVisible(true);
        }
    },

    //reduce a life
    reduceLives: function () {
        this.lives -= 1;
        this.lblLives.initWithFile("res/lives" + this.lives + ".png"); //change picture according to lives
        this.lblLives.setAnchorPoint(cc.p(0, 1));//reset anchor point

        if (this.lives <= 0) {
            this.overGame();
        } else {
            this.gameStatus = g_GameStatus.normal;
            this.bear.initData();
        }
    },

    //initial acorn
    initAcorn: function () {
        var left = 0;
        var space = 30;
        for (var i = 1; i <= 15; i++) {
            var prize = new AcornPrize();
            prize.initData();
            prize.setPosition(cc.p(left + i * space, 270));
            this.gameLayer.addChild(prize, g_GameZOder.ui);
            this.acornList.push(prize);
        }
    },

    //initial flower
    initFlower: function () {
        var left = 30;
        var space = 30;
        for (var i = 1; i <= 13; i++) {
            var prize = new FlowerPrize();
            prize.initData();
            prize.setPosition(cc.p(left + i * space, 245));
            this.gameLayer.addChild(prize, g_GameZOder.ui);
            this.flowerList.push(prize);
        }
    },

    //initial leaves
    initLeaf: function () {
        var left = 60;
        var space = 30;
        for (var i = 1; i <= 11; i++) {
            var prize = new LeafPrize();
            prize.initData();
            prize.setPosition(cc.p(left + i * space, 220));
            this.gameLayer.addChild(prize, g_GameZOder.ui);
            this.leafList.push(prize);
        }
    },

    addScore: function (point) {
        this.score += point;
        this.lblScore.setString(this.score.toString());
    },

    update: function (dt) {
        if (this.gameStatus != g_GameStatus.normal) {
            return;
        }
        this.bear.update(dt);
        //collision between bear and mushroom
        this.bear.collide(this.mushroom);

        //collision between bear and leaf
        for (var i = 0; i < this.leafList.length; i++) {
            var prize = this.leafList[i];
            if (!prize.isHit) {
                if (this.bear.collide(prize)) {
                    prize.setVisible(false);
                    prize.isHit = true;
                    this.addScore(prize.point);
                }
            }
        }
        //collision between bear and flower
        for (var i = 0; i < this.flowerList.length; i++) {
            var prize = this.flowerList[i];
            if (!prize.isHit) {
                if (this.bear.collide(prize)) {
                    prize.setVisible(false);
                    prize.isHit = true;
                    this.addScore(prize.point);
                }
            }
        }
        //collision between bear and acorn
        for (var i = 0; i < this.acornList.length; i++) {
            var prize = this.acornList[i];
            if (!prize.isHit) {
                if (this.bear.collide(prize)) {
                    prize.setVisible(false);
                    prize.isHit = true;
                    this.addScore(prize.point);
                }
            }
        }
    }
});