"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("./eventCenter");
var WeaponType;
(function (WeaponType) {
    WeaponType[WeaponType["Projectile"] = 0] = "Projectile";
    WeaponType[WeaponType["Raycast"] = 1] = "Raycast";
    WeaponType[WeaponType["Beam"] = 2] = "Beam";
})(WeaponType || (WeaponType = {}));
var Auto;
(function (Auto) {
    Auto[Auto["Full"] = 0] = "Full";
    Auto[Auto["Semi"] = 1] = "Semi";
})(Auto || (Auto = {}));
var Weapon = (function (_super) {
    tslib_1.__extends(Weapon, _super);
    function Weapon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = WeaponType.Projectile;
        _this.auto = Auto.Full;
        _this.playerWeapon = true;
        _this.weaponModels = null;
        _this.weaponModel = null;
        _this.originalPoint = null;
        _this.originalQua = null;
        _this.warmup = false;
        _this.maxWarmup = 2.0;
        _this.multiplyForce = true;
        _this.multiplyPower = false;
        _this.powerMultiplier = 1.0;
        _this.initialForceMultiplier = 1.0;
        _this.heat = 0.0;
        _this.projectile = null;
        _this.projectileSpawnSpot = null;
        _this.rateOfFire = 2;
        _this.actualROF = 0;
        _this.fireTimer = 0;
        _this.infiniteAmmo = false;
        _this.ammoCapacity = 20;
        _this.shotPerRound = 1;
        _this.currentAmmo = 0;
        _this.reloadTime = 2.0;
        _this.reloadAutomatically = true;
        _this.burstRate = 3;
        _this.burstPause = 0.0;
        _this.burstCounter = 0;
        _this.burstTimer = 0.0;
        _this.recoil = true;
        _this.recoilKickBackMin = 0.4;
        _this.recoilKickBackMax = 0.5;
        _this.recoilRotationMin = 5;
        _this.recoilRotationMax = 8;
        _this.recoilRecoveryRate = 6;
        _this.makeMuzzleEffects = true;
        _this.muzzleEffects = null;
        _this.muzzleEffectsPosition = null;
        _this.canFire = true;
        _this.press = false;
        return _this;
    }
    Weapon.prototype.onAwake = function () {
        this.initEvent();
    };
    Weapon.prototype.onStart = function () {
        this.projectileSpawnSpot.euler.x = -5 * 0.0174;
        eventCenter_1.dateCenter.SceneNode = this.entity.transform.parent.entity;
        if (this.rateOfFire != 0)
            this.actualROF = 1.0 / this.rateOfFire;
        else
            this.actualROF = 0.01;
        this.fireTimer = 0.0;
        this.currentAmmo = this.ammoCapacity;
        if (this.muzzleEffectsPosition == null)
            this.muzzleEffectsPosition = this.entity.transform.children[3].entity.transform;
        if (this.projectileSpawnSpot == null)
            this.projectileSpawnSpot = this.entity.transform.children[3].entity.transform;
        this.weaponModel = this.weaponModels.entity;
        if (this.weaponModels == null)
            this.weaponModel = this.entity.transform.children[0].entity;
        this.originalPoint = engine_1.default.Vector3.createFromNumber(0, 0, 0);
        this.originalQua = engine_1.default.Quaternion.createFromNumber(0, 0, 0, 1);
    };
    Weapon.prototype.initEvent = function () {
        var _this = this;
        eventCenter_1.default.on(eventCenter_1.default.HURT_PLAYER, function () {
        });
        eventCenter_1.default.on(eventCenter_1.default.START_SHOOT, function () {
            _this.press = true;
        });
        eventCenter_1.default.on(eventCenter_1.default.END_SHOOT, function () {
            _this.press = false;
        });
    };
    Weapon.prototype.onUpdate = function (dt) {
        this.fireTimer += dt;
        if (this.playerWeapon) {
            this.CheckForUserInput(dt);
        }
        if (this.reloadAutomatically && this.currentAmmo <= 0)
            this.Reload();
        if (this.playerWeapon && this.recoil && this.type != WeaponType.Beam) {
            this.weaponModel.transform.position = this.weaponModel.transform.position.lerp(this.originalPoint, this.recoilRecoveryRate * dt);
            this.weaponModel.transform.quaternion = this.weaponModel.transform.quaternion.slerp(this.originalQua, this.recoilRecoveryRate * dt);
        }
    };
    Weapon.prototype.CheckForUserInput = function (dt) {
        if (this.type == WeaponType.Projectile) {
            if (this.fireTimer >= this.actualROF && this.burstCounter < this.burstRate && this.canFire) {
                if (this.press) {
                    if (!this.warmup) {
                        this.Launch();
                    }
                    else if (this.heat < this.maxWarmup) {
                        this.heat += dt;
                    }
                }
                if (this.warmup && this.press) {
                    this.Launch();
                }
            }
        }
        if (this.burstCounter >= this.burstRate) {
            this.burstTimer += dt;
            if (this.burstTimer >= this.burstPause) {
                this.burstCounter = 0;
                this.burstTimer = 0.0;
            }
        }
        if (this.press)
            this.canFire = true;
    };
    Weapon.prototype.Launch = function () {
        this.fireTimer = 0.0;
        this.burstCounter++;
        if (this.auto == Auto.Semi)
            this.canFire = false;
        if (this.currentAmmo <= 0) {
            this.DryFire();
            return;
        }
        if (!this.infiniteAmmo)
            this.currentAmmo--;
        for (var i = 0; i < this.shotPerRound; i++) {
            if (this.projectile != null) {
                var proj = this.projectile.instantiate();
                this.entity.transform.parent.entity.transform.addChild(proj.transform);
                proj.transform.worldPosition = this.projectileSpawnSpot.worldPosition;
                proj.transform.quaternion = this.projectileSpawnSpot.worldQuaternion;
                if (this.warmup) {
                    if (this.multiplyPower)
                        eventCenter_1.default.emit("MultiplyDamage", this.heat * this.powerMultiplier);
                    if (this.multiplyForce)
                        eventCenter_1.default.emit("MultiplyInitialForce", this.heat * this.initialForceMultiplier);
                    this.heat = 0.0;
                }
            }
            else {
                console.log("Projectile to be instantiated is null.  Make sure to set the Projectile field in the inspector.");
            }
        }
        if (this.recoil)
            this.Recoil();
        if (this.makeMuzzleEffects) {
            var muzfx = this.muzzleEffects.instantiate();
            this.entity.transform.children[3].entity.transform.addChild(muzfx.transform);
            muzfx.transform.position = engine_1.default.Vector3.ZERO.clone();
        }
    };
    Weapon.prototype.DryFire = function () {
    };
    Weapon.prototype.Recoil = function () {
        if (!this.playerWeapon)
            return;
        if (this.weaponModel == null) {
            console.log("Weapon Model is null.  Make sure to set the Weapon Model field in the inspector.");
            return;
        }
        var kickBack = this.random(this.recoilKickBackMin, this.recoilKickBackMax);
        var kickRot = this.random(this.recoilRotationMin, this.recoilRotationMax);
        this.weaponModel.transform.position = this.weaponModel.transform.position.add(engine_1.default.Vector3.createFromNumber(0, 0, -kickBack));
        this.weaponModel.transform.rotate(engine_1.default.Vector3.createFromNumber(-kickRot, 0, 0), true, false);
    };
    Weapon.prototype.Reload = function () {
        this.currentAmmo = this.ammoCapacity;
        this.fireTimer = -this.reloadTime;
        eventCenter_1.default.emit("OnEasyWeaponsReload");
    };
    Weapon.prototype.random = function (min, max) {
        var vaer = Math.random() * (max - min) + min;
        return parseFloat(vaer.toFixed(5));
    };
    tslib_1.__decorate([
        engine_1.default.decorators.property.enum({
            type: { 'Projectile': 0, 'Raycast': 1, 'Beam': 2 },
            tooltips: '武器类型'
        })
    ], Weapon.prototype, "type", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property.enum({
            type: { 'Full': 0, 'Semi': 1 },
            tooltips: '半自动和全自动'
        })
    ], Weapon.prototype, "auto", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'boolean',
            tooltips: '是否玩家'
        })
    ], Weapon.prototype, "playerWeapon", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: engine_1.default.Transform3D,
            tooltips: '武器模型的实体'
        })
    ], Weapon.prototype, "weaponModels", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: engine_1.default.Prefab
        })
    ], Weapon.prototype, "projectile", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: engine_1.default.Transform3D
        })
    ], Weapon.prototype, "projectileSpawnSpot", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'boolean',
            tooltips: '是否无限弹药'
        })
    ], Weapon.prototype, "infiniteAmmo", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: engine_1.default.Prefab
        })
    ], Weapon.prototype, "muzzleEffects", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: engine_1.default.Transform3D,
            tooltips: '枪口效果位置'
        })
    ], Weapon.prototype, "muzzleEffectsPosition", void 0);
    Weapon = tslib_1.__decorate([
        engine_1.default.decorators.serialize("Weapon")
    ], Weapon);
    return Weapon;
}(engine_1.default.Script));
exports.default = Weapon;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFzc2V0cy9TY3JpcHRzL1dlYXBvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBNEI7QUFFNUIsNkNBQXdEO0FBRXhELElBQVcsVUFJVjtBQUpELFdBQVcsVUFBVTtJQUNwQix1REFBVSxDQUFBO0lBQ1YsaURBQU8sQ0FBQTtJQUNQLDJDQUFJLENBQUE7QUFDTCxDQUFDLEVBSlUsVUFBVSxLQUFWLFVBQVUsUUFJcEI7QUFDRCxJQUFXLElBR1Y7QUFIRCxXQUFXLElBQUk7SUFDZCwrQkFBSSxDQUFBO0lBQ0osK0JBQUksQ0FBQTtBQUNMLENBQUMsRUFIVSxJQUFJLEtBQUosSUFBSSxRQUdkO0FBR0Q7SUFBb0Msa0NBQWE7SUFBakQ7UUFBQSxxRUE4VEM7UUF4VE8sVUFBSSxHQUFlLFVBQVUsQ0FBQyxVQUFVLENBQUM7UUFPekMsVUFBSSxHQUFTLElBQUksQ0FBQyxJQUFJLENBQUM7UUFPdkIsa0JBQVksR0FBWSxJQUFJLENBQUM7UUFNN0Isa0JBQVksR0FBdUIsSUFBSSxDQUFDO1FBQ3ZDLGlCQUFXLEdBQWtCLElBQUksQ0FBQztRQUNsQyxtQkFBYSxHQUFtQixJQUFJLENBQUM7UUFDckMsaUJBQVcsR0FBc0IsSUFBSSxDQUFDO1FBR3ZDLFlBQU0sR0FBWSxLQUFLLENBQUM7UUFDeEIsZUFBUyxHQUFVLEdBQUcsQ0FBQztRQUN2QixtQkFBYSxHQUFZLElBQUksQ0FBQztRQUM5QixtQkFBYSxHQUFZLEtBQUssQ0FBQztRQUMvQixxQkFBZSxHQUFVLEdBQUcsQ0FBQztRQUM3Qiw0QkFBc0IsR0FBVSxHQUFHLENBQUM7UUFDbkMsVUFBSSxHQUFVLEdBQUcsQ0FBQztRQU1uQixnQkFBVSxHQUFrQixJQUFJLENBQUM7UUFLakMseUJBQW1CLEdBQXVCLElBQUksQ0FBQztRQUcvQyxnQkFBVSxHQUFVLENBQUMsQ0FBQztRQUNyQixlQUFTLEdBQVUsQ0FBQyxDQUFDO1FBQ3JCLGVBQVMsR0FBVSxDQUFDLENBQUM7UUFPdEIsa0JBQVksR0FB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QzNCLElBQUksRUFBRSxTQUFTO1lBQ2YsUUFBUSxFQUFFLE1BQU07U0FDaEIsQ0FBQztnREFDa0M7SUFNcEM7UUFKQyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDM0IsSUFBSSxFQUFFLGdCQUFNLENBQUMsV0FBVztZQUN4QixRQUFRLEVBQUUsU0FBUztTQUNuQixDQUFDO2dEQUM2QztJQWtCL0M7UUFIQyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDM0IsSUFBSSxFQUFFLGdCQUFNLENBQUMsTUFBTTtTQUNuQixDQUFDOzhDQUNzQztJQUt4QztRQUhDLGdCQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztZQUMzQixJQUFJLEVBQUUsZ0JBQU0sQ0FBQyxXQUFXO1NBQ3hCLENBQUM7dURBQ29EO0lBWXREO1FBSkMsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1lBQzNCLElBQUksRUFBRSxTQUFTO1lBQ2YsUUFBUSxFQUFFLFFBQVE7U0FDbEIsQ0FBQztnREFDbUM7SUEwQnJDO1FBSEMsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1lBQzNCLElBQUksRUFBRSxnQkFBTSxDQUFDLE1BQU07U0FDbkIsQ0FBQztpREFDeUM7SUFLM0M7UUFKQyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDM0IsSUFBSSxFQUFFLGdCQUFNLENBQUMsV0FBVztZQUN4QixRQUFRLEVBQUUsUUFBUTtTQUNsQixDQUFDO3lEQUNzRDtJQTVGcEMsTUFBTTtRQUQxQixnQkFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO09BQ2pCLE1BQU0sQ0E4VDFCO0lBQUQsYUFBQztDQTlURCxBQThUQyxDQTlUbUMsZ0JBQU0sQ0FBQyxNQUFNLEdBOFRoRDtrQkE5VG9CLE1BQU0iLCJmaWxlIjoiQXNzZXRzL1NjcmlwdHMvV2VhcG9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVuZ2luZSBmcm9tIFwiZW5naW5lXCI7XG5pbXBvcnQgeyBmbG9hdCB9IGZyb20gXCJlbmdpbmUvdHlwZVwiO1xuaW1wb3J0IEV2ZW50Q2VudGVyLCB7IGRhdGVDZW50ZXIgfSBmcm9tIFwiLi9ldmVudENlbnRlclwiO1xuXG5jb25zdCBlbnVtIFdlYXBvblR5cGUge1xuXHRQcm9qZWN0aWxlLFxuXHRSYXljYXN0LFxuXHRCZWFtXG59XG5jb25zdCBlbnVtIEF1dG8ge1xuXHRGdWxsLFxuXHRTZW1pXG59XG5cbkBlbmdpbmUuZGVjb3JhdG9ycy5zZXJpYWxpemUoXCJXZWFwb25cIilcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYXBvbiBleHRlbmRzIGVuZ2luZS5TY3JpcHQge1xuXHQvLyDmrablmajnsbvlnotcblx0QGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5LmVudW0oe1xuXHRcdHR5cGU6IHsgJ1Byb2plY3RpbGUnOiAwLCAnUmF5Y2FzdCc6IDEsICdCZWFtJzogMiB9LFxuXHRcdHRvb2x0aXBzOiAn5q2m5Zmo57G75Z6LJ1xuXHR9KVxuXHRwdWJsaWMgdHlwZTogV2VhcG9uVHlwZSA9IFdlYXBvblR5cGUuUHJvamVjdGlsZTsgICAgIC8vIOS9v+eUqOeahOaYr+WTquenjeatpuWZqOezu+e7n1xuXG5cdC8vIEF1dG9cblx0QGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5LmVudW0oe1xuXHRcdHR5cGU6IHsgJ0Z1bGwnOiAwLCAnU2VtaSc6IDEgfSxcblx0XHR0b29sdGlwczogJ+WNiuiHquWKqOWSjOWFqOiHquWKqCdcblx0fSlcblx0cHVibGljIGF1dG86IEF1dG8gPSBBdXRvLkZ1bGw7XHRcdFx0XHRcdFx0Ly8g6L+Z56eN5q2m5Zmo5piv5aaC5L2V5byA54Gr55qE4oCU4oCU5Y2K6Ieq5Yqo6L+Y5piv5YWo6Ieq5YqoXG5cblx0Ly8gR2VuZXJhbFxuXHRAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuXHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHR0b29sdGlwczogJ+aYr+WQpueOqeWutidcblx0fSlcblx0cHVibGljIHBsYXllcldlYXBvbjogYm9vbGVhbiA9IHRydWU7XHRcdFx0XHRcdC8vIOi/meaYr+WQpuaYr+eOqeWutueahOatpuWZqO+8jOi/mOaYr0FJ55qE5q2m5ZmoXG5cblx0QGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcblx0XHR0eXBlOiBlbmdpbmUuVHJhbnNmb3JtM0QsXG5cdFx0dG9vbHRpcHM6ICfmrablmajmqKHlnovnmoTlrp7kvZMnXG5cdH0pXG5cdHB1YmxpYyB3ZWFwb25Nb2RlbHM6IGVuZ2luZS5UcmFuc2Zvcm0zRCA9IG51bGw7XHRcdFx0XHRcdFx0Ly8g6L+Z5Liq5q2m5Zmo5qih5Z6L55qE5a6e5L2TXG5cdHByaXZhdGUgd2VhcG9uTW9kZWw6IGVuZ2luZS5FbnRpdHkgPSBudWxsO1xuXHRwcml2YXRlIG9yaWdpbmFsUG9pbnQ6IGVuZ2luZS5WZWN0b3IzID0gbnVsbDsgICAgICAgICAgICAgLy/mrablmajmqKHlnovnmoTliJ3lp4vlnZDmoIfvvIznlKjkuo7lkI7luqflipvmgaLlpI1cblx0cHJpdmF0ZSBvcmlnaW5hbFF1YTogZW5naW5lLlF1YXRlcm5pb24gPSBudWxsOyAgICAgICAgICAgIC8v5q2m5Zmo5qih5Z6L55qE5Yid5aeL5peL6L2s77yM55So5LqO5ZCO5bqn5Yqb5oGi5aSNXG5cblx0Ly8gV2FybXVwXG5cdHB1YmxpYyB3YXJtdXA6IGJvb2xlYW4gPSBmYWxzZTtcdFx0XHRcdFx0XHQvLyDlsITlh7vliY3mmK/lkKblhYHorrjigJzok4TlipvigJ0t5b2T546p5a626ZW/5pe26Ze05oyJ5L2P5bCE5Ye75oyJ6ZKu5pe277yM5YWB6K646IO96YeP5aKe5Yqg77yM6L+Z5Y+q6YCC55So5LqO5Y2K6Ieq5Yqo5YWJ57q/5oqV5bCE5ZKM5oqV5bCE5q2m5ZmoXG5cdHB1YmxpYyBtYXhXYXJtdXA6IGZsb2F0ID0gMi4wO1x0XHRcdFx0XHRcdC8vIOiThOWKm+eahOacgOmVv+aXtumXtOWPr+S7peWvueWKm+mHj+S6p+eUn+S7u+S9leW9seWTje+8jOetieetieOAglxuXHRwdWJsaWMgbXVsdGlwbHlGb3JjZTogYm9vbGVhbiA9IHRydWU7XHRcdFx0XHRcdC8v5by55Li455qE5Yid5aeL5Yqb5piv5ZCm5bqU6K+l5qC55o2u6JOE5Yqb5YC85LmY5LulLeS7heWvueW8ueS4uOmAgueUqFxuXHRwdWJsaWMgbXVsdGlwbHlQb3dlcjogYm9vbGVhbiA9IGZhbHNlO1x0XHRcdFx0XHQvLyDlsITlvLnnmoTkvKTlrrPmmK/lkKblupTor6XmoLnmja7ok4TlipvlgLzkuZjku6Ut5LuF5a+55bCE5by5XG5cdHB1YmxpYyBwb3dlck11bHRpcGxpZXI6IGZsb2F0ID0gMS4wO1x0XHRcdCAgIFx0Ly8g6JOE5Yqb5Y+v5Lul5b2x5ZON5q2m5Zmo5Yqf546H55qE5LmY5pWwO+WKn+eOhz3lip/njocqKOiThOWKm+mHjyrlip/njoflgI3lop7lmagpXG5cdHB1YmxpYyBpbml0aWFsRm9yY2VNdWx0aXBsaWVyOiBmbG9hdCA9IDEuMDtcdFx0XHQvLyDlnKjkuIDkuKrmipvlsITns7vnu5/kuK3vvIzkvb/ok4Tlipvog73lvbHlk43liJ3lp4vlipvnmoTlgI3lop7lmahcblx0cHJpdmF0ZSBoZWF0OiBmbG9hdCA9IDAuMDtcdFx0XHRcdFx0XHRcdC8vIOatpuWZqOiThOWKm+eahOaXtumXtO+8jOWPr+S7peWcqCgw77yM5pyA5aSn6JOE5YqbKeeahOiMg+WbtOWGhVxuXG5cdC8vIFByb2plY3RpbGVcblx0QGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcblx0XHR0eXBlOiBlbmdpbmUuUHJlZmFiXG5cdH0pXG5cdHB1YmxpYyBwcm9qZWN0aWxlOiBlbmdpbmUuUHJlZmFiID0gbnVsbDtcdFx0XHRcdFx0XHQvLyDopoHlj5HlsITnmoTngq7lvLko5aaC5p6c57G75Z6L5piv5by55Li4KVxuXG5cdEBlbmdpbmUuZGVjb3JhdG9ycy5wcm9wZXJ0eSh7XG5cdFx0dHlwZTogZW5naW5lLlRyYW5zZm9ybTNEXG5cdH0pXG5cdHB1YmxpYyBwcm9qZWN0aWxlU3Bhd25TcG90OiBlbmdpbmUuVHJhbnNmb3JtM0QgPSBudWxsO1x0XHRcdFx0Ly8g54Ku5by55bqU6K+l5a6e5L6L5YyW55qE5L2N572uXG5cblx0Ly8gUmF0ZSBvZiBGaXJlXG5cdHB1YmxpYyByYXRlT2ZGaXJlOiBmbG9hdCA9IDI7XHRcdFx0XHRcdFx0Ly8g6L+Z56eN5q2m5Zmo5q+P56eS5Y+R5bCE55qE5a2Q5by55pWwXG5cdHByaXZhdGUgYWN0dWFsUk9GOiBmbG9hdCA9IDA7XHRcdFx0XHRcdFx0XHQvLyBUaGUgZnJlcXVlbmN5IGJldHdlZW4gc2hvdHMgYmFzZWQgb24gdGhlIHJhdGVPZkZpcmVcblx0cHJpdmF0ZSBmaXJlVGltZXI6IGZsb2F0ID0gMDtcdFx0XHRcdFx0XHRcdC8vIOiuoeaXtuWZqOeUqOS6juaMieiuvuWumueahOmikeeOh+W8gOeBq1xuXG5cdC8vIOW8ueiNr1xuXHRAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuXHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHR0b29sdGlwczogJ+aYr+WQpuaXoOmZkOW8ueiNrydcblx0fSlcblx0cHVibGljIGluZmluaXRlQW1tbzogYm9vbGVhbiA9IGZhbHNlO1x0XHRcdFx0XHQvLyBXaGV0aGVyIG9yIG5vdCB0aGlzIHdlYXBvbiBzaG91bGQgaGF2ZSB1bmxpbWl0ZWQgYW1tb1xuXHRwdWJsaWMgYW1tb0NhcGFjaXR5OiBudW1iZXIgPSAyMDtcdFx0XHRcdFx0XHQvLyBUaGUgbnVtYmVyIG9mIHJvdW5kcyB0aGlzIHdlYXBvbiBjYW4gZmlyZSBiZWZvcmUgaXQgaGFzIHRvIHJlbG9hZFxuXHRwdWJsaWMgc2hvdFBlclJvdW5kOiBudW1iZXIgPSAxO1x0XHRcdFx0XHRcdC8vIFRoZSBudW1iZXIgb2YgXCJidWxsZXRzXCIgdGhhdCB3aWxsIGJlIGZpcmVkIG9uIGVhY2ggcm91bmQuICBVc3VhbGx5IHRoaXMgd2lsbCBiZSAxLCBidXQgc2V0IHRvIGEgaGlnaGVyIG51bWJlciBmb3IgdGhpbmdzIGxpa2Ugc2hvdGd1bnMgd2l0aCBzcHJlYWRcblx0cHJpdmF0ZSBjdXJyZW50QW1tbzogbnVtYmVyID0gMDtcdFx0XHRcdFx0XHRcdC8vIEhvdyBtdWNoIGFtbW8gdGhlIHdlYXBvbiBjdXJyZW50bHkgaGFzXG5cdHB1YmxpYyByZWxvYWRUaW1lOiBmbG9hdCA9IDIuMDtcdFx0XHRcdFx0XHQvLyBIb3cgbXVjaCB0aW1lIGl0IHRha2VzIHRvIHJlbG9hZCB0aGUgd2VhcG9uXG5cdHB1YmxpYyByZWxvYWRBdXRvbWF0aWNhbGx5OiBib29sZWFuID0gdHJ1ZTtcdFx0XHRcdC8vIFdoZXRoZXIgb3Igbm90IHRoZSB3ZWFwb24gc2hvdWxkIHJlbG9hZCBhdXRvbWF0aWNhbGx5IHdoZW4gb3V0IG9mIGFtbW9cblxuXHQvLyBCdXJzdFxuXHRwdWJsaWMgYnVyc3RSYXRlOiBudW1iZXIgPSAzO1x0XHRcdFx0XHRcdFx0Ly8g5q+P5qyh54iG54K45Y+R5bCE55qE5a2Q5by55pWwXG5cdHB1YmxpYyBidXJzdFBhdXNlOiBmbG9hdCA9IDAuMDtcdFx0XHRcdFx0XHQvLyDniIbngrjkuYvpl7TnmoTlgZzpob/ml7bpl7Rcblx0cHJpdmF0ZSBidXJzdENvdW50ZXI6IG51bWJlciA9IDA7XHRcdFx0XHRcdFx0Ly8g6K6h5pWw5Zmo6Lef6Liq5pyJ5aSa5bCR5p6q5bey57uP5Y+R5bCE5LqG5q+P5Liq54iG56C0XG5cdHByaXZhdGUgYnVyc3RUaW1lcjogZmxvYXQgPSAwLjA7XHRcdFx0XHRcdC8vIOiuoeaXtuWZqOadpeiusOW9leatpuWZqOWcqOeIhuWPkeS5i+mXtOWBnOmhv+S6huWkmumVv+aXtumXtFxuXG5cdC8vIOWQjuWdkOWKm1xuXHRwdWJsaWMgcmVjb2lsOiBib29sZWFuID0gdHJ1ZTtcdFx0XHRcdFx0XHRcdC8vIOi/meS4quatpuWZqOaYr+WQpuW6lOivpeacieWPjeWGslxuXHRwdWJsaWMgcmVjb2lsS2lja0JhY2tNaW46IG51bWJlciA9IDAuNDtcdFx0XHRcdC8vIFRoZSBtaW5pbXVtIGRpc3RhbmNlIHRoZSB3ZWFwb24gd2lsbCBraWNrIGJhY2t3YXJkIHdoZW4gZmlyZWRcblx0cHVibGljIHJlY29pbEtpY2tCYWNrTWF4OiBudW1iZXIgPSAwLjU7XHRcdFx0XHQvLyBUaGUgbWF4aW11bSBkaXN0YW5jZSB0aGUgd2VhcG9uIHdpbGwga2ljayBiYWNrd2FyZCB3aGVuIGZpcmVkXG5cdHB1YmxpYyByZWNvaWxSb3RhdGlvbk1pbjogbnVtYmVyID0gNTtcdFx0XHRcdC8vIFRoZSBtaW5pbXVtIHJvdGF0aW9uIHRoZSB3ZWFwb24gd2lsbCBraWNrIHdoZW4gZmlyZWRcblx0cHVibGljIHJlY29pbFJvdGF0aW9uTWF4OiBudW1iZXIgPSA4O1x0XHRcdFx0Ly8gVGhlIG1heGltdW0gcm90YXRpb24gdGhlIHdlYXBvbiB3aWxsIGtpY2sgd2hlbiBmaXJlZFxuXHRwdWJsaWMgcmVjb2lsUmVjb3ZlcnlSYXRlOiBmbG9hdCA9IDY7XHRcdFx0Ly8gVGhlIHJhdGUgYXQgd2hpY2ggdGhlIHdlYXBvbiByZWNvdmVycyBmcm9tIHRoZSByZWNvaWwgZGlzcGxhY2VtZW50XG5cblx0Ly8gRWZmZWN0c1xuXHRwcml2YXRlIG1ha2VNdXp6bGVFZmZlY3RzOiBib29sZWFuID0gdHJ1ZTtcdFx0XHRcdC8vIOatpuWZqOaYr+WQpuW6lOivpemAoOaIkOaequWPo+aViOaenFxuXHRAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuXHRcdHR5cGU6IGVuZ2luZS5QcmVmYWJcblx0fSlcblx0cHVibGljIG11enpsZUVmZmVjdHM6IGVuZ2luZS5QcmVmYWIgPSBudWxsO1x0ICAgICAvLyDmnqrlj6PkuIrlh7rnjrDnmoTmlYjmnpwo5p6q5Y+j6Zeq5YWJ44CB5YaS54Of562JKVxuXHRAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuXHRcdHR5cGU6IGVuZ2luZS5UcmFuc2Zvcm0zRCxcblx0XHR0b29sdGlwczogJ+aequWPo+aViOaenOS9jee9ridcblx0fSlcblx0cHVibGljIG11enpsZUVmZmVjdHNQb3NpdGlvbjogZW5naW5lLlRyYW5zZm9ybTNEID0gbnVsbDtcdFx0XHRcdC8vIOaequWPo+aViOaenOW6lOivpeWHuueOsOeahOS9jee9rlxuXG5cdC8vIE90aGVyXG5cdHByaXZhdGUgY2FuRmlyZTogYm9vbGVhbiA9IHRydWU7XHRcdFx0XHRcdFx0Ly8g5q2m5Zmo5b2T5YmN5piv5ZCm5Y+v5Lul5byA54GrKOeUqOS6juWNiuiHquWKqOatpuWZqClcblxuXHQvLyBcdElucHV0XG5cdHByaXZhdGUgcHJlc3M6IGJvb2xlYW4gPSBmYWxzZTsgICAgICAgICAgICAgIC8v54K55Ye75byA54Gr5oyJ6ZKuXG5cblx0cHVibGljIG9uQXdha2UoKSB7XG5cdFx0dGhpcy5pbml0RXZlbnQoKTtcblx0fVxuXG5cdC8v5L2/55So5a6D6L+b6KGM5Yid5aeL5YyWXG5cdHB1YmxpYyBvblN0YXJ0KCkge1xuXHRcdHRoaXMucHJvamVjdGlsZVNwYXduU3BvdC5ldWxlci54ID0gLTUgKiAwLjAxNzQ7XG5cdFx0ZGF0ZUNlbnRlci5TY2VuZU5vZGUgPSB0aGlzLmVudGl0eS50cmFuc2Zvcm0ucGFyZW50LmVudGl0eTtcblx0XHQvLyDorqHnrpfmrablmajns7vnu5/kuK3lrp7pmYXkvb/nlKjnmoTlsITpgJ/jgIJyYXRlT2ZGaXJl5Y+Y6YeP55qE6K6+6K6h5piv5Li65LqG6K6p55So5oi35pu05a655piT5L2/55So77yM5a6D5Luj6KGo5q+P56eS5Y+R5bCE55qE5a2Q5by55pWw44CC5Zyo6L+Z6YeM77yM6K6h566X5LqG5LiA5Liq5a6e6ZmF55qEUk9G5Y2B6L+b5Yi25YC877yM5a6D5Y+v5Lul55So5LqO6K6h5pe25Zmo44CCXG5cdFx0aWYgKHRoaXMucmF0ZU9mRmlyZSAhPSAwKVxuXHRcdFx0dGhpcy5hY3R1YWxST0YgPSAxLjAgLyB0aGlzLnJhdGVPZkZpcmU7XG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5hY3R1YWxST0YgPSAwLjAxO1xuXG5cdFx0Ly8g56Gu5L+d5byA54Gr6K6h5pe25Zmo5ZyoMOW8gOWni1xuXHRcdHRoaXMuZmlyZVRpbWVyID0gMC4wO1xuXG5cblxuXHRcdC8vIOeUqOW8ueWMo+ijhea7oeatpuWZqFxuXHRcdHRoaXMuY3VycmVudEFtbW8gPSB0aGlzLmFtbW9DYXBhY2l0eTtcblxuXHRcdC8vIOehruS/neaequWPo+aViOaenOS9jee9ruS4jeS4uuepulxuXHRcdGlmICh0aGlzLm11enpsZUVmZmVjdHNQb3NpdGlvbiA9PSBudWxsKVxuXHRcdFx0dGhpcy5tdXp6bGVFZmZlY3RzUG9zaXRpb24gPSB0aGlzLmVudGl0eS50cmFuc2Zvcm0uY2hpbGRyZW5bM10uZW50aXR5LnRyYW5zZm9ybTtcblxuXHRcdC8vIOehruS/neeCruW8ueS6p+WNteeCueS4jeS4uuepulxuXHRcdGlmICh0aGlzLnByb2plY3RpbGVTcGF3blNwb3QgPT0gbnVsbClcblx0XHRcdHRoaXMucHJvamVjdGlsZVNwYXduU3BvdCA9IHRoaXMuZW50aXR5LnRyYW5zZm9ybS5jaGlsZHJlblszXS5lbnRpdHkudHJhbnNmb3JtO1xuXG5cdFx0Ly8g56Gu5L+d5q2m5Zmo5qih5Z6L5LiN5piv56m655qEXG5cdFx0dGhpcy53ZWFwb25Nb2RlbCA9IHRoaXMud2VhcG9uTW9kZWxzLmVudGl0eTtcblx0XHRpZiAodGhpcy53ZWFwb25Nb2RlbHMgPT0gbnVsbClcblx0XHRcdHRoaXMud2VhcG9uTW9kZWwgPSB0aGlzLmVudGl0eS50cmFuc2Zvcm0uY2hpbGRyZW5bMF0uZW50aXR5O1xuXG5cdFx0Ly/orrDlvZXmrablmajmqKHlnovnmoTliJ3lp4vmnKzlnLDlnZDmoIdcblx0XHR0aGlzLm9yaWdpbmFsUG9pbnQgPSBlbmdpbmUuVmVjdG9yMy5jcmVhdGVGcm9tTnVtYmVyKDAsIDAsIDApO1xuXHRcdHRoaXMub3JpZ2luYWxRdWEgPSBlbmdpbmUuUXVhdGVybmlvbi5jcmVhdGVGcm9tTnVtYmVyKDAsIDAsIDAsIDEpO1xuXHR9XG5cblx0cHJpdmF0ZSBpbml0RXZlbnQoKSB7XG5cdFx0RXZlbnRDZW50ZXIub24oRXZlbnRDZW50ZXIuSFVSVF9QTEFZRVIsICgpID0+IHtcblxuXHRcdH0pO1xuXG5cdFx0RXZlbnRDZW50ZXIub24oRXZlbnRDZW50ZXIuU1RBUlRfU0hPT1QsICgpID0+IHtcblx0XHRcdHRoaXMucHJlc3MgPSB0cnVlO1xuXHRcdH0pO1xuXG5cdFx0RXZlbnRDZW50ZXIub24oRXZlbnRDZW50ZXIuRU5EX1NIT09ULCAoKSA9PiB7XG5cdFx0XHR0aGlzLnByZXNzID0gZmFsc2U7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBVcGRhdGUgaXMgY2FsbGVkIG9uY2UgcGVyIGZyYW1lXG5cdHB1YmxpYyBvblVwZGF0ZShkdCkge1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBmaXJlVGltZXJcblx0XHR0aGlzLmZpcmVUaW1lciArPSBkdDtcblxuXHRcdC8vIENoZWNrRm9yVXNlcklucHV0KCkgaGFuZGxlcyB0aGUgZmlyaW5nIGJhc2VkIG9uIHVzZXIgaW5wdXRcblx0XHRpZiAodGhpcy5wbGF5ZXJXZWFwb24pIHtcblx0XHRcdHRoaXMuQ2hlY2tGb3JVc2VySW5wdXQoZHQpO1xuXHRcdH1cblxuXHRcdC8vIOWmguaenOatpuWZqOayoeacieW8ueiNr++8jOivt+mHjeaWsOijheWhq1xuXHRcdGlmICh0aGlzLnJlbG9hZEF1dG9tYXRpY2FsbHkgJiYgdGhpcy5jdXJyZW50QW1tbyA8PSAwKVxuXHRcdFx0dGhpcy5SZWxvYWQoKTtcblxuXHRcdC8vIFJlY29pbCBSZWNvdmVyeVxuXHRcdGlmICh0aGlzLnBsYXllcldlYXBvbiAmJiB0aGlzLnJlY29pbCAmJiB0aGlzLnR5cGUgIT0gV2VhcG9uVHlwZS5CZWFtKSB7XG5cdFx0XHR0aGlzLndlYXBvbk1vZGVsLnRyYW5zZm9ybS5wb3NpdGlvbiA9IHRoaXMud2VhcG9uTW9kZWwudHJhbnNmb3JtLnBvc2l0aW9uLmxlcnAodGhpcy5vcmlnaW5hbFBvaW50LCB0aGlzLnJlY29pbFJlY292ZXJ5UmF0ZSAqIGR0KTtcblx0XHRcdHRoaXMud2VhcG9uTW9kZWwudHJhbnNmb3JtLnF1YXRlcm5pb24gPSB0aGlzLndlYXBvbk1vZGVsLnRyYW5zZm9ybS5xdWF0ZXJuaW9uLnNsZXJwKHRoaXMub3JpZ2luYWxRdWEsIHRoaXMucmVjb2lsUmVjb3ZlcnlSYXRlICogZHQpO1xuXHRcdH1cblx0fVxuXG5cdC8vIOajgOafpeeUqOaIt+i+k+WFpeS9v+eUqOatpuWZqC3lj6rmnInlvZPmrablmajmmK/njqnlrrbmjqfliLbnmoRcblx0cHJpdmF0ZSBDaGVja0ZvclVzZXJJbnB1dChkdCkge1xuXHRcdC8vIOWmguaenOi/meaYr+S4gOenjeaKm+WwhOatpuWZqO+8jOeUqOaIt+aMieS4i+W8gOeBq+aMiemSru+8jOWImeWPkeWwhOaKm+WwhOeJqVxuXHRcdGlmICh0aGlzLnR5cGUgPT0gV2VhcG9uVHlwZS5Qcm9qZWN0aWxlKSB7XG5cdFx0XHRpZiAodGhpcy5maXJlVGltZXIgPj0gdGhpcy5hY3R1YWxST0YgJiYgdGhpcy5idXJzdENvdW50ZXIgPCB0aGlzLmJ1cnN0UmF0ZSAmJiB0aGlzLmNhbkZpcmUpIHtcblx0XHRcdFx0aWYgKHRoaXMucHJlc3MpIHtcblx0XHRcdFx0XHRpZiAoIXRoaXMud2FybXVwKVx0Ly8g5b2T55So5oi35oyJ5L2P5byA54Gr5oyJ6ZKu5pe25q2j5bi45byA54GrXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGhpcy5MYXVuY2goKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAodGhpcy5oZWF0IDwgdGhpcy5tYXhXYXJtdXApXHQvLyDlkKbliJnvvIzlj6rpnIDmt7vliqDliLDok4TlipvvvIznm7TliLDnlKjmiLfmlL7lvIDmjInpkq5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0aGlzLmhlYXQgKz0gZHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLndhcm11cCAmJiB0aGlzLnByZXNzKSB7XG5cdFx0XHRcdFx0dGhpcy5MYXVuY2goKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFJlc2V0IHRoZSBCdXJzdFxuXHRcdGlmICh0aGlzLmJ1cnN0Q291bnRlciA+PSB0aGlzLmJ1cnN0UmF0ZSkge1xuXHRcdFx0dGhpcy5idXJzdFRpbWVyICs9IGR0O1xuXHRcdFx0aWYgKHRoaXMuYnVyc3RUaW1lciA+PSB0aGlzLmJ1cnN0UGF1c2UpIHtcblx0XHRcdFx0dGhpcy5idXJzdENvdW50ZXIgPSAwO1xuXHRcdFx0XHR0aGlzLmJ1cnN0VGltZXIgPSAwLjA7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8g5aaC5p6c4oCc5aGr5YWF5by56I2v4oCd5oyJ6ZKu6KKr5oyJ5LiL77yM5aGr5YWF5by56I2vXG5cdFx0Ly8gaWYgKElucHV0LkdldEJ1dHRvbkRvd24oXCJSZWxvYWRcIikpXG5cdFx0Ly8gXHR0aGlzLlJlbG9hZCgpO1xuXG5cdFx0Ly8g5aaC5p6c5q2m5Zmo5piv5Y2K6Ieq5Yqo55qE77yM55So5oi35p2+5byA5oyJ6ZKu77yM5bCGY2FuRmlyZeiuvue9ruS4unRydWVcblx0XHRpZiAodGhpcy5wcmVzcylcblx0XHRcdHRoaXMuY2FuRmlyZSA9IHRydWU7XG5cdH1cblxuXHQvLyBQcm9qZWN0aWxlIHN5c3RlbVxuXHRwcml2YXRlIExhdW5jaCgpIHtcblx0XHQvLyDph43nva7lvIDngavorqHml7blmajkuLowKOWvueS6jlJPRilcblx0XHR0aGlzLmZpcmVUaW1lciA9IDAuMDtcblxuXHRcdC8vIOWinuWKoOeqgeWPkeiuoeaVsOWZqFxuXHRcdHRoaXMuYnVyc3RDb3VudGVyKys7XG5cblx0XHQvLyDlpoLmnpzov5nmmK/kuIDnp43ljYroh6rliqjmrablmajvvIzlsIZjYW5GaXJl6K6+572u5Li6ZmFsc2Uo6L+Z5oSP5ZGz552A5Zyo546p5a625p2+5byA5byA54Gr5oyJ6ZKu5LmL5YmN5q2m5Zmo5LiN6IO95YaN5qyh5byA54GrKeOAglxuXHRcdGlmICh0aGlzLmF1dG8gPT0gQXV0by5TZW1pKVxuXHRcdFx0dGhpcy5jYW5GaXJlID0gZmFsc2U7XG5cblx0XHQvLyBGaXJzdCBtYWtlIHN1cmUgdGhlcmUgaXMgYW1tb1xuXHRcdGlmICh0aGlzLmN1cnJlbnRBbW1vIDw9IDApIHtcblx0XHRcdHRoaXMuRHJ5RmlyZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIOavj+asoeWwhOWHu+S7juW9k+WJjeW8ueiNr+S4reWHj+WOuzFcblx0XHRpZiAoIXRoaXMuaW5maW5pdGVBbW1vKVxuXHRcdFx0dGhpcy5jdXJyZW50QW1tby0tO1xuXG5cdFx0Ly8gRmlyZSBvbmNlIGZvciBlYWNoIHNob3RQZXJSb3VuZCB2YWx1ZVxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaG90UGVyUm91bmQ7IGkrKykge1xuXHRcdFx0Ly8g5a6e5L6L5YyW54Ku5by5XG5cdFx0XHRpZiAodGhpcy5wcm9qZWN0aWxlICE9IG51bGwpIHtcblx0XHRcdFx0Y29uc3QgcHJvaiA9IHRoaXMucHJvamVjdGlsZS5pbnN0YW50aWF0ZSgpO1xuXHRcdFx0XHR0aGlzLmVudGl0eS50cmFuc2Zvcm0ucGFyZW50LmVudGl0eS50cmFuc2Zvcm0uYWRkQ2hpbGQocHJvai50cmFuc2Zvcm0pO1xuXHRcdFx0XHRwcm9qLnRyYW5zZm9ybS53b3JsZFBvc2l0aW9uID0gdGhpcy5wcm9qZWN0aWxlU3Bhd25TcG90LndvcmxkUG9zaXRpb247XG5cdFx0XHRcdHByb2oudHJhbnNmb3JtLnF1YXRlcm5pb24gPSB0aGlzLnByb2plY3RpbGVTcGF3blNwb3Qud29ybGRRdWF0ZXJuaW9uO1xuXHRcdFx0XHQvLyDmrablmajok4Tliptcblx0XHRcdFx0aWYgKHRoaXMud2FybXVwKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMubXVsdGlwbHlQb3dlcilcblx0XHRcdFx0XHRcdEV2ZW50Q2VudGVyLmVtaXQoXCJNdWx0aXBseURhbWFnZVwiLCB0aGlzLmhlYXQgKiB0aGlzLnBvd2VyTXVsdGlwbGllcik7XG5cdFx0XHRcdFx0aWYgKHRoaXMubXVsdGlwbHlGb3JjZSlcblx0XHRcdFx0XHRcdEV2ZW50Q2VudGVyLmVtaXQoXCJNdWx0aXBseUluaXRpYWxGb3JjZVwiLCB0aGlzLmhlYXQgKiB0aGlzLmluaXRpYWxGb3JjZU11bHRpcGxpZXIpO1xuXG5cdFx0XHRcdFx0dGhpcy5oZWF0ID0gMC4wO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJQcm9qZWN0aWxlIHRvIGJlIGluc3RhbnRpYXRlZCBpcyBudWxsLiAgTWFrZSBzdXJlIHRvIHNldCB0aGUgUHJvamVjdGlsZSBmaWVsZCBpbiB0aGUgaW5zcGVjdG9yLlwiKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyDlkI7lnZDliptcblx0XHRpZiAodGhpcy5yZWNvaWwpXG5cdFx0XHR0aGlzLlJlY29pbCgpO1xuXG5cdFx0Ly8g5p6q5Y+j6Zeq5YWJ5pWI5p6cXG5cdFx0aWYgKHRoaXMubWFrZU11enpsZUVmZmVjdHMpIHtcblx0XHRcdGNvbnN0IG11emZ4ID0gdGhpcy5tdXp6bGVFZmZlY3RzLmluc3RhbnRpYXRlKCk7XG5cdFx0XHR0aGlzLmVudGl0eS50cmFuc2Zvcm0uY2hpbGRyZW5bM10uZW50aXR5LnRyYW5zZm9ybS5hZGRDaGlsZChtdXpmeC50cmFuc2Zvcm0pO1xuXHRcdFx0bXV6ZngudHJhbnNmb3JtLnBvc2l0aW9uID0gZW5naW5lLlZlY3RvcjMuWkVSTy5jbG9uZSgpO1xuXHRcdH1cblxuXHRcdC8vIOaSreaUvuW8gOeBq+aXtueahOaequWjsFxuXHRcdC8vIEdldENvbXBvbmVudDxBdWRpb1NvdXJjZT4oKS5QbGF5T25lU2hvdChmaXJlU291bmQpO1xuXHR9XG5cblx0Ly8g5b2T5q2m5Zmo6K+V5Zu+5Zyo5rKh5pyJ5Lu75L2V5by56I2v55qE5oOF5Ya15LiL5byA54GrXG5cdHByaXZhdGUgRHJ5RmlyZSgpIHtcblx0XHQvLyBHZXRDb21wb25lbnQ8QXVkaW9Tb3VyY2U+KCkuUGxheU9uZVNob3QoZHJ5RmlyZVNvdW5kKTtcblx0fVxuXG5cdC8vIOW8gOeBq+WQjuW6p+OAgui/meaYr+S9oOWcqOWwhOWHu+aXtueci+WIsOeahOatpuWZqOWQjumAgFxuXHRwcml2YXRlIFJlY29pbCgpIHtcblx0XHQvLyBhaeaXoOWQjuWdkOWKm1xuXHRcdGlmICghdGhpcy5wbGF5ZXJXZWFwb24pXG5cdFx0XHRyZXR1cm47XG5cblx0XHQvLyDnoa7kv53nlKjmiLfmsqHmnInorqnmrablmajmqKHlnovlrZfmrrXnqbrnnYBcblx0XHRpZiAodGhpcy53ZWFwb25Nb2RlbCA9PSBudWxsKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIldlYXBvbiBNb2RlbCBpcyBudWxsLiAgTWFrZSBzdXJlIHRvIHNldCB0aGUgV2VhcG9uIE1vZGVsIGZpZWxkIGluIHRoZSBpbnNwZWN0b3IuXCIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIOiuoeeul+WQjuWdkOS9jee9ruWSjOaXi+i9rOeahOmaj+acuuWAvFxuXHRcdGNvbnN0IGtpY2tCYWNrOiBudW1iZXIgPSB0aGlzLnJhbmRvbSh0aGlzLnJlY29pbEtpY2tCYWNrTWluLCB0aGlzLnJlY29pbEtpY2tCYWNrTWF4KTtcblx0XHRjb25zdCBraWNrUm90OiBudW1iZXIgPSB0aGlzLnJhbmRvbSh0aGlzLnJlY29pbFJvdGF0aW9uTWluLCB0aGlzLnJlY29pbFJvdGF0aW9uTWF4KTtcblxuXHRcdC8vIOWvueatpuWZqOeahOS9jee9ruWSjOaXi+i9rOW6lOeUqOmaj+acuuWAvFxuXHRcdHRoaXMud2VhcG9uTW9kZWwudHJhbnNmb3JtLnBvc2l0aW9uID0gdGhpcy53ZWFwb25Nb2RlbC50cmFuc2Zvcm0ucG9zaXRpb24uYWRkKGVuZ2luZS5WZWN0b3IzLmNyZWF0ZUZyb21OdW1iZXIoMCwgMCwgLWtpY2tCYWNrKSk7XG5cdFx0dGhpcy53ZWFwb25Nb2RlbC50cmFuc2Zvcm0ucm90YXRlKGVuZ2luZS5WZWN0b3IzLmNyZWF0ZUZyb21OdW1iZXIoLWtpY2tSb3QsIDAsIDApLCB0cnVlLCBmYWxzZSk7XG5cdH1cblxuXHQvLyDloavlhYXmrablmajlvLnoja9cblx0cHJpdmF0ZSBSZWxvYWQoKSB7XG5cdFx0dGhpcy5jdXJyZW50QW1tbyA9IHRoaXMuYW1tb0NhcGFjaXR5O1xuXHRcdHRoaXMuZmlyZVRpbWVyID0gLXRoaXMucmVsb2FkVGltZTtcblxuXHRcdC8v5by56I2v5aGr5YWF5pe255qE5aOw6Z+zXG5cdFx0Ly8gR2V0Q29tcG9uZW50PEF1ZGlvU291cmNlPigpLlBsYXlPbmVTaG90KHJlbG9hZFNvdW5kKTsgICAgICAgICAgICBcblxuXHRcdC8vIOWPkemAgeS4gOS4quS6i+S7tua2iOaBr++8jOS7peS+v+eUqOaIt+WPr+S7peWcqOWPkeeUn+i/meenjeaDheWGteaXtuaJp+ihjOWFtuS7luaTjeS9nFxuXHRcdEV2ZW50Q2VudGVyLmVtaXQoXCJPbkVhc3lXZWFwb25zUmVsb2FkXCIpO1xuXHR9XG5cblx0cHJpdmF0ZSByYW5kb20obWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRsZXQgdmFlcjogbnVtYmVyID0gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xuXHRcdHJldHVybiBwYXJzZUZsb2F0KHZhZXIudG9GaXhlZCg1KSlcblx0fVxuXG59Il19
