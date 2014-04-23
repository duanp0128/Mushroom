/**
 * 2014-4-16
 * User: Abel
 */
var MushroomSprite = cc.Sprite.extend({
    radius:40,
    //constructor function
    ctor:function(){
        this._super();
        this.initWithFile(s_mushroom);
        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, true);
    },

    containsTouchLocation:function (touch) {
        var getPoint = touch.getLocation();
        var contentSize  =  this.getContentSize();
        var myRect = cc.rect(0, 0, contentSize.width, contentSize.height);
        myRect.origin.x += this.getPosition().x-this.getContentSize().width/2;
        myRect.origin.y += this.getPosition().y;
        return cc.Rect.CCRectContainsPoint(myRect, getPoint);
    },

    onTouchBegan:function (touch, event) {
        if (!this.containsTouchLocation(touch)) return false;
        return true;
    },

    onTouchMoved:function (touch, event) {
//        cc.log("onTouchMoved");
        var touchPoint = touch.getLocation();
        this.setPositionX(touchPoint.x);
    }
});