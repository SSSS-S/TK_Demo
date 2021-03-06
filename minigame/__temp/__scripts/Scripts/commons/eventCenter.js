"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var EventEmitter = require("eventemitter3");
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
        console.log('ee');
        return _this;
    }
    return EventEmitterCenter;
}(EventEmitter));
exports.EventCenter = new EventEmitterCenter();
exports.default = exports.EventCenter;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcmlwdHMvY29tbW9ucy9ldmVudENlbnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0Q0FBOEM7QUFFOUM7SUFBaUMsOENBQVk7SUFXM0M7UUFBQSxZQUNFLGlCQUFPLFNBRVI7UUFiTSxnQkFBVSxHQUFHLFlBQVksQ0FBQztRQUMxQixpQkFBVyxHQUFHLGFBQWEsQ0FBQztRQUM1QixlQUFTLEdBQUcsV0FBVyxDQUFDO1FBRXhCLGdCQUFVLEdBQUcsWUFBWSxDQUFDO1FBQzFCLGVBQVMsR0FBRyxXQUFXLENBQUM7UUFDeEIsaUJBQVcsR0FBRyxhQUFhLENBQUM7UUFDNUIsaUJBQVcsR0FBRyxhQUFhLENBQUM7UUFDNUIsZUFBUyxHQUFHLFdBQVcsQ0FBQztRQUk3QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUNwQixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQWZBLEFBZUMsQ0FmZ0MsWUFBWSxHQWU1QztBQUVZLFFBQUEsV0FBVyxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztBQUNwRCxrQkFBZSxtQkFBVyxDQUFDIiwiZmlsZSI6IlNjcmlwdHMvY29tbW9ucy9ldmVudENlbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEV2ZW50RW1pdHRlciBmcm9tICdldmVudGVtaXR0ZXIzJztcblxuY2xhc3MgRXZlbnRFbWl0dGVyQ2VudGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgcHVibGljIFRPVUNIX01PVkUgPSAnVE9VQ0hfTU9WRSc7XG4gIHB1YmxpYyBTVEFSVF9TSE9PVCA9ICdTVEFSVF9TSE9PVCc7XG4gIHB1YmxpYyBFTkRfU0hPT1QgPSAnRU5EX1NIT09UJztcbiAgXG4gIHB1YmxpYyBBRERfUExBWUVSID0gJ0FERF9QTEFZRVInO1xuICBwdWJsaWMgQUREX0VORU1ZID0gJ0FERF9FTkVNWSc7XG4gIHB1YmxpYyBNT1ZFX1BMQVlFUiA9ICdNT1ZFX1BMQVlFUic7XG4gIHB1YmxpYyBIVVJUX1BMQVlFUiA9ICdIVVJUX1BMQVlFUic7XG4gIHB1YmxpYyBHRVRfU0NPUkUgPSAnR0VUX1NDT1JFJztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnNvbGUubG9nKCdlZScpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBFdmVudENlbnRlciA9IG5ldyBFdmVudEVtaXR0ZXJDZW50ZXIoKTtcbmV4cG9ydCBkZWZhdWx0IEV2ZW50Q2VudGVyOyJdfQ==
