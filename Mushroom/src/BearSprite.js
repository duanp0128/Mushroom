/**
 * 2014-4-16
 * User: Abel
 */
var BearSprite = cc.Sprite.extend({
    velocity: null,
    radius: 25, //collision radius
    curSence:null,

    //constructor function
    ctor: function () {
        this._super();
        this.initWithFile(s_bear_eyesopen);
        this.velocity = cc.p(100, 100);
    },

    initData:function(){
       this.setPosition(cc.p(240,120));
       this.velocity = cc.p(100, 100);
    },

    beginRotate: function () {
        var rotate = cc.RotateBy.create(2, 360); //para1：time，para2：rotate angle
        var rep1 = cc.RepeatForever.create(rotate);
        this.runAction(rep1);
    },

    stopRotate: function () {
        this.stopAllActions();
    },

    update: function (dt) {
        this.setPosition(cc.pAdd(this.getPosition(), cc.pMult(this.velocity, dt)));
        this.checkHitEdge();
    },

    //collision detect
    checkHitEdge: function () {
        var pos = this.getPosition();
        var contentSize = this.getContentSize();
        var winSize = cc.Director.getInstance().getWinSize();
        //right
        if (pos.x > winSize.width - this.radius) {
            //reverse move direction
            this.velocity.x *= -1;
        }
        //left
        if (pos.x < this.radius) {
            this.velocity.x *= -1;
        }
        //bottom
        if (pos.y <= this.radius) {
            //reduce life
            this.curSence.reduceLives();
        }
        //top
        if (pos.y >= winSize.height - this.radius) {
            this.velocity.y *= -1;
        }
    },

    //collision detect
    collide: function (gameObject) {
        var hit = false;
        var distance = cc.pDistance(this.getPosition(), gameObject.getPosition());

        if (distance <= this.radius + gameObject.radius) {
            hit = true;
            var hitAngle = cc.pToAngle(cc.pSub(gameObject.getPosition(), this.getPosition()));
            var scalarVelocity = cc.pLength(this.velocity);
            this.velocity = cc.pMult(cc.pForAngle(hitAngle), scalarVelocity);
            this.velocity.x *=-1;
            this.velocity.y *=-1;
        }
        return hit;
    }


});