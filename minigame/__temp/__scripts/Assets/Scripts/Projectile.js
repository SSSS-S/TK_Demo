"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("./eventCenter");
var ProjectileType;
(function (ProjectileType) {
    ProjectileType[ProjectileType["Standard"] = 0] = "Standard";
    ProjectileType[ProjectileType["Seeker"] = 1] = "Seeker";
    ProjectileType[ProjectileType["ClusterBomb"] = 2] = "ClusterBomb";
})(ProjectileType || (ProjectileType = {}));
var DamageType;
(function (DamageType) {
    DamageType[DamageType["Direct"] = 0] = "Direct";
    DamageType[DamageType["Explosion"] = 1] = "Explosion";
})(DamageType || (DamageType = {}));
var Projectile = (function (_super) {
    tslib_1.__extends(Projectile, _super);
    function Projectile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.projectileType = ProjectileType.Standard;
        _this.damageType = DamageType.Direct;
        _this.damage = 100.0;
        _this.speed = 10.0;
        _this.initialForce = 1000.0;
        _this.lifetime = 30.0;
        _this.seekRate = 1.0;
        _this.seekName = 'barrel_1';
        _this.explosion = null;
        _this.targetListUpdateRate = 1.0;
        _this.clusterBomb = null;
        _this.clusterBombNum = 6;
        _this.lifeTimer = 0.0;
        _this.targetListUpdateTimer = 0.0;
        _this.enemyList = [];
        _this._Rigidbody = null;
        _this.isBurst = false;
        return _this;
    }
    Projectile.prototype.onAwake = function () {
        this._Rigidbody = this.entity.getComponent(engine_1.default.Rigidbody);
        this.initEvent();
    };
    Projectile.prototype.onStart = function () {
        this.UpdateEnemyList();
        this._Rigidbody.addRelativeForce(engine_1.default.Vector3.createFromNumber(0, 0, this.initialForce), engine_1.default.ForceMode.Force);
        if (this.initialForce == 0 && !this.entity.isDestroyed) {
            var movement = engine_1.default.Vector3.createFromNumber(this.entity.transform.forward.x * this.speed * -1, this.entity.transform.forward.y * this.speed * -1, this.entity.transform.forward.z * this.speed * -1);
            this._Rigidbody.velocity = movement;
        }
    };
    Projectile.prototype.onUpdate = function (dt) {
        this.lifeTimer += dt;
        if (this.lifeTimer >= this.lifetime && !this.isBurst) {
            this.Explode(this.entity.transform.worldPosition);
        }
        if (this.projectileType == ProjectileType.Seeker) {
            this.targetListUpdateTimer += dt;
            if (this.targetListUpdateTimer >= this.targetListUpdateRate) {
                this.UpdateEnemyList();
            }
            if (this.enemyList != null) {
                var greatestDotSoFar = 0;
                var target = engine_1.default.Vector3.createFromNumber(this.entity.transform.forward.x * 1000, this.entity.transform.forward.y * 1000, this.entity.transform.forward.z * 1000);
                for (var _i = 0, _a = this.enemyList; _i < _a.length; _i++) {
                    var enemy = _a[_i];
                    if (enemy != null) {
                        var direction = enemy.transform.worldPosition.clone().sub(this.entity.transform.worldPosition.clone());
                        var dot = direction.normalize().dot(this.entity.transform.forward);
                        if (dot > greatestDotSoFar) {
                            target = enemy.transform.worldPosition;
                            greatestDotSoFar = dot;
                        }
                    }
                }
                var targetRotation = engine_1.default.Quaternion.lookRotation(target.sub(this.entity.transform.worldPosition), this.entity.transform.up);
                this.entity.transform.quaternion = this.entity.transform.worldQuaternion.slerp(targetRotation, dt * this.seekRate);
            }
        }
    };
    Projectile.prototype.UpdateEnemyList = function () {
        this.enemyList = this.FindGameObjectsWithTag(this.seekName);
        this.targetListUpdateTimer = 0.0;
    };
    Projectile.prototype.onCollisionEnter = function (col) {
        var position = col.contacts[0].point.clone();
        this.Explode(position);
        if (this.damageType == DamageType.Direct) {
            eventCenter_1.default.emit("ChangeHealth", -this.damage);
        }
    };
    Projectile.prototype.Explode = function (position) {
        this.isBurst = true;
        if (this.explosion != null) {
            var exp = this.explosion.instantiate();
            exp.transform.worldPosition = position;
            eventCenter_1.dateCenter.SceneNode.transform.addChild(exp.transform);
        }
        var self = this;
        var timeout = function () {
            self.entity.destroy();
        };
        setTimeout(timeout, 20);
    };
    Projectile.prototype.initEvent = function () {
        var _this = this;
        eventCenter_1.default.once(eventCenter_1.default.MultiplyDamage, function (amount) {
            _this.damage *= amount;
        });
        eventCenter_1.default.once(eventCenter_1.default.MultiplyInitialForce, function (amount) {
            _this.initialForce *= amount;
        });
    };
    Projectile.prototype.FindGameObjectsWithTag = function (seekName) {
        var entityList = [];
        var root = eventCenter_1.dateCenter.SceneNode.transform.findChildByName('environment').entity;
        for (var i = 0; i < root.transform.childrenCount; i++) {
            var element = root.transform.children[i].entity;
            if (element.name == seekName) {
                entityList.push(element);
            }
        }
        return entityList;
    };
    tslib_1.__decorate([
        engine_1.default.decorators.property.enum({
            type: { 'Standard': 0, 'Seeker': 1, 'ClusterBomb': 2 },
            tooltips: '射弹类型'
        })
    ], Projectile.prototype, "projectileType", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property.enum({
            type: { 'Direct': 0, 'Explosion': 1, },
            tooltips: '伤害类型'
        })
    ], Projectile.prototype, "damageType", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
            tooltips: '伤害值'
        })
    ], Projectile.prototype, "damage", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
            tooltips: '炮弹移动速度'
        })
    ], Projectile.prototype, "speed", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], Projectile.prototype, "initialForce", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], Projectile.prototype, "lifetime", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], Projectile.prototype, "seekRate", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'string',
        })
    ], Projectile.prototype, "seekName", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: engine_1.default.Prefab,
        })
    ], Projectile.prototype, "explosion", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], Projectile.prototype, "targetListUpdateRate", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: engine_1.default.Prefab,
        })
    ], Projectile.prototype, "clusterBomb", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], Projectile.prototype, "clusterBombNum", void 0);
    Projectile = tslib_1.__decorate([
        engine_1.default.decorators.serialize("Projectile")
    ], Projectile);
    return Projectile;
}(engine_1.default.Script));
exports.default = Projectile;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFzc2V0cy9TY3JpcHRzL1Byb2plY3RpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsaUNBQTRCO0FBRzVCLDZDQUF3RDtBQUV4RCxJQUFXLGNBSVY7QUFKRCxXQUFXLGNBQWM7SUFDdkIsMkRBQVEsQ0FBQTtJQUNSLHVEQUFNLENBQUE7SUFDTixpRUFBVyxDQUFBO0FBQ2IsQ0FBQyxFQUpVLGNBQWMsS0FBZCxjQUFjLFFBSXhCO0FBQ0QsSUFBVyxVQUdWO0FBSEQsV0FBVyxVQUFVO0lBQ25CLCtDQUFNLENBQUE7SUFDTixxREFBUyxDQUFBO0FBQ1gsQ0FBQyxFQUhVLFVBQVUsS0FBVixVQUFVLFFBR3BCO0FBR0Q7SUFBd0Msc0NBQWE7SUFBckQ7UUFBQSxxRUFpTkM7UUEzTVEsb0JBQWMsR0FBbUIsY0FBYyxDQUFDLFFBQVEsQ0FBQztRQU16RCxnQkFBVSxHQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFNM0MsWUFBTSxHQUFVLEtBQUssQ0FBQztRQU10QixXQUFLLEdBQVUsSUFBSSxDQUFDO1FBS3BCLGtCQUFZLEdBQVUsTUFBTSxDQUFDO1FBSzdCLGNBQVEsR0FBVSxJQUFJLENBQUM7UUFLdkIsY0FBUSxHQUFVLEdBQUcsQ0FBQztRQUt0QixjQUFRLEdBQVcsVUFBVSxDQUFDO1FBSzlCLGVBQVMsR0FBa0IsSUFBSSxDQUFDO1FBS2hDLDBCQUFvQixHQUFVLEdBQUcsQ0FBQztRQUtsQyxpQkFBVyxHQUFrQixJQUFJLENBQUM7UUFLbEMsb0JBQWMsR0FBUSxDQUFDLENBQUM7UUFFdkIsZUFBUyxHQUFVLEdBQUcsQ0FBQztRQUN2QiwyQkFBcUIsR0FBVSxHQUFHLENBQUM7UUFDbkMsZUFBUyxHQUFvQixFQUFFLENBQUM7UUFDaEMsZ0JBQVUsR0FBcUIsSUFBSSxDQUFDO1FBQ3BDLGFBQU8sR0FBWSxLQUFLLENBQUM7O0lBMkluQyxDQUFDO0lBeklRLDRCQUFPLEdBQWQ7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxN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QUFFLFFBQVE7U0FDZixDQUFDO2dEQUM0QjtJQUs5QjtRQUhDLGdCQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztZQUMxQixJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7Z0RBQzJCO0lBSzdCO1FBSEMsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1lBQzFCLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQztnREFDbUM7SUFLckM7UUFIQyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDMUIsSUFBSSxFQUFFLGdCQUFNLENBQUMsTUFBTTtTQUNwQixDQUFDO2lEQUNxQztJQUt2QztRQUhDLGdCQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztZQUMxQixJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7NERBQ3VDO0lBS3pDO1FBSEMsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1lBQzFCLElBQUksRUFBRSxnQkFBTSxDQUFDLE1BQU07U0FDcEIsQ0FBQzttREFDdUM7SUFLekM7UUFIQyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDMUIsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO3NEQUM2QjtJQWhFWixVQUFVO1FBRDlCLGdCQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7T0FDckIsVUFBVSxDQWlOOUI7SUFBRCxpQkFBQztDQWpORCxBQWlOQyxDQWpOdUMsZ0JBQU0sQ0FBQyxNQUFNLEdBaU5wRDtrQkFqTm9CLFVBQVUiLCJmaWxlIjoiQXNzZXRzL1NjcmlwdHMvUHJvamVjdGlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8c3VtbWFyeT5cbi8vLyBQcm9qZWN0aWxlLmNzXG4vLy8g5oqK6L+Z5Liq6ISa5pys6ZmE5Yqg5Yiw5oqV5bCE6aKE5Yi25Lu25LiK44CC6L+Z5YyF5ous54Gr566t44CB5a+85by544CB6L+r5Ye754Ku44CB5qa05by55Y+R5bCE5Zmo5ZKM6K645aSa5YW25LuW5q2m5Zmo44CC6L+Z5Liq6ISa5pys5Y+v5Lul5aSE55CG5p+l5om+5a+85by55ZKM54iG54K455qE5a6e5L6L5YyW562J54m55oCn44CCXG4vLy8gPC9zdW1tYXJ5PlxuaW1wb3J0IGVuZ2luZSBmcm9tIFwiZW5naW5lXCI7XG5pbXBvcnQgQ29sbGlzaW9uIGZyb20gXCJlbmdpbmUvZ2FtZS9waHlzaWNzL2NvbGxpc2lvblwiO1xuaW1wb3J0IHsgZmxvYXQsIGludCB9IGZyb20gXCJlbmdpbmUvdHlwZVwiO1xuaW1wb3J0IEV2ZW50Q2VudGVyLCB7IGRhdGVDZW50ZXIgfSBmcm9tIFwiLi9ldmVudENlbnRlclwiO1xuXG5jb25zdCBlbnVtIFByb2plY3RpbGVUeXBlIHtcbiAgU3RhbmRhcmQsXG4gIFNlZWtlcixcbiAgQ2x1c3RlckJvbWJcbn1cbmNvbnN0IGVudW0gRGFtYWdlVHlwZSB7XG4gIERpcmVjdCxcbiAgRXhwbG9zaW9uXG59XG5cbkBlbmdpbmUuZGVjb3JhdG9ycy5zZXJpYWxpemUoXCJQcm9qZWN0aWxlXCIpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9qZWN0aWxlIGV4dGVuZHMgZW5naW5lLlNjcmlwdCB7XG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5LmVudW0oe1xuICAgIHR5cGU6IHsgJ1N0YW5kYXJkJzogMCwgJ1NlZWtlcic6IDEsICdDbHVzdGVyQm9tYic6IDIgfSxcbiAgICB0b29sdGlwczogJ+WwhOW8ueexu+WeiydcbiAgfSlcbiAgcHVibGljIHByb2plY3RpbGVUeXBlOiBQcm9qZWN0aWxlVHlwZSA9IFByb2plY3RpbGVUeXBlLlN0YW5kYXJkO1x0XHQvLyDlsITlvLnnsbvlnost5qCH5YeG5piv5LiA5Liq56yU55u05ZCR5YmN56e75Yqo55qE5bCE5by577yM5o6i57Si6ICF57G75Z6L5a+75om+5bim5pyJ5oyH5a6a5qCH562+55qE5ri45oiP5a+56LGhXG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5LmVudW0oe1xuICAgIHR5cGU6IHsgJ0RpcmVjdCc6IDAsICdFeHBsb3Npb24nOiAxLCB9LFxuICAgIHRvb2x0aXBzOiAn5Lyk5a6z57G75Z6LJ1xuICB9KVxuICBwdWJsaWMgZGFtYWdlVHlwZTogRGFtYWdlVHlwZSA9IERhbWFnZVR5cGUuRGlyZWN0O1x0XHRcdFx0XHQvLyDkvKTlrrPnsbvlnost55u05o6l5L2/55So5bCE5by56YCg5oiQ55qE5Lyk5a6z77yM54iG54K46K6p5LiA5Liq5a6e5L6L5YyW55qE54iG54K45aSE55CG5Lyk5a6zXG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcbiAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICB0b29sdGlwczogJ+S8pOWus+WAvCdcbiAgfSlcbiAgcHVibGljIGRhbWFnZTogZmxvYXQgPSAxMDAuMDtcdFx0XHRcdFx0XHRcdFx0XHQgICBcdCAgLy8g6YCC55So55qE5Lyk5a6z5YC8KOS7hemAgueUqOS6juebtOaOpeaNn+Wus+exu+WeiylcblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6ICdudW1iZXInLFxuICAgIHRvb2x0aXBzOiAn54Ku5by556e75Yqo6YCf5bqmJ1xuICB9KVxuICBwdWJsaWMgc3BlZWQ6IGZsb2F0ID0gMTAuMDtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgIC8vIOWPkeWwhOeJqeenu+WKqOeahOmAn+W6plxuXG4gIEBlbmdpbmUuZGVjb3JhdG9ycy5wcm9wZXJ0eSh7XG4gICAgdHlwZTogJ251bWJlcicsXG4gIH0pXG4gIHB1YmxpYyBpbml0aWFsRm9yY2U6IGZsb2F0ID0gMTAwMC4wO1x0XHRcdFx0XHRcdFx0XHQvLyDlvLnkuLjliJ3lp4vnp7vliqjml7bmiYDmlr3liqDlnKjlvLnkuLjkuIrnmoTpgJ/luqbliptcblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6ICdudW1iZXInLFxuICB9KVxuICBwdWJsaWMgbGlmZXRpbWU6IGZsb2F0ID0gMzAuMDtcdFx0XHRcdFx0XHRcdFx0XHRcdCAgLy8g5Zyo54Ku5by56KKr5pGn5q+B5YmN55qE5pyA5aSn5pe26Ze0KOS7peenkuS4uuWNleS9jSlcblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6ICdudW1iZXInLFxuICB9KVxuICBwdWJsaWMgc2Vla1JhdGU6IGZsb2F0ID0gMS4wO1x0XHRcdFx0XHRcdFx0XHRcdCAgIFx0ICAvLyDngq7lvLnlr7vmib7mlYzkurrnmoTpgJ/luqZcblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICB9KVxuICBwdWJsaWMgc2Vla05hbWU6IHN0cmluZyA9ICdiYXJyZWxfMSc7XHRcdFx0XHRcdFx0XHRcdCAgIFx0Ly8g5oqV5bCE5L2T5bCG5a+75om+5bim5pyJ6L+Z5Liq5qCH562+55qE5ri45oiP5a+56LGhXG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcbiAgICB0eXBlOiBlbmdpbmUuUHJlZmFiLFxuICB9KVxuICBwdWJsaWMgZXhwbG9zaW9uOiBlbmdpbmUuUHJlZmFiID0gbnVsbDtcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIOW9k+i/meS4queCruW8ueWHu+S4reafkOeJqeaXtuWwhuiiq+WunuS+i+WMlueahOeIhueCuOeJueaViFxuXG4gIEBlbmdpbmUuZGVjb3JhdG9ycy5wcm9wZXJ0eSh7XG4gICAgdHlwZTogJ251bWJlcicsXG4gIH0pXG4gIHB1YmxpYyB0YXJnZXRMaXN0VXBkYXRlUmF0ZTogZmxvYXQgPSAxLjA7XHRcdFx0XHRcdFx0XHQvLyDmipXlsITnianlsIbmm7TmlrDmiYDmnInnm67moIfmlYzkurrliJfooajnmoTpgJ/njodcblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6IGVuZ2luZS5QcmVmYWIsXG4gIH0pXG4gIHB1YmxpYyBjbHVzdGVyQm9tYjogZW5naW5lLlByZWZhYiA9IG51bGw7XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyDlpoLmnpzmraTngq7lvLnmmK/pm4bmnZ/ngrjlvLnnsbvlnovvvIzliJnlnKjniIbngrjkuIrlrp7kvovljJbnmoTngrjlvLlcblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6ICdudW1iZXInLFxuICB9KVxuICBwdWJsaWMgY2x1c3RlckJvbWJOdW06IGludCA9IDY7XHRcdFx0XHRcdFx0XHRcdFx0XHQgLy8g6KaB5a6e5L6L5YyW55qE6ZuG5p2f54K45by555qE5pWw6YePXG5cbiAgcHJpdmF0ZSBsaWZlVGltZXI6IGZsb2F0ID0gMC4wO1x0XHRcdFx0XHRcdFx0XHRcdCAgXHQvLyDorqHml7blmajmnaXot5/ouKrov5nkuKrmipvnianlt7Lnu4/lrZjlnKjkuoblpJrplb/ml7bpl7RcbiAgcHJpdmF0ZSB0YXJnZXRMaXN0VXBkYXRlVGltZXI6IGZsb2F0ID0gMC4wO1x0XHRcdFx0XHRcdFx0Ly8g6K6h5pe25Zmo55So5LqO6K6w5b2V5pWM5Lq65YiX6KGo5LiK5qyh5pu05paw5ZCO55qE5pe26Ze0XG4gIHByaXZhdGUgZW5lbXlMaXN0OiBlbmdpbmUuRW50aXR5W10gPSBbXTtcdFx0XHRcdFx0XHRcdFx0Ly8g5a2Y5YKo5Y+v6IO955uu5qCH55qE5pWw57uEXG4gIHByaXZhdGUgX1JpZ2lkYm9keTogZW5naW5lLlJpZ2lkYm9keSA9IG51bGw7XG4gIHByaXZhdGUgaXNCdXJzdDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyBvbkF3YWtlKCkge1xuICAgIHRoaXMuX1JpZ2lkYm9keSA9IHRoaXMuZW50aXR5LmdldENvbXBvbmVudChlbmdpbmUuUmlnaWRib2R5KTtcbiAgICB0aGlzLmluaXRFdmVudCgpO1xuICB9XG5cbiAgcHVibGljIG9uU3RhcnQoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgZW5lbXkgbGlzdFxuICAgIHRoaXMuVXBkYXRlRW5lbXlMaXN0KCk7XG5cbiAgICAvLyBBZGQgdGhlIGluaXRpYWwgZm9yY2UgdG8gcmlnaWRib2R5XG4gICAgdGhpcy5fUmlnaWRib2R5LmFkZFJlbGF0aXZlRm9yY2UoZW5naW5lLlZlY3RvcjMuY3JlYXRlRnJvbU51bWJlcigwLCAwLCB0aGlzLmluaXRpYWxGb3JjZSksIGVuZ2luZS5Gb3JjZU1vZGUuRm9yY2UpO1xuXG4gICAgLy8g5L2/5oqb5bCE5L2T56e75YqoXG4gICAgaWYgKHRoaXMuaW5pdGlhbEZvcmNlID09IDAgJiYgIXRoaXMuZW50aXR5LmlzRGVzdHJveWVkKSB7XG4gICAgICAvLyDlj6rmnInlvZPliJ3lp4vlipvmsqHmnInooqvnlKjmnaXmjqjliqjmipvlsITnialcbiAgICAgIGNvbnN0IG1vdmVtZW50ID0gZW5naW5lLlZlY3RvcjMuY3JlYXRlRnJvbU51bWJlcih0aGlzLmVudGl0eS50cmFuc2Zvcm0uZm9yd2FyZC54ICogdGhpcy5zcGVlZCAqIC0xLCB0aGlzLmVudGl0eS50cmFuc2Zvcm0uZm9yd2FyZC55ICogdGhpcy5zcGVlZCAqIC0xLCB0aGlzLmVudGl0eS50cmFuc2Zvcm0uZm9yd2FyZC56ICogdGhpcy5zcGVlZCAqIC0xKTtcbiAgICAgIHRoaXMuX1JpZ2lkYm9keS52ZWxvY2l0eSA9IG1vdmVtZW50O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvblVwZGF0ZShkdCkge1xuICAgIC8vIFVwZGF0ZSB0aGUgdGltZXJcbiAgICB0aGlzLmxpZmVUaW1lciArPSBkdDtcblxuICAgIC8vIOWmguaenOaXtumXtOWIsOS6hu+8jOW5tuS4lOW8ueS4uOayoeacieeIhueCuOWwseaRp+avgeW8ueS4uFxuICAgIGlmICh0aGlzLmxpZmVUaW1lciA+PSB0aGlzLmxpZmV0aW1lICYmICF0aGlzLmlzQnVyc3QpIHtcbiAgICAgIHRoaXMuRXhwbG9kZSh0aGlzLmVudGl0eS50cmFuc2Zvcm0ud29ybGRQb3NpdGlvbik7XG4gICAgICAvLyB0aGlzLl9SaWdpZGJvZHkuc2xlZXAoKTtcbiAgICAgIC8vIC8vIOmUgOavgei/meS4queCruW8uVxuICAgICAgLy8gY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAvLyBsZXQgdGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vICAgc2VsZi5lbnRpdHkuZGVzdHJveSgpO1xuICAgICAgLy8gfVxuICAgICAgLy8gc2V0VGltZW91dCh0aW1lb3V0LCAyMClcbiAgICB9XG5cbiAgICAvL+WmguaenOW8ueS4uOexu+Wei+iuvue9ruS4ulNlZWtlcu+8jOW8ueS4uOWwseS8muWvu+aJvumZhOi/keeahOebruagh1xuICAgIGlmICh0aGlzLnByb2plY3RpbGVUeXBlID09IFByb2plY3RpbGVUeXBlLlNlZWtlcikge1xuICAgICAgLy8gS2VlcCB0aGUgdGltZXIgdXBkYXRpbmdcbiAgICAgIHRoaXMudGFyZ2V0TGlzdFVwZGF0ZVRpbWVyICs9IGR0O1xuXG4gICAgICAvLyDlpoLmnpx0YXJnZXRMaXN0VXBkYXRlVGltZXLovr7liLB0YXJnZXRMaXN0VXBkYXRlUmF0Ze+8jOabtOaWsOaVjOS6uuWIl+ihqOW5tumHjeaWsOWQr+WKqOiuoeaXtuWZqFxuICAgICAgaWYgKHRoaXMudGFyZ2V0TGlzdFVwZGF0ZVRpbWVyID49IHRoaXMudGFyZ2V0TGlzdFVwZGF0ZVJhdGUpIHtcbiAgICAgICAgdGhpcy5VcGRhdGVFbmVteUxpc3QoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZW5lbXlMaXN0ICE9IG51bGwpIHtcbiAgICAgICAgLy/pgInmi6nkuIDkuKropoHigJzlr7vmib7igJ3miJbml4vovaznmoTnm67moIdcbiAgICAgICAgbGV0IGdyZWF0ZXN0RG90U29GYXI6IGZsb2F0ID0gMDtcbiAgICAgICAgbGV0IHRhcmdldDogZW5naW5lLlZlY3RvcjMgPSBlbmdpbmUuVmVjdG9yMy5jcmVhdGVGcm9tTnVtYmVyKHRoaXMuZW50aXR5LnRyYW5zZm9ybS5mb3J3YXJkLnggKiAxMDAwLCB0aGlzLmVudGl0eS50cmFuc2Zvcm0uZm9yd2FyZC55ICogMTAwMCwgdGhpcy5lbnRpdHkudHJhbnNmb3JtLmZvcndhcmQueiAqIDEwMDApO1xuICAgICAgICBmb3IgKGNvbnN0IGVuZW15IG9mIHRoaXMuZW5lbXlMaXN0KSB7XG4gICAgICAgICAgaWYgKGVuZW15ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbjogZW5naW5lLlZlY3RvcjMgPSBlbmVteS50cmFuc2Zvcm0ud29ybGRQb3NpdGlvbi5jbG9uZSgpLnN1Yih0aGlzLmVudGl0eS50cmFuc2Zvcm0ud29ybGRQb3NpdGlvbi5jbG9uZSgpKTtcbiAgICAgICAgICAgIGNvbnN0IGRvdDogZmxvYXQgPSBkaXJlY3Rpb24ubm9ybWFsaXplKCkuZG90KHRoaXMuZW50aXR5LnRyYW5zZm9ybS5mb3J3YXJkKTtcbiAgICAgICAgICAgIGlmIChkb3QgPiBncmVhdGVzdERvdFNvRmFyKSB7XG4gICAgICAgICAgICAgIHRhcmdldCA9IGVuZW15LnRyYW5zZm9ybS53b3JsZFBvc2l0aW9uO1xuICAgICAgICAgICAgICBncmVhdGVzdERvdFNvRmFyID0gZG90O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOaXi+i9rOaKm+WwhOS9k+S7peazqOinhuebruagh1xuICAgICAgICBjb25zdCB0YXJnZXRSb3RhdGlvbjogZW5naW5lLlF1YXRlcm5pb24gPSBlbmdpbmUuUXVhdGVybmlvbi5sb29rUm90YXRpb24odGFyZ2V0LnN1Yih0aGlzLmVudGl0eS50cmFuc2Zvcm0ud29ybGRQb3NpdGlvbiksIHRoaXMuZW50aXR5LnRyYW5zZm9ybS51cCk7XG4gICAgICAgIHRoaXMuZW50aXR5LnRyYW5zZm9ybS5xdWF0ZXJuaW9uID0gdGhpcy5lbnRpdHkudHJhbnNmb3JtLndvcmxkUXVhdGVybmlvbi5zbGVycCh0YXJnZXRSb3RhdGlvbiwgZHQgKiB0aGlzLnNlZWtSYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIFVwZGF0ZUVuZW15TGlzdCgpIHtcbiAgICB0aGlzLmVuZW15TGlzdCA9IHRoaXMuRmluZEdhbWVPYmplY3RzV2l0aFRhZyh0aGlzLnNlZWtOYW1lKTtcbiAgICB0aGlzLnRhcmdldExpc3RVcGRhdGVUaW1lciA9IDAuMDtcbiAgfVxuXG4gIHB1YmxpYyBvbkNvbGxpc2lvbkVudGVyKGNvbDogQ29sbGlzaW9uKSB7XG4gICAgLy8g5aaC5p6c5by55Li45LiO5p+Q54mp5Y+R55Sf56Kw5pKe77yM5bCx5L2/54Ku5by554iG54K4XG4gICAgY29uc3QgcG9zaXRpb24gPSBjb2wuY29udGFjdHNbMF0ucG9pbnQuY2xvbmUoKTtcbiAgICB0aGlzLkV4cGxvZGUocG9zaXRpb24pO1xuXG4gICAgLy8g5aaC5p6cZGFtYWdlVHlwZeiuvue9ruS4uuebtOaOpe+8jOWvueWRveS4reeahOeJqeS9k+aWveWKoOS8pOWus1xuICAgIGlmICh0aGlzLmRhbWFnZVR5cGUgPT0gRGFtYWdlVHlwZS5EaXJlY3QpIHtcbiAgICAgIEV2ZW50Q2VudGVyLmVtaXQoXCJDaGFuZ2VIZWFsdGhcIiwgLXRoaXMuZGFtYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIEV4cGxvZGUocG9zaXRpb246IGVuZ2luZS5WZWN0b3IzKSB7XG4gICAgdGhpcy5pc0J1cnN0ID0gdHJ1ZTtcbiAgICAvLyDlrp7kvovljJbniIbngrjnspLlrZDnibnmlYhcbiAgICBpZiAodGhpcy5leHBsb3Npb24gIT0gbnVsbCkge1xuICAgICAgY29uc3QgZXhwID0gdGhpcy5leHBsb3Npb24uaW5zdGFudGlhdGUoKTtcbiAgICAgIGV4cC50cmFuc2Zvcm0ud29ybGRQb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgLy/mt7vliqDkuLrlnLrmma/moLnoioLngrnnmoTlrZDniankvZNcbiAgICAgIGRhdGVDZW50ZXIuU2NlbmVOb2RlLnRyYW5zZm9ybS5hZGRDaGlsZChleHAudHJhbnNmb3JtKTtcbiAgICB9XG5cbiAgICAvLyDlrp7kvovljJYgY2x1c3RlckJvbWJOdW0g5LiqIENsdXN0ZXIgYm9tYnNcbiAgICAvLyBpZiAodGhpcy5wcm9qZWN0aWxlVHlwZSA9PSBQcm9qZWN0aWxlVHlwZS5DbHVzdGVyQm9tYikge1xuICAgIC8vICAgaWYgKHRoaXMuY2x1c3RlckJvbWIgIT0gbnVsbCkge1xuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLmNsdXN0ZXJCb21iTnVtOyBpKyspIHtcbiAgICAvLyAgICAgICBjb25zdCBjQiA9IHRoaXMuY2x1c3RlckJvbWIuaW5zdGFudGlhdGUoKTtcbiAgICAvLyAgICAgICBjQi50cmFuc2Zvcm0ud29ybGRQb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIC8vICAgICAgIC8v5re75Yqg5Li65Zy65pmv5qC56IqC54K555qE5a2Q54mp5L2TXG4gICAgLy8gICAgICAgZGF0ZUNlbnRlci5TY2VuZU5vZGUudHJhbnNmb3JtLmFkZENoaWxkKGNCLnRyYW5zZm9ybSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyDplIDmr4Hov5nkuKrngq7lvLlcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBsZXQgdGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuZW50aXR5LmRlc3Ryb3koKTtcbiAgICB9XG4gICAgc2V0VGltZW91dCh0aW1lb3V0LCAyMClcblxuICB9XG5cbiAgcHJpdmF0ZSBpbml0RXZlbnQoKSB7XG4gICAgLy8g5L+u5pS55q2k54Ku5by55omA6IO96YCg5oiQ55qE5Lyk5a6zXG4gICAgRXZlbnRDZW50ZXIub25jZShFdmVudENlbnRlci5NdWx0aXBseURhbWFnZSwgKGFtb3VudDogbnVtYmVyKSA9PiB7XG4gICAgICB0aGlzLmRhbWFnZSAqPSBhbW91bnQ7XG4gICAgfSlcbiAgICAvLyDkv67mlLnliJ3lp4vliptcbiAgICBFdmVudENlbnRlci5vbmNlKEV2ZW50Q2VudGVyLk11bHRpcGx5SW5pdGlhbEZvcmNlLCAoYW1vdW50OiBudW1iZXIpID0+IHtcbiAgICAgIHRoaXMuaW5pdGlhbEZvcmNlICo9IGFtb3VudDtcbiAgICB9KVxuICB9XG5cbiAgcHJpdmF0ZSBGaW5kR2FtZU9iamVjdHNXaXRoVGFnKHNlZWtOYW1lOiBzdHJpbmcpOiBlbmdpbmUuRW50aXR5W10ge1xuICAgIGNvbnN0IGVudGl0eUxpc3Q6IGVuZ2luZS5FbnRpdHlbXSA9IFtdO1xuICAgIGNvbnN0IHJvb3QgPSBkYXRlQ2VudGVyLlNjZW5lTm9kZS50cmFuc2Zvcm0uZmluZENoaWxkQnlOYW1lKCdlbnZpcm9ubWVudCcpLmVudGl0eTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvb3QudHJhbnNmb3JtLmNoaWxkcmVuQ291bnQ7IGkrKykge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHJvb3QudHJhbnNmb3JtLmNoaWxkcmVuW2ldLmVudGl0eTtcbiAgICAgIGlmIChlbGVtZW50Lm5hbWUgPT0gc2Vla05hbWUpIHtcbiAgICAgICAgZW50aXR5TGlzdC5wdXNoKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZW50aXR5TGlzdFxuICB9XG59Il19
