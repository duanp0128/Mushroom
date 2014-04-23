var PrizeSprite = cc.Sprite.extend({
    isHit: false,   //collision flag
    point: 0,   //score
    radius:0    //collision radius
});

//leaf
var LeafPrize = PrizeSprite.extend({
    ctor: function () {
        this._super();
        this.initWithFile(s_leaf);
    },
    initData:function(){
        this.isHit = false;
        this.point = 10;
        this.radius = 15;
    }
});

//flower
var FlowerPrize = PrizeSprite.extend({
    ctor: function () {
        this._super();
        this.initWithFile(s_flower);
    } ,
    initData:function(){
        this.isHit = false;
        this.point = 20;
        this.radius = 15;
    }
});

//acorn
var AcornPrize = PrizeSprite.extend({
    ctor: function () {
        this._super();
        this.initWithFile(s_acorn);
    } ,
    initData:function(){
        this.isHit = false;
        this.point = 30;
        this.radius = 15;
    }
});