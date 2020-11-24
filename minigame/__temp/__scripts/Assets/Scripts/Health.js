"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("./eventCenter");
var Health = (function (_super) {
    tslib_1.__extends(Health, _super);
    function Health() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canDie = true;
        _this.startingHealth = 100;
        _this.maxHealth = 100;
        _this.currentHealth = 0;
        _this.replaceWhenDead = false;
        _this.deadReplacement = null;
        _this.makeExplosion = false;
        _this.explosion = null;
        _this.isPlayer = false;
        _this.deathCam = null;
        _this.dead = false;
        return _this;
    }
    Health.prototype.onAwake = function () {
    };
    Health.prototype.ChangeHealth = function (amount) {
        this.currentHealth -= amount;
        if (this.currentHealth <= 0 && !this.dead && this.canDie)
            this.Die();
        else if (this.currentHealth > this.maxHealth)
            this.currentHealth = this.maxHealth;
    };
    Health.prototype.Die = function () {
        this.dead = true;
        if (this.replaceWhenDead) {
            var dead = this.deadReplacement.instantiate();
            eventCenter_1.dateCenter.SceneNode.transform.addChild(dead.transform);
            dead.transform.worldPosition = this.entity.transform.worldPosition;
            dead.transform.quaternion = this.entity.transform.worldQuaternion;
        }
        if (this.makeExplosion) {
            var exp = this.explosion.instantiate();
            eventCenter_1.dateCenter.SceneNode.transform.addChild(exp.transform);
            exp.transform.worldPosition = this.entity.transform.worldPosition;
            exp.transform.quaternion = this.entity.transform.worldQuaternion;
        }
        if (this.isPlayer && this.deathCam != null)
            this.deathCam.active = true;
        var self = this;
        var timeout = function () {
            self.entity.destroy();
        };
        setTimeout(timeout, 20);
    };
    Health.prototype.onStart = function () {
        this.currentHealth = this.startingHealth;
    };
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'boolean',
        })
    ], Health.prototype, "canDie", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], Health.prototype, "startingHealth", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], Health.prototype, "maxHealth", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'boolean',
        })
    ], Health.prototype, "replaceWhenDead", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: engine_1.default.Prefab,
        })
    ], Health.prototype, "deadReplacement", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'boolean',
        })
    ], Health.prototype, "makeExplosion", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: engine_1.default.Prefab,
        })
    ], Health.prototype, "explosion", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'boolean',
        })
    ], Health.prototype, "isPlayer", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: engine_1.default.Transform3D,
        })
    ], Health.prototype, "deathCam", void 0);
    Health = tslib_1.__decorate([
        engine_1.default.decorators.serialize("Health")
    ], Health);
    return Health;
}(engine_1.default.Script));
exports.default = Health;
//# sourceMappingURL=data:application/json;charset=utf8;base64,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anMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZW5naW5lIGZyb20gXCJlbmdpbmVcIjtcbmltcG9ydCBFdmVudENlbnRlciwgeyBkYXRlQ2VudGVyIH0gZnJvbSBcIi4vZXZlbnRDZW50ZXJcIjtcbkBlbmdpbmUuZGVjb3JhdG9ycy5zZXJpYWxpemUoXCJIZWFsdGhcIilcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWx0aCBleHRlbmRzIGVuZ2luZS5TY3JpcHQge1xuXG4gIEBlbmdpbmUuZGVjb3JhdG9ycy5wcm9wZXJ0eSh7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICB9KVxuICBwdWJsaWMgY2FuRGllOiBib29sZWFuID0gdHJ1ZTsgICAgICAgICAgICAgICAgICAvLyDov5nnp43lgaXlurfmmK/lkKbkvJrmrbvkuqFcblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6ICdudW1iZXInLFxuICB9KVxuICBwdWJsaWMgc3RhcnRpbmdIZWFsdGg6IG51bWJlciA9IDEwMDsgICAgICAgLy8g6LW35aeL5YGl5bq35YC8XG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcbiAgICB0eXBlOiAnbnVtYmVyJyxcbiAgfSlcbiAgcHVibGljIG1heEhlYWx0aDogbnVtYmVyID0gMTAwOyAgICAgICAgICAgIC8vIOacgOWkp+WBpeW6t+WAvFxuXG4gIHByaXZhdGUgY3VycmVudEhlYWx0aDogbnVtYmVyID0gMDsgICAgICAgICAgICAgICAgLy8g5LuW55uu5YmN55qE5YGl5bq354q25Ya1XG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gIH0pXG4gIHB1YmxpYyByZXBsYWNlV2hlbkRlYWQ6IGJvb2xlYW4gPSBmYWxzZTsgICAgICAgIC8vIOaYr+WQpuW6lOivpeWunuS+i+WMluatu+abv+aNouOAgijlr7nkuo7noLTnoo4v57KJ56KOL+eIhueCuOaViOaenOW+iOacieeUqClcblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6IGVuZ2luZS5QcmVmYWIsXG4gIH0pXG4gIHB1YmxpYyBkZWFkUmVwbGFjZW1lbnQ6IGVuZ2luZS5QcmVmYWIgPSBudWxsOyAgICAgICAgICAvLyDlvZPmuLjmiI/lr7nosaHmrbvkuqHml7blrp7kvovljJbnmoTniankvZPpooTliLbku7ZcblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgfSlcbiAgcHVibGljIG1ha2VFeHBsb3Npb246IGJvb2xlYW4gPSBmYWxzZTsgICAgICAgICAgLy8g5piv5ZCm5bqU6K+l5a6e5L6L5YyW5LiA5Liq54iG54K454m55pWI6aKE5Yi25Lu2XG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcbiAgICB0eXBlOiBlbmdpbmUuUHJlZmFiLFxuICB9KVxuICBwdWJsaWMgZXhwbG9zaW9uOiBlbmdpbmUuUHJlZmFiID0gbnVsbDsgICAgICAgICAgICAgICAgLy8g6KaB5a6e5L6L5YyW55qE54mp5L2T54iG54K454m55pWI6aKE5Yi25Lu2XG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gIH0pXG4gIHB1YmxpYyBpc1BsYXllcjogYm9vbGVhbiA9IGZhbHNlOyAgICAgICAgICAgICAgIC8vIOeOqeWutueahOWBpeW6t+S4juWQplxuXG4gIEBlbmdpbmUuZGVjb3JhdG9ycy5wcm9wZXJ0eSh7XG4gICAgdHlwZTogZW5naW5lLlRyYW5zZm9ybTNELFxuICB9KVxuICBwdWJsaWMgZGVhdGhDYW06IGVuZ2luZS5UcmFuc2Zvcm0zRCA9IG51bGw7ICAgICAgICAgICAgICAgICAvLyDlvZPnjqnlrrbmrbvkuqHml7bvvIznm7jmnLrlsIblkK/liqhcblxuICBwcml2YXRlIGRlYWQ6IGJvb2xlYW4gPSBmYWxzZTsgICAgICAgICAgICAgICAgICAvLyDnlKjkuo7noa7kv51EaWUoKeWHveaVsOS4jeS8muiiq+iwg+eUqOS4pOasoVxuXG4gIHB1YmxpYyBvbkF3YWtlKCkge1xuXG4gIH1cbiAgcHVibGljIENoYW5nZUhlYWx0aChhbW91bnQ6IG51bWJlcikge1xuICAgIC8vIOaMiWFtb3VudOWPmOmHj+S4reaMh+WumueahOWAvOabtOaUueWBpeW6t+eKtuWGtVxuICAgIHRoaXMuY3VycmVudEhlYWx0aCAtPSBhbW91bnQ7XG5cbiAgICAvLyDlpoLmnpzlgaXlurfogJflsL3vvIzosIPnlKhEaWUoKei/m+WFpeatu+S6oeeKtuaAgVxuICAgIGlmICh0aGlzLmN1cnJlbnRIZWFsdGggPD0gMCAmJiAhdGhpcy5kZWFkICYmIHRoaXMuY2FuRGllKVxuICAgICAgdGhpcy5EaWUoKTtcblxuICAgIC8vIOehruS/neWBpeW6t+eKtuWGteawuOi/nOS4jeS8mui2hei/h+acgOWkp+WBpeW6t+eKtuWGtVxuICAgIGVsc2UgaWYgKHRoaXMuY3VycmVudEhlYWx0aCA+IHRoaXMubWF4SGVhbHRoKVxuICAgICAgdGhpcy5jdXJyZW50SGVhbHRoID0gdGhpcy5tYXhIZWFsdGg7XG4gIH1cblxuICBwdWJsaWMgRGllKCkge1xuICAgIC8vIOi/meS4qua4uOaIj+Wvueixoeato+W8j+atu+S6oeS6huOAgui/meeUqOS6juehruS/nURpZSgp5Ye95pWw5LiN5Lya6KKr5YaN5qyh6LCD55SoXG4gICAgdGhpcy5kZWFkID0gdHJ1ZTtcblxuICAgIC8vIOatu+S6oeaXtueahOeJueaViFxuICAgIGlmICh0aGlzLnJlcGxhY2VXaGVuRGVhZCkge1xuICAgICAgY29uc3QgZGVhZCA9IHRoaXMuZGVhZFJlcGxhY2VtZW50Lmluc3RhbnRpYXRlKCk7XG4gICAgICBkYXRlQ2VudGVyLlNjZW5lTm9kZS50cmFuc2Zvcm0uYWRkQ2hpbGQoZGVhZC50cmFuc2Zvcm0pO1xuICAgICAgZGVhZC50cmFuc2Zvcm0ud29ybGRQb3NpdGlvbiA9IHRoaXMuZW50aXR5LnRyYW5zZm9ybS53b3JsZFBvc2l0aW9uO1xuICAgICAgZGVhZC50cmFuc2Zvcm0ucXVhdGVybmlvbiA9IHRoaXMuZW50aXR5LnRyYW5zZm9ybS53b3JsZFF1YXRlcm5pb247XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWFrZUV4cGxvc2lvbikge1xuICAgICAgY29uc3QgZXhwID0gdGhpcy5leHBsb3Npb24uaW5zdGFudGlhdGUoKTtcbiAgICAgIGRhdGVDZW50ZXIuU2NlbmVOb2RlLnRyYW5zZm9ybS5hZGRDaGlsZChleHAudHJhbnNmb3JtKTtcbiAgICAgIGV4cC50cmFuc2Zvcm0ud29ybGRQb3NpdGlvbiA9IHRoaXMuZW50aXR5LnRyYW5zZm9ybS53b3JsZFBvc2l0aW9uO1xuICAgICAgZXhwLnRyYW5zZm9ybS5xdWF0ZXJuaW9uID0gdGhpcy5lbnRpdHkudHJhbnNmb3JtLndvcmxkUXVhdGVybmlvbjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1BsYXllciAmJiB0aGlzLmRlYXRoQ2FtICE9IG51bGwpXG4gICAgICB0aGlzLmRlYXRoQ2FtLmFjdGl2ZSA9IHRydWU7XG5cbiAgICAvLyDlsIbmraTniankvZPku47lnLrmma/kuK3plIDmr4FcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBsZXQgdGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuZW50aXR5LmRlc3Ryb3koKTtcbiAgICB9XG4gICAgc2V0VGltZW91dCh0aW1lb3V0LCAyMClcbiAgfVxuXG4gIHB1YmxpYyBvblN0YXJ0KCkge1xuICAgIHRoaXMuY3VycmVudEhlYWx0aCA9IHRoaXMuc3RhcnRpbmdIZWFsdGg7XG4gIH1cblxufSJdfQ==
