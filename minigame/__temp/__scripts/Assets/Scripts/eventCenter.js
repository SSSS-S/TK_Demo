"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var eventemitter3_1 = require("eventemitter3");
var EventEmitterCenter = (function (_super) {
    tslib_1.__extends(EventEmitterCenter, _super);
    function EventEmitterCenter() {
        var _this = _super.call(this) || this;
        _this.TOUCH_MOVE = 'TOUCH_MOVE';
        _this.START_SHOOT = 'START_SHOOT';
        _this.END_SHOOT = 'END_SHOOT';
        _this.ADD_PLAYER = 'ADD_PLAYER';
        _this.ADD_ENEMY = 'ADD_ENEMY';
        _this.MOVE_PLAYER = 'MOVE_PLAYER';
        _this.HURT_PLAYER = 'HURT_PLAYER';
        _this.GET_SCORE = 'GET_SCORE';
        _this.OnEasyWeaponsReload = 'OnEasyWeaponsReload';
        _this.MultiplyDamage = 'MultiplyDamage';
        _this.MultiplyInitialForce = 'MultiplyInitialForce';
        _this.ChangeHealth = 'ChangeHealth';
        _this.Damage = 'Damage';
        return _this;
    }
    return EventEmitterCenter;
}(eventemitter3_1.EventEmitter));
exports.EventCenter = new EventEmitterCenter();
exports.default = exports.EventCenter;
var dateCenter = (function () {
    function dateCenter() {
    }
    dateCenter.SceneNode = null;
    return dateCenter;
}());
exports.dateCenter = dateCenter;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFzc2V0cy9TY3JpcHRzL2V2ZW50Q2VudGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLCtDQUE2QztBQUU3QztJQUFpQyw4Q0FBWTtJQWlCM0M7UUFBQSxZQUNFLGlCQUFPLFNBQ1I7UUFsQk0sZ0JBQVUsR0FBRyxZQUFZLENBQUM7UUFDMUIsaUJBQVcsR0FBRyxhQUFhLENBQUM7UUFDNUIsZUFBUyxHQUFHLFdBQVcsQ0FBQztRQUV4QixnQkFBVSxHQUFHLFlBQVksQ0FBQztRQUMxQixlQUFTLEdBQUcsV0FBVyxDQUFDO1FBQ3hCLGlCQUFXLEdBQUcsYUFBYSxDQUFDO1FBQzVCLGlCQUFXLEdBQUcsYUFBYSxDQUFDO1FBQzVCLGVBQVMsR0FBRyxXQUFXLENBQUM7UUFFeEIseUJBQW1CLEdBQUcscUJBQXFCLENBQUM7UUFDNUMsb0JBQWMsR0FBRyxnQkFBZ0IsQ0FBQztRQUNsQywwQkFBb0IsR0FBRyxzQkFBc0IsQ0FBQztRQUM5QyxrQkFBWSxHQUFHLGNBQWMsQ0FBQztRQUM5QixZQUFNLEdBQUcsUUFBUSxDQUFDOztJQUl6QixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQXBCQSxBQW9CQyxDQXBCZ0MsNEJBQVksR0FvQjVDO0FBRVksUUFBQSxXQUFXLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO0FBQ3BELGtCQUFlLG1CQUFXLENBQUM7QUFDM0I7SUFBQTtJQUVBLENBQUM7SUFEZSxvQkFBUyxHQUFpQixJQUFJLENBQUM7SUFDL0MsaUJBQUM7Q0FGRCxBQUVDLElBQUE7QUFGWSxnQ0FBVSIsImZpbGUiOiJBc3NldHMvU2NyaXB0cy9ldmVudENlbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlbmdpbmUgZnJvbSBcImVuZ2luZVwiO1xyXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tIFwiZXZlbnRlbWl0dGVyM1wiO1xyXG5cclxuY2xhc3MgRXZlbnRFbWl0dGVyQ2VudGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcclxuICBwdWJsaWMgVE9VQ0hfTU9WRSA9ICdUT1VDSF9NT1ZFJztcclxuICBwdWJsaWMgU1RBUlRfU0hPT1QgPSAnU1RBUlRfU0hPT1QnO1xyXG4gIHB1YmxpYyBFTkRfU0hPT1QgPSAnRU5EX1NIT09UJztcclxuXHJcbiAgcHVibGljIEFERF9QTEFZRVIgPSAnQUREX1BMQVlFUic7XHJcbiAgcHVibGljIEFERF9FTkVNWSA9ICdBRERfRU5FTVknO1xyXG4gIHB1YmxpYyBNT1ZFX1BMQVlFUiA9ICdNT1ZFX1BMQVlFUic7XHJcbiAgcHVibGljIEhVUlRfUExBWUVSID0gJ0hVUlRfUExBWUVSJztcclxuICBwdWJsaWMgR0VUX1NDT1JFID0gJ0dFVF9TQ09SRSc7XHJcblxyXG4gIHB1YmxpYyBPbkVhc3lXZWFwb25zUmVsb2FkID0gJ09uRWFzeVdlYXBvbnNSZWxvYWQnO1xyXG4gIHB1YmxpYyBNdWx0aXBseURhbWFnZSA9ICdNdWx0aXBseURhbWFnZSc7XHJcbiAgcHVibGljIE11bHRpcGx5SW5pdGlhbEZvcmNlID0gJ011bHRpcGx5SW5pdGlhbEZvcmNlJztcclxuICBwdWJsaWMgQ2hhbmdlSGVhbHRoID0gJ0NoYW5nZUhlYWx0aCc7XHJcbiAgcHVibGljIERhbWFnZSA9ICdEYW1hZ2UnO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgRXZlbnRDZW50ZXIgPSBuZXcgRXZlbnRFbWl0dGVyQ2VudGVyKCk7XHJcbmV4cG9ydCBkZWZhdWx0IEV2ZW50Q2VudGVyO1xyXG5leHBvcnQgY2xhc3MgZGF0ZUNlbnRlciB7XHJcbiAgcHVibGljIHN0YXRpYyBTY2VuZU5vZGU6ZW5naW5lLkVudGl0eSA9IG51bGw7XHJcbn0iXX0=
