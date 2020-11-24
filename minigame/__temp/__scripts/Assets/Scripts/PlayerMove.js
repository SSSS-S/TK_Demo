"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("./eventCenter");
var PlayerMove = (function (_super) {
    tslib_1.__extends(PlayerMove, _super);
    function PlayerMove() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_Speed = 8;
        _this.m_MoveValue = 0;
        _this.m_TurnValue = 0;
        _this.m_characterController = null;
        _this.distance = engine_1.default.Vector3.ZERO.clone();
        return _this;
    }
    PlayerMove.prototype.onAwake = function () {
        this.initEvent();
        this.m_characterController = this.entity.getComponent(engine_1.default.CharacterController);
        this.camera = this.entity.transform.parent.entity.transform.findChildByName('Main Camera').entity;
    };
    PlayerMove.prototype.onStart = function () {
        this.entity.game.activeScene.settings.ambientSkyColor = new engine_1.default.Color(38, 183, 255, 1);
        this.m_characterController.center = engine_1.default.Vector3.createFromNumber(0, 0.43, 0.1);
        this.m_characterController.radius = 0.5;
        this.m_characterController.height = 1.8;
        this.m_characterController.detectCollisions = true;
        this.m_characterController.slopeLimit = 0;
        this.distance = this.camera.transform.position.clone().sub(this.entity.transform.position.clone());
    };
    PlayerMove.prototype.initEvent = function () {
        var _this = this;
        eventCenter_1.default.on(eventCenter_1.default.TOUCH_MOVE, function (direction) {
            if (direction.z == 0) {
                _this.m_MoveValue = 0;
            }
            else {
                _this.m_MoveValue = -1;
            }
            if (Math.abs(direction.x) < 0.1) {
                _this.m_TurnValue = 0;
            }
            else {
                _this.m_TurnValue = direction.x * 100;
            }
            if (direction.z > 0) {
                if (_this.m_TurnValue < 0) {
                    _this.m_TurnValue = -180 - _this.m_TurnValue;
                }
                else if (_this.m_TurnValue > 0) {
                    _this.m_TurnValue = 180 - _this.m_TurnValue;
                }
                else if (_this.m_TurnValue == 0) {
                    _this.m_TurnValue = 180;
                }
            }
            _this.Turn();
        });
    };
    PlayerMove.prototype.onUpdate = function (dt) {
        this.Move(dt);
    };
    PlayerMove.prototype.Move = function (dt) {
        var Value = this.m_MoveValue * this.m_Speed * dt;
        var movement = engine_1.default.Vector3.createFromNumber(this.entity.transform.forward.x * Value, this.entity.transform.forward.y * Value, this.entity.transform.forward.z * Value);
        this.m_characterController.move(movement);
        if (this.entity.transform.position.y != 0) {
            this.entity.transform.position.y = 0;
        }
    };
    PlayerMove.prototype.Turn = function () {
        var turnRotation = this.m_TurnValue * 0.0174;
        this.entity.transform.euler.y = turnRotation * -1;
    };
    PlayerMove.prototype.onLateUpdate = function () {
        this.camera.transform.position = this.camera.transform.position.lerp(this.entity.transform.position.clone().add(this.distance), 0.1);
    };
    PlayerMove = tslib_1.__decorate([
        engine_1.default.decorators.serialize("PlayerMove")
    ], PlayerMove);
    return PlayerMove;
}(engine_1.default.Script));
exports.default = PlayerMove;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFzc2V0cy9TY3JpcHRzL1BsYXllck1vdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQTRCO0FBRTVCLDZDQUF3QztBQUd4QztJQUF3QyxzQ0FBYTtJQUFyRDtRQUFBLHFFQWdGQztRQTlFUyxhQUFPLEdBQVUsQ0FBQyxDQUFDO1FBQ25CLGlCQUFXLEdBQVUsQ0FBQyxDQUFDO1FBQ3ZCLGlCQUFXLEdBQVUsQ0FBQyxDQUFDO1FBRXZCLDJCQUFxQixHQUErQixJQUFJLENBQUM7UUFFekQsY0FBUSxHQUFHLGdCQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7SUF3RWpELENBQUM7SUF0RVEsNEJBQU8sR0FBZDtRQUNFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsZ0JBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNwRyxDQUFDO0lBRU0sNEJBQU8sR0FBZDtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUYsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FB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Qy9DLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFTSxpQ0FBWSxHQUFuQjtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZJLENBQUM7SUE5RWtCLFVBQVU7UUFEOUIsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztPQUNyQixVQUFVLENBZ0Y5QjtJQUFELGlCQUFDO0NBaEZELEFBZ0ZDLENBaEZ1QyxnQkFBTSxDQUFDLE1BQU0sR0FnRnBEO2tCQWhGb0IsVUFBVSIsImZpbGUiOiJBc3NldHMvU2NyaXB0cy9QbGF5ZXJNb3ZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVuZ2luZSBmcm9tIFwiZW5naW5lXCI7XG5pbXBvcnQgeyBmbG9hdCB9IGZyb20gXCJlbmdpbmUvdHlwZVwiO1xuaW1wb3J0IEV2ZW50Q2VudGVyIGZyb20gXCIuL2V2ZW50Q2VudGVyXCI7XG5cbkBlbmdpbmUuZGVjb3JhdG9ycy5zZXJpYWxpemUoXCJQbGF5ZXJNb3ZlXCIpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXJNb3ZlIGV4dGVuZHMgZW5naW5lLlNjcmlwdCB7XG5cbiAgcHJpdmF0ZSBtX1NwZWVkOiBmbG9hdCA9IDg7XG4gIHByaXZhdGUgbV9Nb3ZlVmFsdWU6IGZsb2F0ID0gMDtcbiAgcHJpdmF0ZSBtX1R1cm5WYWx1ZTogZmxvYXQgPSAwO1xuICAvL3ByaXZhdGUgbV9SaWdpZGJvZHk6IGVuZ2luZS5SaWdpZGJvZHkgPSBudWxsO1xuICBwcml2YXRlIG1fY2hhcmFjdGVyQ29udHJvbGxlcjogZW5naW5lLkNoYXJhY3RlckNvbnRyb2xsZXIgPSBudWxsO1xuICBwcml2YXRlIGNhbWVyYTogZW5naW5lLkVudGl0eTtcbiAgcHJpdmF0ZSBkaXN0YW5jZSA9IGVuZ2luZS5WZWN0b3IzLlpFUk8uY2xvbmUoKTtcblxuICBwdWJsaWMgb25Bd2FrZSgpIHtcbiAgICB0aGlzLmluaXRFdmVudCgpO1xuICAgIC8vdGhpcy5tX1JpZ2lkYm9keSA9IHRoaXMuZW50aXR5LmdldENvbXBvbmVudChlbmdpbmUuUmlnaWRib2R5KTtcbiAgICB0aGlzLm1fY2hhcmFjdGVyQ29udHJvbGxlciA9IHRoaXMuZW50aXR5LmdldENvbXBvbmVudChlbmdpbmUuQ2hhcmFjdGVyQ29udHJvbGxlcik7XG4gICAgdGhpcy5jYW1lcmEgPSB0aGlzLmVudGl0eS50cmFuc2Zvcm0ucGFyZW50LmVudGl0eS50cmFuc2Zvcm0uZmluZENoaWxkQnlOYW1lKCdNYWluIENhbWVyYScpLmVudGl0eTtcbiAgfVxuXG4gIHB1YmxpYyBvblN0YXJ0KCkge1xuICAgIHRoaXMuZW50aXR5LmdhbWUuYWN0aXZlU2NlbmUuc2V0dGluZ3MuYW1iaWVudFNreUNvbG9yID0gbmV3IGVuZ2luZS5Db2xvcigzOCwgMTgzLCAyNTUsIDEpO1xuICAgIHRoaXMubV9jaGFyYWN0ZXJDb250cm9sbGVyLmNlbnRlciA9IGVuZ2luZS5WZWN0b3IzLmNyZWF0ZUZyb21OdW1iZXIoMCwgMC40MywgMC4xKTtcbiAgICB0aGlzLm1fY2hhcmFjdGVyQ29udHJvbGxlci5yYWRpdXMgPSAwLjU7XG4gICAgdGhpcy5tX2NoYXJhY3RlckNvbnRyb2xsZXIuaGVpZ2h0ID0gMS44O1xuICAgIHRoaXMubV9jaGFyYWN0ZXJDb250cm9sbGVyLmRldGVjdENvbGxpc2lvbnMgPSB0cnVlO1xuICAgIHRoaXMubV9jaGFyYWN0ZXJDb250cm9sbGVyLnNsb3BlTGltaXQgPSAwO1xuICAgIHRoaXMuZGlzdGFuY2UgPSB0aGlzLmNhbWVyYS50cmFuc2Zvcm0ucG9zaXRpb24uY2xvbmUoKS5zdWIodGhpcy5lbnRpdHkudHJhbnNmb3JtLnBvc2l0aW9uLmNsb25lKCkpO1xuICB9XG5cbiAgcHVibGljIGluaXRFdmVudCgpIHtcbiAgICBFdmVudENlbnRlci5vbihFdmVudENlbnRlci5UT1VDSF9NT1ZFLCAoZGlyZWN0aW9uKSA9PiB7XG5cbiAgICAgIGlmIChkaXJlY3Rpb24ueiA9PSAwKSB7XG4gICAgICAgIHRoaXMubV9Nb3ZlVmFsdWUgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tX01vdmVWYWx1ZSA9IC0xO1xuICAgICAgfVxuXG4gICAgICBpZiAoTWF0aC5hYnMoZGlyZWN0aW9uLngpIDwgMC4xKSB7XG4gICAgICAgIHRoaXMubV9UdXJuVmFsdWUgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tX1R1cm5WYWx1ZSA9IGRpcmVjdGlvbi54ICogMTAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGlyZWN0aW9uLnogPiAwKSB7XG4gICAgICAgIGlmICh0aGlzLm1fVHVyblZhbHVlIDwgMCkge1xuICAgICAgICAgIHRoaXMubV9UdXJuVmFsdWUgPSAtMTgwIC0gdGhpcy5tX1R1cm5WYWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1fVHVyblZhbHVlID4gMCkge1xuICAgICAgICAgIHRoaXMubV9UdXJuVmFsdWUgPSAxODAgLSB0aGlzLm1fVHVyblZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubV9UdXJuVmFsdWUgPT0gMCkge1xuICAgICAgICAgIHRoaXMubV9UdXJuVmFsdWUgPSAxODA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuVHVybigpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uVXBkYXRlKGR0KSB7XG4gICAgdGhpcy5Nb3ZlKGR0KTtcbiAgfVxuXG4gIHByaXZhdGUgTW92ZShkdCkge1xuICAgIGNvbnN0IFZhbHVlID0gdGhpcy5tX01vdmVWYWx1ZSAqIHRoaXMubV9TcGVlZCAqIGR0O1xuICAgIGNvbnN0IG1vdmVtZW50ID0gZW5naW5lLlZlY3RvcjMuY3JlYXRlRnJvbU51bWJlcih0aGlzLmVudGl0eS50cmFuc2Zvcm0uZm9yd2FyZC54ICogVmFsdWUsIHRoaXMuZW50aXR5LnRyYW5zZm9ybS5mb3J3YXJkLnkgKiBWYWx1ZSwgdGhpcy5lbnRpdHkudHJhbnNmb3JtLmZvcndhcmQueiAqIFZhbHVlKTtcbiAgICAvLyB0aGlzLm1fUmlnaWRib2R5Lm1vdmVQb3NpdGlvbih0aGlzLm1fUmlnaWRib2R5LnBvc2l0aW9uLmFkZChtb3ZlbWVudCkpO1xuICAgIHRoaXMubV9jaGFyYWN0ZXJDb250cm9sbGVyLm1vdmUobW92ZW1lbnQpO1xuICAgIGlmICh0aGlzLmVudGl0eS50cmFuc2Zvcm0ucG9zaXRpb24ueSAhPSAwKSB7XG4gICAgICB0aGlzLmVudGl0eS50cmFuc2Zvcm0ucG9zaXRpb24ueSA9IDA7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBUdXJuKCkge1xuICAgIC8vY29uc3QgdHVyblJvdGF0aW9uID0gZW5naW5lLlF1YXRlcm5pb24uZnJvbUV1bGVyQW5nbGVzKGVuZ2luZS5WZWN0b3IzLmNyZWF0ZUZyb21OdW1iZXIoMCwgdHVybiwgMCkpO1xuICAgIC8vdGhpcy5tX1JpZ2lkYm9keS5tb3ZlUm90YXRpb24odGhpcy5tX1JpZ2lkYm9keS5yb3RhdGlvbi5tdWx0aXBseSh0dXJuUm90YXRpb24pKTtcbiAgICBjb25zdCB0dXJuUm90YXRpb24gPSB0aGlzLm1fVHVyblZhbHVlICogMC4wMTc0O1xuICAgIHRoaXMuZW50aXR5LnRyYW5zZm9ybS5ldWxlci55ID0gdHVyblJvdGF0aW9uICogLTE7XG4gIH1cblxuICBwdWJsaWMgb25MYXRlVXBkYXRlKCkge1xuICAgIHRoaXMuY2FtZXJhLnRyYW5zZm9ybS5wb3NpdGlvbiA9IHRoaXMuY2FtZXJhLnRyYW5zZm9ybS5wb3NpdGlvbi5sZXJwKHRoaXMuZW50aXR5LnRyYW5zZm9ybS5wb3NpdGlvbi5jbG9uZSgpLmFkZCh0aGlzLmRpc3RhbmNlKSwgMC4xKTtcbiAgfVxuXG59Il19
