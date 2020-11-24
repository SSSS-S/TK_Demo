define("assets/Assets/Scripts/BombFragment.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("./eventCenter");
var BombFragment = function (_super) {
    tslib_1.__extends(BombFragment, _super);
    function BombFragment() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.speed = 5.0;
        _this.explosion = null;
        return _this;
    }
    BombFragment_1 = BombFragment;
    BombFragment.prototype.onStart = function () {
        this.entity.getComponent(engine_1.default.Rigidbody).rotationConstraints = new engine_1.default.BooleanVector3(true, true, true);
        this.entity.transform.rotate(engine_1.default.Vector3.createFromNumber(this.random(-180, 180), this.random(-180, 180), this.random(-180, 180)));
    };
    BombFragment.prototype.onUpdate = function (dt) {
        this.entity.transform.position = this.entity.transform.position.add(engine_1.default.Vector3.createFromNumber(0, 0, this.speed * dt));
    };
    BombFragment.prototype.onCollisionEnter = function (col) {
        if (col.collider.entity.getComponent(BombFragment_1) == null) {
            this.Explode(col.contacts[0].point.clone());
        }
    };
    BombFragment.prototype.Explode = function (position) {
        if (this.explosion != null) {
            var exp = this.explosion.instantiate();
            exp.transform.worldPosition = position;
            eventCenter_1.dateCenter.SceneNode.transform.addChild(exp.transform);
        }
        var self = this;
        var timeout = function timeout() {
            self.entity.destroy();
        };
        setTimeout(timeout, 20);
    };
    BombFragment.prototype.random = function (min, max) {
        var vaer = Math.random() * (max - min) + min;
        return parseFloat(vaer.toFixed(2));
    };
    var BombFragment_1;
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], BombFragment.prototype, "speed", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: engine_1.default.Prefab
    })], BombFragment.prototype, "explosion", void 0);
    BombFragment = BombFragment_1 = tslib_1.__decorate([engine_1.default.decorators.serialize("BombFragment")], BombFragment);
    return BombFragment;
}(engine_1.default.Script);
exports.default = BombFragment;
// none
});
define("assets/Assets/Scripts/ButtMove.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("./eventCenter");
var SCREEN_WIDTH = engine_1.default.device.screenWidth;
var SCREEN_HEIGHT = engine_1.default.device.screenHeight;
var GAME_WIDTH = engine_1.default.adaptation.frameWidth;
var GAME_HEIGHT = engine_1.default.adaptation.frameHeight;
var ButtMove = function (_super) {
    tslib_1.__extends(ButtMove, _super);
    function ButtMove(entity) {
        var _this = _super.call(this, entity) || this;
        _this.entity = entity;
        _this.buttonPos = engine_1.default.Vector2.ZERO.clone();
        _this.buttonRadius = { x: 0, y: 0 };
        _this.direction = engine_1.default.Vector2.ZERO.clone();
        _this.uisprite = null;
        _this.uiInput = null;
        _this.onTouchStart = _this.onTouchStart.bind(_this);
        _this.onTouchEnter = _this.onTouchEnter.bind(_this);
        _this.onTouchMove = _this.onTouchMove.bind(_this);
        _this.onTouchEnd = _this.onTouchEnd.bind(_this);
        _this.onTouchLeave = _this.onTouchLeave.bind(_this);
        return _this;
    }
    ButtMove.prototype.onAwake = function () {
        this.uisprite = this.entity.getComponent(engine_1.default.UISprite);
        this.buttonPos = this.entity.transform2D.worldPosition.clone();
        this.buttonRadius = { x: this.entity.transform2D.size.x / 2, y: this.entity.transform2D.size.y / 2 };
    };
    ButtMove.prototype.onEnable = function () {
        this.uiInput = this.getComponent(engine_1.default.TouchInputComponent);
        if (this.uiInput) {
            this.uiInput.onTouchStart.add(this.onTouchStart);
            this.uiInput.onTouchEnter.add(this.onTouchEnter);
            this.uiInput.onTouchEnd.add(this.onTouchEnd);
            this.uiInput.onTouchLeave.add(this.onTouchLeave);
            this.uiInput.onTouchMove.add(this.onTouchMove);
        }
    };
    ButtMove.prototype.onDisable = function () {
        if (this.uiInput) {
            this.uiInput.onTouchStart.remove(this.onTouchStart);
            this.uiInput.onTouchEnter.remove(this.onTouchEnter);
            this.uiInput.onTouchEnd.remove(this.onTouchEnd);
            this.uiInput.onTouchLeave.remove(this.onTouchLeave);
            this.uiInput.onTouchMove.remove(this.onTouchMove);
        }
    };
    ButtMove.prototype.onTouchStart = function (s, e) {
        this.setAlpha(200);
        this.handleTouch(e);
    };
    ButtMove.prototype.onTouchEnter = function (s, e) {
        this.setAlpha(200);
        this.handleTouch(e);
    };
    ButtMove.prototype.onTouchMove = function (s, e) {
        this.handleTouch(e);
    };
    ButtMove.prototype.onTouchLeave = function (s, e) {
        this.setAlpha(255);
        this.emitDirection({ x: 0, y: 0, z: 0 });
    };
    ButtMove.prototype.onTouchEnd = function (s, e) {
        this.setAlpha(255);
        this.emitDirection({ x: 0, y: 0, z: 0 });
    };
    ButtMove.prototype.handleTouch = function (e) {
        this.direction.x = e.touches[0].position.x / this.buttonRadius.x;
        this.direction.y = e.touches[0].position.y / this.buttonRadius.y;
        this.emitDirection({ x: this.direction.x, y: 0, z: -this.direction.y });
    };
    ButtMove.prototype.setAlpha = function (val) {
        var c = this.uisprite.color.clone();
        c.a = val;
        this.uisprite.color = c;
    };
    ButtMove.prototype.emitDirection = function (direction) {
        eventCenter_1.default.emit(eventCenter_1.default.TOUCH_MOVE, direction);
    };
    ButtMove = tslib_1.__decorate([engine_1.default.decorators.serialize("ButtMove")], ButtMove);
    return ButtMove;
}(engine_1.default.Script);
exports.default = ButtMove;
// none
});
define("assets/Assets/Scripts/ButtShoot.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("./eventCenter");
var ButtShoot = function (_super) {
    tslib_1.__extends(ButtShoot, _super);
    function ButtShoot(entity) {
        var _this = _super.call(this, entity) || this;
        _this.entity = entity;
        _this.uisprite = null;
        _this.uiInput = null;
        _this.onTouchStart = _this.onTouchStart.bind(_this);
        _this.onTouchEnter = _this.onTouchEnter.bind(_this);
        _this.onTouchEnd = _this.onTouchEnd.bind(_this);
        _this.onTouchLeave = _this.onTouchLeave.bind(_this);
        return _this;
    }
    ButtShoot.prototype.onAwake = function () {
        this.uisprite = this.entity.getComponent(engine_1.default.UISprite);
    };
    ButtShoot.prototype.onEnable = function () {
        this.uiInput = this.getComponent(engine_1.default.TouchInputComponent);
        if (this.uiInput) {
            this.uiInput.onTouchStart.add(this.onTouchStart);
            this.uiInput.onTouchEnter.add(this.onTouchEnter);
            this.uiInput.onTouchEnd.add(this.onTouchEnd);
            this.uiInput.onTouchLeave.add(this.onTouchLeave);
        }
    };
    ButtShoot.prototype.onDisable = function () {
        if (this.uiInput) {
            this.uiInput.onTouchStart.remove(this.onTouchStart);
            this.uiInput.onTouchEnter.remove(this.onTouchEnter);
            this.uiInput.onTouchEnd.remove(this.onTouchEnd);
            this.uiInput.onTouchLeave.remove(this.onTouchLeave);
        }
    };
    ButtShoot.prototype.onTouchStart = function (s, e) {
        var c = this.uisprite.color.clone();
        c.a = 200;
        this.uisprite.color = c;
        eventCenter_1.default.emit(eventCenter_1.default.START_SHOOT);
    };
    ButtShoot.prototype.onTouchEnter = function (s, e) {
        var c = this.uisprite.color.clone();
        c.a = 200;
        this.uisprite.color = c;
        eventCenter_1.default.emit(eventCenter_1.default.START_SHOOT);
    };
    ButtShoot.prototype.onTouchEnd = function (s, e) {
        var c = this.uisprite.color.clone();
        c.a = 255;
        this.uisprite.color = c;
        eventCenter_1.default.emit(eventCenter_1.default.END_SHOOT);
    };
    ButtShoot.prototype.onTouchLeave = function (s, e) {
        var c = this.uisprite.color.clone();
        c.a = 255;
        this.uisprite.color = c;
        eventCenter_1.default.emit(eventCenter_1.default.END_SHOOT);
    };
    ButtShoot = tslib_1.__decorate([engine_1.default.decorators.serialize("ButtShoot")], ButtShoot);
    return ButtShoot;
}(engine_1.default.Script);
exports.default = ButtShoot;
// none
});
define("assets/Assets/Scripts/eventCenter.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var eventemitter3_1 = require("eventemitter3");
var EventEmitterCenter = function (_super) {
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
}(eventemitter3_1.EventEmitter);
exports.EventCenter = new EventEmitterCenter();
exports.default = exports.EventCenter;
var dateCenter = function () {
    function dateCenter() {}
    dateCenter.SceneNode = null;
    return dateCenter;
}();
exports.dateCenter = dateCenter;
// none
});
define("assets/Assets/Scripts/Explosion.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("./eventCenter");
var Health_1 = require("./Health");
var Explosion = function (_super) {
    tslib_1.__extends(Explosion, _super);
    function Explosion() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shooterAISupport = false;
        _this.explosionForce = 5.0;
        _this.explosionRadius = 10.0;
        _this.shakeCamera = true;
        _this.cameraShakeViolence = 0.5;
        _this.causeDamage = true;
        _this.damage = 10.0;
        return _this;
    }
    Explosion_1 = Explosion;
    Explosion.prototype.onStart = function () {
        var _this = this;
        var timeout = setTimeout(function () {
            var cols = _this.OverlapSphere(_this.entity.transform.worldPosition, _this.explosionRadius);
            if (_this.causeDamage) {
                for (var _i = 0, cols_1 = cols; _i < cols_1.length; _i++) {
                    var col = cols_1[_i];
                    var damageAmount = _this.damage * (1 / _this.entity.transform.worldPosition.distanceTo(col.entity.transform.worldPosition));
                    if (col.entity.getComponent(Health_1.default) != null) {
                        var health = col.entity.getComponent(Health_1.default);
                        health.ChangeHealth(damageAmount);
                    }
                }
            }
            var rigidbodies = new Array();
            for (var _a = 0, cols_2 = cols; _a < cols_2.length; _a++) {
                var col = cols_2[_a];
                if (col.attachedRigidbody != null && rigidbodies.indexOf(col.attachedRigidbody) == -1) {
                    rigidbodies.push(col.attachedRigidbody);
                }
            }
            for (var _b = 0, rigidbodies_1 = rigidbodies; _b < rigidbodies_1.length; _b++) {
                var rb = rigidbodies_1[_b];
                rb.AddExplosionForce(_this.explosionForce, _this.entity.transform.worldPosition, _this.explosionRadius, 1, engine_1.default.ForceMode.Impulse);
            }
            clearTimeout(timeout);
        }, 100);
    };
    Explosion.prototype.OverlapSphere = function (position, radius) {
        var OverlapSpheres = [];
        Explosion_1.Search(eventCenter_1.dateCenter.SceneNode);
        for (var _i = 0, _a = Explosion_1.ColliderArry; _i < _a.length; _i++) {
            var iterator = _a[_i];
            var distance = position.distanceTo(iterator.transform.worldPosition);
            if (distance <= radius) {
                OverlapSpheres.push(iterator.getComponent(engine_1.default.Collider));
            }
        }
        Explosion_1.ColliderArry.splice(0, Explosion_1.ColliderArry.length);
        return OverlapSpheres;
    };
    Explosion.Search = function (targetNode) {
        if (targetNode.getComponent(engine_1.default.Collider) != null) {
            this.ColliderArry.push(targetNode);
        }
        for (var i = 0; i < targetNode.transform.children.length; i++) {
            var child = targetNode.transform.children[i];
            var result = this.Search(child.entity);
            if (result != null) {
                this.ColliderArry.push(result);
            }
        }
        return null;
    };
    var Explosion_1;
    Explosion.ColliderArry = [];
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'boolean'
    })], Explosion.prototype, "shooterAISupport", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], Explosion.prototype, "explosionForce", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], Explosion.prototype, "explosionRadius", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'boolean'
    })], Explosion.prototype, "shakeCamera", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], Explosion.prototype, "cameraShakeViolence", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'boolean'
    })], Explosion.prototype, "causeDamage", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], Explosion.prototype, "damage", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: engine_1.default.Prefab
    })], Explosion.prototype, "PHY", void 0);
    Explosion = Explosion_1 = tslib_1.__decorate([engine_1.default.decorators.serialize("Explosion")], Explosion);
    return Explosion;
}(engine_1.default.Script);
exports.default = Explosion;
// none
});
define("assets/Assets/Scripts/Health.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("./eventCenter");
var Health = function (_super) {
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
    Health.prototype.onAwake = function () {};
    Health.prototype.ChangeHealth = function (amount) {
        this.currentHealth -= amount;
        if (this.currentHealth <= 0 && !this.dead && this.canDie) this.Die();else if (this.currentHealth > this.maxHealth) this.currentHealth = this.maxHealth;
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
        if (this.isPlayer && this.deathCam != null) this.deathCam.active = true;
        var self = this;
        var timeout = function timeout() {
            self.entity.destroy();
        };
        setTimeout(timeout, 20);
    };
    Health.prototype.onStart = function () {
        this.currentHealth = this.startingHealth;
    };
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'boolean'
    })], Health.prototype, "canDie", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], Health.prototype, "startingHealth", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], Health.prototype, "maxHealth", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'boolean'
    })], Health.prototype, "replaceWhenDead", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: engine_1.default.Prefab
    })], Health.prototype, "deadReplacement", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'boolean'
    })], Health.prototype, "makeExplosion", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: engine_1.default.Prefab
    })], Health.prototype, "explosion", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'boolean'
    })], Health.prototype, "isPlayer", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: engine_1.default.Transform3D
    })], Health.prototype, "deathCam", void 0);
    Health = tslib_1.__decorate([engine_1.default.decorators.serialize("Health")], Health);
    return Health;
}(engine_1.default.Script);
exports.default = Health;
// none
});
define("assets/Assets/Scripts/LoadScene.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var LoadScene = function (_super) {
    tslib_1.__extends(LoadScene, _super);
    function LoadScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoadScene.prototype.onStart = function () {
        var self = this;
        setTimeout(function () {
            engine_1.default.loader.load("resource/newdemo3d.scene", { useFrameSystem: false }).promise.then(function (scene) {
                engine_1.default.game.playScene(scene);
                self.entity.transform2D.parent.entity.transform2D.children[1].active = true;
                self.entity.transform2D.parent.entity.transform2D.children[2].active = true;
                self.entity.transform2D.parent.entity.transform2D.children[3].active = true;
                self.entity.active = false;
            }).catch(function (error) {
                console.error('Fail to load scenes.', error.message, error.stack);
            });
        }, 3000);
    };
    LoadScene = tslib_1.__decorate([engine_1.default.decorators.serialize("LoadScene")], LoadScene);
    return LoadScene;
}(engine_1.default.Script);
exports.default = LoadScene;
// none
});
define("assets/Assets/Scripts/PlayerMove.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("./eventCenter");
var PlayerMove = function (_super) {
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
            } else {
                _this.m_MoveValue = -1;
            }
            if (Math.abs(direction.x) < 0.1) {
                _this.m_TurnValue = 0;
            } else {
                _this.m_TurnValue = direction.x * 100;
            }
            if (direction.z > 0) {
                if (_this.m_TurnValue < 0) {
                    _this.m_TurnValue = -180 - _this.m_TurnValue;
                } else if (_this.m_TurnValue > 0) {
                    _this.m_TurnValue = 180 - _this.m_TurnValue;
                } else if (_this.m_TurnValue == 0) {
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
    PlayerMove = tslib_1.__decorate([engine_1.default.decorators.serialize("PlayerMove")], PlayerMove);
    return PlayerMove;
}(engine_1.default.Script);
exports.default = PlayerMove;
// none
});
define("assets/Assets/Scripts/Projectile.js", function(require, module, exports, process){ 
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
var Projectile = function (_super) {
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
        var timeout = function timeout() {
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
    tslib_1.__decorate([engine_1.default.decorators.property.enum({
        type: { 'Standard': 0, 'Seeker': 1, 'ClusterBomb': 2 },
        tooltips: '射弹类型'
    })], Projectile.prototype, "projectileType", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property.enum({
        type: { 'Direct': 0, 'Explosion': 1 },
        tooltips: '伤害类型'
    })], Projectile.prototype, "damageType", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number',
        tooltips: '伤害值'
    })], Projectile.prototype, "damage", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number',
        tooltips: '炮弹移动速度'
    })], Projectile.prototype, "speed", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], Projectile.prototype, "initialForce", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], Projectile.prototype, "lifetime", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], Projectile.prototype, "seekRate", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'string'
    })], Projectile.prototype, "seekName", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: engine_1.default.Prefab
    })], Projectile.prototype, "explosion", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], Projectile.prototype, "targetListUpdateRate", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: engine_1.default.Prefab
    })], Projectile.prototype, "clusterBomb", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], Projectile.prototype, "clusterBombNum", void 0);
    Projectile = tslib_1.__decorate([engine_1.default.decorators.serialize("Projectile")], Projectile);
    return Projectile;
}(engine_1.default.Script);
exports.default = Projectile;
// none
});
define("assets/Assets/Scripts/TimedObjectDestroyer.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var TimedObjectDestroyer = function (_super) {
    tslib_1.__extends(TimedObjectDestroyer, _super);
    function TimedObjectDestroyer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lifeTime = 10.0;
        return _this;
    }
    TimedObjectDestroyer.prototype.onStart = function () {
        var _this = this;
        var timeout = setTimeout(function () {
            _this.entity.destroy();
            clearTimeout(timeout);
        }, this.lifeTime * 1000);
    };
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'number'
    })], TimedObjectDestroyer.prototype, "lifeTime", void 0);
    TimedObjectDestroyer = tslib_1.__decorate([engine_1.default.decorators.serialize("TimedObjectDestroyer")], TimedObjectDestroyer);
    return TimedObjectDestroyer;
}(engine_1.default.Script);
exports.default = TimedObjectDestroyer;
// none
});
define("assets/Assets/Scripts/Weapon.js", function(require, module, exports, process){ 
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
var Weapon = function (_super) {
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
        if (this.rateOfFire != 0) this.actualROF = 1.0 / this.rateOfFire;else this.actualROF = 0.01;
        this.fireTimer = 0.0;
        this.currentAmmo = this.ammoCapacity;
        if (this.muzzleEffectsPosition == null) this.muzzleEffectsPosition = this.entity.transform.children[3].entity.transform;
        if (this.projectileSpawnSpot == null) this.projectileSpawnSpot = this.entity.transform.children[3].entity.transform;
        this.weaponModel = this.weaponModels.entity;
        if (this.weaponModels == null) this.weaponModel = this.entity.transform.children[0].entity;
        this.originalPoint = engine_1.default.Vector3.createFromNumber(0, 0, 0);
        this.originalQua = engine_1.default.Quaternion.createFromNumber(0, 0, 0, 1);
    };
    Weapon.prototype.initEvent = function () {
        var _this = this;
        eventCenter_1.default.on(eventCenter_1.default.HURT_PLAYER, function () {});
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
        if (this.reloadAutomatically && this.currentAmmo <= 0) this.Reload();
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
                    } else if (this.heat < this.maxWarmup) {
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
        if (this.press) this.canFire = true;
    };
    Weapon.prototype.Launch = function () {
        this.fireTimer = 0.0;
        this.burstCounter++;
        if (this.auto == Auto.Semi) this.canFire = false;
        if (this.currentAmmo <= 0) {
            this.DryFire();
            return;
        }
        if (!this.infiniteAmmo) this.currentAmmo--;
        for (var i = 0; i < this.shotPerRound; i++) {
            if (this.projectile != null) {
                var proj = this.projectile.instantiate();
                this.entity.transform.parent.entity.transform.addChild(proj.transform);
                proj.transform.worldPosition = this.projectileSpawnSpot.worldPosition;
                proj.transform.quaternion = this.projectileSpawnSpot.worldQuaternion;
                if (this.warmup) {
                    if (this.multiplyPower) eventCenter_1.default.emit("MultiplyDamage", this.heat * this.powerMultiplier);
                    if (this.multiplyForce) eventCenter_1.default.emit("MultiplyInitialForce", this.heat * this.initialForceMultiplier);
                    this.heat = 0.0;
                }
            } else {
                console.log("Projectile to be instantiated is null.  Make sure to set the Projectile field in the inspector.");
            }
        }
        if (this.recoil) this.Recoil();
        if (this.makeMuzzleEffects) {
            var muzfx = this.muzzleEffects.instantiate();
            this.entity.transform.children[3].entity.transform.addChild(muzfx.transform);
            muzfx.transform.position = engine_1.default.Vector3.ZERO.clone();
        }
    };
    Weapon.prototype.DryFire = function () {};
    Weapon.prototype.Recoil = function () {
        if (!this.playerWeapon) return;
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
    tslib_1.__decorate([engine_1.default.decorators.property.enum({
        type: { 'Projectile': 0, 'Raycast': 1, 'Beam': 2 },
        tooltips: '武器类型'
    })], Weapon.prototype, "type", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property.enum({
        type: { 'Full': 0, 'Semi': 1 },
        tooltips: '半自动和全自动'
    })], Weapon.prototype, "auto", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'boolean',
        tooltips: '是否玩家'
    })], Weapon.prototype, "playerWeapon", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: engine_1.default.Transform3D,
        tooltips: '武器模型的实体'
    })], Weapon.prototype, "weaponModels", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: engine_1.default.Prefab
    })], Weapon.prototype, "projectile", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: engine_1.default.Transform3D
    })], Weapon.prototype, "projectileSpawnSpot", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: 'boolean',
        tooltips: '是否无限弹药'
    })], Weapon.prototype, "infiniteAmmo", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: engine_1.default.Prefab
    })], Weapon.prototype, "muzzleEffects", void 0);
    tslib_1.__decorate([engine_1.default.decorators.property({
        type: engine_1.default.Transform3D,
        tooltips: '枪口效果位置'
    })], Weapon.prototype, "muzzleEffectsPosition", void 0);
    Weapon = tslib_1.__decorate([engine_1.default.decorators.serialize("Weapon")], Weapon);
    return Weapon;
}(engine_1.default.Script);
exports.default = Weapon;
// none
});
define("assets/miniprogram_npm/engine/index.js", function(require, module, exports, process){ 
"use strict";

var engine = GameGlobal.engine;
module.exports = engine;
// none
});
define("assets/miniprogram_npm/eventemitter3/index.js", function(require, module, exports, process){ 
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function () {
  var __MODS__ = {};
  var __DEFINE__ = function __DEFINE__(modId, func, req) {
    var m = { exports: {}, _tempexports: {} };__MODS__[modId] = { status: 0, func: func, req: req, m: m };
  };
  var __REQUIRE__ = function __REQUIRE__(modId, source) {
    if (!__MODS__[modId]) return require(source);if (!__MODS__[modId].status) {
      var m = __MODS__[modId].m;m._exports = m._tempexports;var desp = Object.getOwnPropertyDescriptor(m, "exports");if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function set(val) {
          if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === "object" && val !== m._exports) {
            m._exports.__proto__ = val.__proto__;Object.keys(val).forEach(function (k) {
              m._exports[k] = val[k];
            });
          }m._tempexports = val;
        }, get: function get() {
          return m._tempexports;
        } });__MODS__[modId].status = 1;__MODS__[modId].func(__MODS__[modId].req, m, m.exports);
    }return __MODS__[modId].m.exports;
  };
  var __REQUIRE_WILDCARD__ = function __REQUIRE_WILDCARD__(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};if (obj != null) {
        for (var k in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k];
        }
      }newObj.default = obj;return newObj;
    }
  };
  var __REQUIRE_DEFAULT__ = function __REQUIRE_DEFAULT__(obj) {
    return obj && obj.__esModule ? obj.default : obj;
  };
  __DEFINE__(1605867079978, function (require, module, exports) {

    var has = Object.prototype.hasOwnProperty,
        prefix = '~';

    /**
     * Constructor to create a storage for our `EE` objects.
     * An `Events` instance is a plain object whose properties are event names.
     *
     * @constructor
     * @private
     */
    function Events() {}

    //
    // We try to not inherit from `Object.prototype`. In some engines creating an
    // instance in this way is faster than calling `Object.create(null)` directly.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // character to make sure that the built-in object properties are not
    // overridden or used as an attack vector.
    //
    if (Object.create) {
      Events.prototype = Object.create(null);

      //
      // This hack is needed because the `__proto__` property is still inherited in
      // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
      //
      if (!new Events().__proto__) prefix = false;
    }

    /**
     * Representation of a single event listener.
     *
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     * @constructor
     * @private
     */
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }

    /**
     * Add a listener for a given event.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} once Specify if the listener is a one-time listener.
     * @returns {EventEmitter}
     * @private
     */
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
      }

      var listener = new EE(fn, context || emitter, once),
          evt = prefix ? prefix + event : event;

      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);else emitter._events[evt] = [emitter._events[evt], listener];

      return emitter;
    }

    /**
     * Clear event by name.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} evt The Event name.
     * @private
     */
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();else delete emitter._events[evt];
    }

    /**
     * Minimal `EventEmitter` interface that is molded against the Node.js
     * `EventEmitter` interface.
     *
     * @constructor
     * @public
     */
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }

    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     *
     * @returns {Array}
     * @public
     */
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = [],
          events,
          name;

      if (this._eventsCount === 0) return names;

      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }

      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }

      return names;
    };

    /**
     * Return the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Array} The registered listeners.
     * @public
     */
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event,
          handlers = this._events[evt];

      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];

      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }

      return ee;
    };

    /**
     * Return the number of listeners listening to a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Number} The number of listeners.
     * @public
     */
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event,
          listeners = this._events[evt];

      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };

    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Boolean} `true` if the event had listeners, else `false`.
     * @public
     */
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return false;

      var listeners = this._events[evt],
          len = arguments.length,
          args,
          i;

      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }

        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }

        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length,
            j;

        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }

              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }

      return true;
    };

    /**
     * Add a listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };

    /**
     * Add a one-time listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };

    /**
     * Remove the listeners of a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn Only remove the listeners that match this function.
     * @param {*} context Only remove the listeners that have this context.
     * @param {Boolean} once Only remove one-time listeners.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }

      var listeners = this._events[evt];

      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }

        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;else clearEvent(this, evt);
      }

      return this;
    };

    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {(String|Symbol)} [event] The event name.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;

      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }

      return this;
    };

    //
    // Alias methods names because people roll like that.
    //
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    //
    // Expose the prefix.
    //
    EventEmitter.prefixed = prefix;

    //
    // Allow `EventEmitter` to be imported as module namespace.
    //
    EventEmitter.EventEmitter = EventEmitter;

    //
    // Expose the module.
    //
    if ('undefined' !== typeof module) {
      module.exports = EventEmitter;
    }
  }, function (modId) {
    var map = {};return __REQUIRE__(map[modId], modId);
  });
  return __REQUIRE__(1605867079978);
}();
// none
// none
});
define("assets/miniprogram_npm/tslib/index.js", function(require, module, exports, process){ 
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function () {
    var __MODS__ = {};
    var __DEFINE__ = function __DEFINE__(modId, func, req) {
        var m = { exports: {}, _tempexports: {} };__MODS__[modId] = { status: 0, func: func, req: req, m: m };
    };
    var __REQUIRE__ = function __REQUIRE__(modId, source) {
        if (!__MODS__[modId]) return require(source);if (!__MODS__[modId].status) {
            var m = __MODS__[modId].m;m._exports = m._tempexports;var desp = Object.getOwnPropertyDescriptor(m, "exports");if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function set(val) {
                    if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === "object" && val !== m._exports) {
                        m._exports.__proto__ = val.__proto__;Object.keys(val).forEach(function (k) {
                            m._exports[k] = val[k];
                        });
                    }m._tempexports = val;
                }, get: function get() {
                    return m._tempexports;
                } });__MODS__[modId].status = 1;__MODS__[modId].func(__MODS__[modId].req, m, m.exports);
        }return __MODS__[modId].m.exports;
    };
    var __REQUIRE_WILDCARD__ = function __REQUIRE_WILDCARD__(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};if (obj != null) {
                for (var k in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k];
                }
            }newObj.default = obj;return newObj;
        }
    };
    var __REQUIRE_DEFAULT__ = function __REQUIRE_DEFAULT__(obj) {
        return obj && obj.__esModule ? obj.default : obj;
    };
    __DEFINE__(1605867079979, function (require, module, exports) {
        /*! *****************************************************************************
        Copyright (c) Microsoft Corporation. All rights reserved.
        Licensed under the Apache License, Version 2.0 (the "License"); you may not use
        this file except in compliance with the License. You may obtain a copy of the
        License at http://www.apache.org/licenses/LICENSE-2.0
        
        THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
        KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
        WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
        MERCHANTABLITY OR NON-INFRINGEMENT.
        
        See the Apache Version 2.0 License for specific language governing permissions
        and limitations under the License.
        ***************************************************************************** */
        /* global global, define, System, Reflect, Promise */
        var __extends;
        var __assign;
        var __rest;
        var __decorate;
        var __param;
        var __metadata;
        var __awaiter;
        var __generator;
        var __exportStar;
        var __values;
        var __read;
        var __spread;
        var __spreadArrays;
        var _await;
        var __asyncGenerator;
        var __asyncDelegator;
        var __asyncValues;
        var __makeTemplateObject;
        var __importStar;
        var __importDefault;
        var __classPrivateFieldGet;
        var __classPrivateFieldSet;
        (function (factory) {
            var root = (typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" ? global : (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" ? self : _typeof(this) === "object" ? this : {};
            if (typeof define === "function" && define.amd) {
                define("tslib", ["exports"], function (exports) {
                    factory(createExporter(root, createExporter(exports)));
                });
            } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
                factory(createExporter(root, createExporter(module.exports)));
            } else {
                factory(createExporter(root));
            }
            function createExporter(exports, previous) {
                if (exports !== root) {
                    if (typeof Object.create === "function") {
                        Object.defineProperty(exports, "__esModule", { value: true });
                    } else {
                        exports.__esModule = true;
                    }
                }
                return function (id, v) {
                    return exports[id] = previous ? previous(id, v) : v;
                };
            }
        })(function (exporter) {
            var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) {
                    if (b.hasOwnProperty(p)) d[p] = b[p];
                }
            };

            __extends = function __extends(d, b) {
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };

            __assign = Object.assign || function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) {
                        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                    }
                }
                return t;
            };

            __rest = function __rest(s, e) {
                var t = {};
                for (var p in s) {
                    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
                }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
                }
                return t;
            };

            __decorate = function __decorate(decorators, target, key, desc) {
                var c = arguments.length,
                    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
                    d;
                if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
                    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
                }return c > 3 && r && Object.defineProperty(target, key, r), r;
            };

            __param = function __param(paramIndex, decorator) {
                return function (target, key) {
                    decorator(target, key, paramIndex);
                };
            };

            __metadata = function __metadata(metadataKey, metadataValue) {
                if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
            };

            __awaiter = function __awaiter(thisArg, _arguments, P, generator) {
                function adopt(value) {
                    return value instanceof P ? value : new P(function (resolve) {
                        resolve(value);
                    });
                }
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) {
                        try {
                            step(generator.next(value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function rejected(value) {
                        try {
                            step(generator["throw"](value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function step(result) {
                        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
                    }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            };

            __generator = function __generator(thisArg, body) {
                var _ = { label: 0, sent: function sent() {
                        if (t[0] & 1) throw t[1];return t[1];
                    }, trys: [], ops: [] },
                    f,
                    y,
                    t,
                    g;
                return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
                    return this;
                }), g;
                function verb(n) {
                    return function (v) {
                        return step([n, v]);
                    };
                }
                function step(op) {
                    if (f) throw new TypeError("Generator is already executing.");
                    while (_) {
                        try {
                            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                            if (y = 0, t) op = [op[0] & 2, t.value];
                            switch (op[0]) {
                                case 0:case 1:
                                    t = op;break;
                                case 4:
                                    _.label++;return { value: op[1], done: false };
                                case 5:
                                    _.label++;y = op[1];op = [0];continue;
                                case 7:
                                    op = _.ops.pop();_.trys.pop();continue;
                                default:
                                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                        _ = 0;continue;
                                    }
                                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                                        _.label = op[1];break;
                                    }
                                    if (op[0] === 6 && _.label < t[1]) {
                                        _.label = t[1];t = op;break;
                                    }
                                    if (t && _.label < t[2]) {
                                        _.label = t[2];_.ops.push(op);break;
                                    }
                                    if (t[2]) _.ops.pop();
                                    _.trys.pop();continue;
                            }
                            op = body.call(thisArg, _);
                        } catch (e) {
                            op = [6, e];y = 0;
                        } finally {
                            f = t = 0;
                        }
                    }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
                }
            };

            __exportStar = function __exportStar(m, exports) {
                for (var p in m) {
                    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
                }
            };

            __values = function __values(o) {
                var s = typeof Symbol === "function" && Symbol.iterator,
                    m = s && o[s],
                    i = 0;
                if (m) return m.call(o);
                if (o && typeof o.length === "number") return {
                    next: function next() {
                        if (o && i >= o.length) o = void 0;
                        return { value: o && o[i++], done: !o };
                    }
                };
                throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
            };

            __read = function __read(o, n) {
                var m = typeof Symbol === "function" && o[Symbol.iterator];
                if (!m) return o;
                var i = m.call(o),
                    r,
                    ar = [],
                    e;
                try {
                    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
                        ar.push(r.value);
                    }
                } catch (error) {
                    e = { error: error };
                } finally {
                    try {
                        if (r && !r.done && (m = i["return"])) m.call(i);
                    } finally {
                        if (e) throw e.error;
                    }
                }
                return ar;
            };

            __spread = function __spread() {
                for (var ar = [], i = 0; i < arguments.length; i++) {
                    ar = ar.concat(__read(arguments[i]));
                }return ar;
            };

            __spreadArrays = function __spreadArrays() {
                for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
                    s += arguments[i].length;
                }for (var r = Array(s), k = 0, i = 0; i < il; i++) {
                    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
                        r[k] = a[j];
                    }
                }return r;
            };

            _await = function __await(v) {
                return this instanceof _await ? (this.v = v, this) : new _await(v);
            };

            __asyncGenerator = function __asyncGenerator(thisArg, _arguments, generator) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var g = generator.apply(thisArg, _arguments || []),
                    i,
                    q = [];
                return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
                    return this;
                }, i;
                function verb(n) {
                    if (g[n]) i[n] = function (v) {
                        return new Promise(function (a, b) {
                            q.push([n, v, a, b]) > 1 || resume(n, v);
                        });
                    };
                }
                function resume(n, v) {
                    try {
                        step(g[n](v));
                    } catch (e) {
                        settle(q[0][3], e);
                    }
                }
                function step(r) {
                    r.value instanceof _await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
                }
                function fulfill(value) {
                    resume("next", value);
                }
                function reject(value) {
                    resume("throw", value);
                }
                function settle(f, v) {
                    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
                }
            };

            __asyncDelegator = function __asyncDelegator(o) {
                var i, p;
                return i = {}, verb("next"), verb("throw", function (e) {
                    throw e;
                }), verb("return"), i[Symbol.iterator] = function () {
                    return this;
                }, i;
                function verb(n, f) {
                    i[n] = o[n] ? function (v) {
                        return (p = !p) ? { value: _await(o[n](v)), done: n === "return" } : f ? f(v) : v;
                    } : f;
                }
            };

            __asyncValues = function __asyncValues(o) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var m = o[Symbol.asyncIterator],
                    i;
                return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
                    return this;
                }, i);
                function verb(n) {
                    i[n] = o[n] && function (v) {
                        return new Promise(function (resolve, reject) {
                            v = o[n](v), settle(resolve, reject, v.done, v.value);
                        });
                    };
                }
                function settle(resolve, reject, d, v) {
                    Promise.resolve(v).then(function (v) {
                        resolve({ value: v, done: d });
                    }, reject);
                }
            };

            __makeTemplateObject = function __makeTemplateObject(cooked, raw) {
                if (Object.defineProperty) {
                    Object.defineProperty(cooked, "raw", { value: raw });
                } else {
                    cooked.raw = raw;
                }
                return cooked;
            };

            __importStar = function __importStar(mod) {
                if (mod && mod.__esModule) return mod;
                var result = {};
                if (mod != null) for (var k in mod) {
                    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
                }result["default"] = mod;
                return result;
            };

            __importDefault = function __importDefault(mod) {
                return mod && mod.__esModule ? mod : { "default": mod };
            };

            __classPrivateFieldGet = function __classPrivateFieldGet(receiver, privateMap) {
                if (!privateMap.has(receiver)) {
                    throw new TypeError("attempted to get private field on non-instance");
                }
                return privateMap.get(receiver);
            };

            __classPrivateFieldSet = function __classPrivateFieldSet(receiver, privateMap, value) {
                if (!privateMap.has(receiver)) {
                    throw new TypeError("attempted to set private field on non-instance");
                }
                privateMap.set(receiver, value);
                return value;
            };

            exporter("__extends", __extends);
            exporter("__assign", __assign);
            exporter("__rest", __rest);
            exporter("__decorate", __decorate);
            exporter("__param", __param);
            exporter("__metadata", __metadata);
            exporter("__awaiter", __awaiter);
            exporter("__generator", __generator);
            exporter("__exportStar", __exportStar);
            exporter("__values", __values);
            exporter("__read", __read);
            exporter("__spread", __spread);
            exporter("__spreadArrays", __spreadArrays);
            exporter("__await", _await);
            exporter("__asyncGenerator", __asyncGenerator);
            exporter("__asyncDelegator", __asyncDelegator);
            exporter("__asyncValues", __asyncValues);
            exporter("__makeTemplateObject", __makeTemplateObject);
            exporter("__importStar", __importStar);
            exporter("__importDefault", __importDefault);
            exporter("__classPrivateFieldGet", __classPrivateFieldGet);
            exporter("__classPrivateFieldSet", __classPrivateFieldSet);
        });
    }, function (modId) {
        var map = {};return __REQUIRE__(map[modId], modId);
    });
    return __REQUIRE__(1605867079979);
}();
// none
// none
});
define("assets/Scripts/commons/collider.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var COLLIDE_STATE = {
    NO: 0,
    INTERSECT: 1,
    INSIDE: 2
};
var isIntersected = function isIntersected(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j]) {
                return true;
            }
        }
    }
    return false;
};
var Collider = function () {
    function Collider() {
        this.updateNum = 0;
        this.state = {
            x: COLLIDE_STATE.NO,
            y: COLLIDE_STATE.NO,
            z: COLLIDE_STATE.NO
        };
        this.compMap = new Map();
        this.groupPair = [];
    }
    Collider.prototype.onUpdate = function (dt) {
        this.updateNum++;
        if (this.updateNum % 3 === 0) {
            this._walkComp();
        }
    };
    Collider.prototype.watchGroup = function (group1, group2) {
        this.groupPair.push([group1, group2]);
    };
    Collider.prototype.watch = function (comp, groups) {
        if (groups === void 0) {
            groups = [];
        }
        var g = this.compMap.get(comp);
        if (g) {
            groups = groups.concat(g);
        }
        this.compMap.set(comp, groups);
    };
    Collider.prototype.unwatch = function (comp) {
        this.compMap.delete(comp);
    };
    Collider.prototype._walkComp = function () {
        var _this = this;
        var triggerComps = [];
        this.groupPair.forEach(function (pair) {
            var g1 = pair[0];
            var g2 = pair[1];
            _this.compMap.forEach(function (groups1, comp1) {
                if (!comp1) {
                    return;
                }
                _this.compMap.forEach(function (groups2, comp2) {
                    if (!comp2) {
                        return;
                    }
                    if (comp1 === comp2) {
                        return;
                    }
                    if (groups1.indexOf(g1) > -1 && groups2.indexOf(g2) > -1 || groups1.indexOf(g2) > -1 && groups2.indexOf(g1) > -1) {
                        if (_this._isCollided(comp1, comp2)) {
                            triggerComps.push([comp1, comp2]);
                        }
                    }
                });
            });
        });
        triggerComps.forEach(function (comps) {
            comps[0].onCollide && comps[0].onCollide(comps[1]);
        });
    };
    Collider.prototype._isCollided = function (comp1, comp2) {
        var p1 = comp1.entity.transform.worldPosition;
        var p2 = comp2.entity.transform.worldPosition;
        var b1 = comp1.bound;
        var b2 = comp2.bound;
        this.state = {
            x: COLLIDE_STATE.NO,
            y: COLLIDE_STATE.NO,
            z: COLLIDE_STATE.NO
        };
        for (var k in this.state) {
            var front1 = p1[k] + b1[k];
            var back1 = p1[k] - b1[k];
            var front2 = p2[k] + b2[k];
            var back2 = p2[k] - b2[k];
            if (front1 >= back2 && back1 < back2 || back1 <= front2 && front1 > front2) {
                this.state[k] = COLLIDE_STATE.INTERSECT;
            }
            if (front1 <= front2 && back1 >= back2) {
                this.state[k] = COLLIDE_STATE.INSIDE;
            }
            if (this.state[k] === COLLIDE_STATE.NO) {
                return false;
            }
        }
        return this.state.x && this.state.y && this.state.z;
    };
    return Collider;
}();
exports.default = new Collider();
// none
});
define("assets/Scripts/commons/dataCenter.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DataCenter = function () {
    function DataCenter() {
        this.playerEntity = null;
        this.playerComp = null;
        this.cameraComp = null;
        this.worldEntity = null;
    }
    return DataCenter;
}();
GameGlobal.DataCenter = new DataCenter();
exports.default = GameGlobal.DataCenter;
// none
});
define("assets/Scripts/commons/eventCenter.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var EventEmitter = require("eventemitter3");
var EventEmitterCenter = function (_super) {
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
}(EventEmitter);
exports.EventCenter = new EventEmitterCenter();
exports.default = exports.EventCenter;
// none
});
define("assets/Scripts/components/d2Move.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("../commons/eventCenter");
var SCREEN_WIDTH = engine_1.default.device.screenWidth;
var SCREEN_HEIGHT = engine_1.default.device.screenHeight;
var GAME_WIDTH = engine_1.default.adaptation.frameWidth;
var GAME_HEIGHT = engine_1.default.adaptation.frameHeight;
var D2Move = function (_super) {
    tslib_1.__extends(D2Move, _super);
    function D2Move(entity) {
        var _this = _super.call(this, entity) || this;
        _this.entity = entity;
        _this.buttonPos = engine_1.default.Vector2.ZERO.clone();
        _this.buttonRadius = { x: 0, y: 0 };
        _this.direction = engine_1.default.Vector2.ZERO.clone();
        _this.uisprite = null;
        _this.uiInput = null;
        _this.onTouchStart = _this.onTouchStart.bind(_this);
        _this.onTouchEnter = _this.onTouchEnter.bind(_this);
        _this.onTouchMove = _this.onTouchMove.bind(_this);
        _this.onTouchEnd = _this.onTouchEnd.bind(_this);
        _this.onTouchLeave = _this.onTouchLeave.bind(_this);
        return _this;
    }
    D2Move.prototype.onAwake = function () {
        this.uisprite = this.entity.getComponent(engine_1.default.UISprite);
        this.buttonPos = this.entity.transform2D.worldPosition.clone();
        this.buttonRadius = { x: this.entity.transform2D.size.x / 2, y: this.entity.transform2D.size.y / 2 };
    };
    D2Move.prototype.onEnable = function () {
        this.uiInput = this.getComponent(engine_1.default.TouchInputComponent);
        if (this.uiInput) {
            this.uiInput.onTouchStart.add(this.onTouchStart);
            this.uiInput.onTouchEnter.add(this.onTouchEnter);
            this.uiInput.onTouchEnd.add(this.onTouchEnd);
            this.uiInput.onTouchLeave.add(this.onTouchLeave);
            this.uiInput.onTouchMove.add(this.onTouchMove);
        }
    };
    D2Move.prototype.onDisable = function () {
        if (this.uiInput) {
            this.uiInput.onTouchStart.remove(this.onTouchStart);
            this.uiInput.onTouchEnter.remove(this.onTouchEnter);
            this.uiInput.onTouchEnd.remove(this.onTouchEnd);
            this.uiInput.onTouchLeave.remove(this.onTouchLeave);
            this.uiInput.onTouchMove.remove(this.onTouchMove);
        }
    };
    D2Move.prototype.onTouchStart = function (s, e) {
        this.setAlpha(200);
        this.handleTouch(e);
    };
    D2Move.prototype.onTouchEnter = function (s, e) {
        this.setAlpha(200);
        this.handleTouch(e);
    };
    D2Move.prototype.onTouchMove = function (s, e) {
        this.handleTouch(e);
    };
    D2Move.prototype.onTouchLeave = function (s, e) {
        this.setAlpha(255);
        this.emitDirection({ x: 0, y: 0, z: 0 });
    };
    D2Move.prototype.onTouchEnd = function (s, e) {
        this.setAlpha(255);
        this.emitDirection({ x: 0, y: 0, z: 0 });
    };
    D2Move.prototype.handleTouch = function (e) {
        this.direction.x = e.touches[0].position.x / this.buttonRadius.x;
        this.direction.y = e.touches[0].position.y / this.buttonRadius.y;
        this.emitDirection({ x: this.direction.x, y: 0, z: -this.direction.y });
    };
    D2Move.prototype.setAlpha = function (val) {
        var c = this.uisprite.color.clone();
        c.a = val;
        this.uisprite.color = c;
    };
    D2Move.prototype.emitDirection = function (direction) {
        eventCenter_1.default.emit(eventCenter_1.default.TOUCH_MOVE, direction);
    };
    D2Move.prototype.gamePosToScreen = function (pos) {
        var p = engine_1.default.Vector2.ZERO.clone();
        p.x = SCREEN_WIDTH / GAME_WIDTH * pos.x;
        p.y = SCREEN_HEIGHT / GAME_HEIGHT * pos.y;
        return p;
    };
    D2Move.prototype.canvasPosToScreen = function (pos) {
        pos.x = pos.x - SCREEN_WIDTH / 2;
        pos.y = -pos.y + SCREEN_HEIGHT / 2;
        return pos;
    };
    D2Move = tslib_1.__decorate([engine_1.default.decorators.serialize("D2Move")], D2Move);
    return D2Move;
}(engine_1.default.Script);
exports.default = D2Move;
// none
});
define("assets/Scripts/components/d2Score.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("../commons/eventCenter");
var D2Score = function (_super) {
    tslib_1.__extends(D2Score, _super);
    function D2Score() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.score = 0;
        _this.uilabel = null;
        return _this;
    }
    D2Score.prototype.onAwake = function () {
        var _this = this;
        this.uilabel = this.entity.getComponent(engine_1.default.UILabel);
        this.uilabel.text = "000";
        eventCenter_1.default.on(eventCenter_1.default.GET_SCORE, function (getScore) {
            _this.score += Number(getScore);
            if (_this.score < 0) {
                _this.score = 0;
            }
            var str = _this.score + "";
            if (_this.score < 10) {
                str = "0" + str;
            }
            if (_this.score < 100) {
                str = "0" + str;
            }
            _this.uilabel.text = str;
        });
    };
    D2Score = tslib_1.__decorate([engine_1.default.decorators.serialize("D2Score")], D2Score);
    return D2Score;
}(engine_1.default.Script);
exports.default = D2Score;
// none
});
define("assets/Scripts/components/d2Shoot.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("../commons/eventCenter");
var D2Shoot = function (_super) {
    tslib_1.__extends(D2Shoot, _super);
    function D2Shoot(entity) {
        var _this = _super.call(this, entity) || this;
        _this.entity = entity;
        _this.uisprite = null;
        _this.uiInput = null;
        _this.onTouchStart = _this.onTouchStart.bind(_this);
        _this.onTouchEnter = _this.onTouchEnter.bind(_this);
        _this.onTouchEnd = _this.onTouchEnd.bind(_this);
        _this.onTouchLeave = _this.onTouchLeave.bind(_this);
        return _this;
    }
    D2Shoot.prototype.onAwake = function () {
        this.uisprite = this.entity.getComponent(engine_1.default.UISprite);
    };
    D2Shoot.prototype.onEnable = function () {
        this.uiInput = this.getComponent(engine_1.default.TouchInputComponent);
        if (this.uiInput) {
            this.uiInput.onTouchStart.add(this.onTouchStart);
            this.uiInput.onTouchEnter.add(this.onTouchEnter);
            this.uiInput.onTouchEnd.add(this.onTouchEnd);
            this.uiInput.onTouchLeave.add(this.onTouchLeave);
        }
    };
    D2Shoot.prototype.onDisable = function () {
        if (this.uiInput) {
            this.uiInput.onTouchStart.remove(this.onTouchStart);
            this.uiInput.onTouchEnter.remove(this.onTouchEnter);
            this.uiInput.onTouchEnd.remove(this.onTouchEnd);
            this.uiInput.onTouchLeave.remove(this.onTouchLeave);
        }
    };
    D2Shoot.prototype.onTouchStart = function (s, e) {
        var c = this.uisprite.color.clone();
        c.a = 200;
        this.uisprite.color = c;
        eventCenter_1.default.emit(eventCenter_1.default.START_SHOOT);
    };
    D2Shoot.prototype.onTouchEnter = function (s, e) {
        var c = this.uisprite.color.clone();
        c.a = 200;
        this.uisprite.color = c;
        eventCenter_1.default.emit(eventCenter_1.default.START_SHOOT);
    };
    D2Shoot.prototype.onTouchEnd = function (s, e) {
        var c = this.uisprite.color.clone();
        c.a = 255;
        this.uisprite.color = c;
        eventCenter_1.default.emit(eventCenter_1.default.END_SHOOT);
    };
    D2Shoot.prototype.onTouchLeave = function (s, e) {
        var c = this.uisprite.color.clone();
        c.a = 255;
        this.uisprite.color = c;
        eventCenter_1.default.emit(eventCenter_1.default.END_SHOOT);
    };
    D2Shoot = tslib_1.__decorate([engine_1.default.decorators.serialize("D2Shoot")], D2Shoot);
    return D2Shoot;
}(engine_1.default.Script);
exports.default = D2Shoot;
// none
});
define("assets/Scripts/components/d3Bullet.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var collider_1 = require("../commons/collider");
var D3Bullet = function (_super) {
    tslib_1.__extends(D3Bullet, _super);
    function D3Bullet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = engine_1.default.Vector3.ZERO.clone();
        _this.speed = 8;
        _this.sumTime = 0;
        _this.maxTime = 5;
        _this.attack = 1;
        _this.bound = engine_1.default.Vector3.createFromNumber(0.15 / 2, 0.15 / 2, 0.15 / 2);
        return _this;
    }
    D3Bullet.prototype.onAwake = function () {
        collider_1.default.watch(this, ["bullet"]);
    };
    D3Bullet.prototype.onUpdate = function (dt) {
        if (this.sumTime < this.maxTime) {
            this.sumTime += dt;
            this.entity.transform.position.x += this.direction.x * this.speed * dt;
            this.entity.transform.position.y += this.direction.y * this.speed * dt;
            this.entity.transform.position.z += this.direction.z * this.speed * dt;
        } else {
            this.removeSelf();
        }
    };
    D3Bullet.prototype.onCollide = function (comp) {
        this.removeSelf();
    };
    D3Bullet.prototype.onDestroy = function () {};
    D3Bullet.prototype.removeSelf = function () {
        if (this.entity.transform && this.entity.transform.parent) {
            var parentTransform = this.entity.transform.parent;
            parentTransform.removeChild(this.entity.transform);
            collider_1.default.unwatch(this);
            this.entity.destroy();
        }
    };
    D3Bullet = tslib_1.__decorate([engine_1.default.decorators.serialize("D3Bullet")], D3Bullet);
    return D3Bullet;
}(engine_1.default.Script);
exports.default = D3Bullet;
// none
});
define("assets/Scripts/components/d3Camera.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var dataCenter_1 = require("../commons/dataCenter");
var eventCenter_1 = require("../commons/eventCenter");
var POS_LIMIT = {
    x: [-26, 26],
    z: [-44, 13]
};
var D3Camera = function (_super) {
    tslib_1.__extends(D3Camera, _super);
    function D3Camera() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.camera = null;
        return _this;
    }
    D3Camera.prototype.onAwake = function () {
        var _this = this;
        this.camera = this.entity.getComponent(engine_1.default.Camera);
        dataCenter_1.default.cameraComp = this.camera;
        console.log("onAwake D3Camera");
        eventCenter_1.default.on(eventCenter_1.default.ADD_PLAYER, function () {});
        eventCenter_1.default.on(eventCenter_1.default.MOVE_PLAYER, function (move) {
            var pos = dataCenter_1.default.playerEntity.transform.position;
            for (var k in POS_LIMIT) {
                if (pos[k] + move[k] >= POS_LIMIT[k][0] && pos[k] + move[k] <= POS_LIMIT[k][1]) {
                    _this.camera.entity.transform.position[k] += move[k];
                }
            }
        });
    };
    D3Camera.prototype.onUpdate = function (dt) {};
    D3Camera = tslib_1.__decorate([engine_1.default.decorators.serialize("D3Camera")], D3Camera);
    return D3Camera;
}(engine_1.default.Script);
exports.default = D3Camera;
// none
});
define("assets/Scripts/components/d3Enemy.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var collider_1 = require("../commons/collider");
var eventCenter_1 = require("../commons/eventCenter");
var d3Bullet_1 = require("./d3Bullet");
var d3Player_1 = require("./d3Player");
var randomBetween = function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
};
var D3Enemy = function (_super) {
    tslib_1.__extends(D3Enemy, _super);
    function D3Enemy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = engine_1.default.Vector3.ZERO.clone();
        _this.speed = randomBetween(3, 6);
        _this.sumTime = 0;
        _this.maxTime = 15;
        _this.hp = 5;
        _this.score = {
            collide: -2,
            dead: 1
        };
        _this.rotationY = (Math.random() < 0.5 ? -1 : 1) * 0.05;
        _this.hurtParticle = null;
        _this.bound = engine_1.default.Vector3.createFromNumber(0.9 / 2, 0.5 / 2, 0.9 / 2);
        return _this;
    }
    D3Enemy_1 = D3Enemy;
    D3Enemy.prototype.onAwake = function () {
        this.direction.z = 1;
        this.hurtParticle = this.entity.transform.children[0].findChildByName("Hurt").entity.getComponent(engine_1.default.Particle);
        collider_1.default.watch(this, ["enemy"]);
    };
    D3Enemy.prototype.onUpdate = function (dt) {
        if (this.sumTime < this.maxTime) {
            this.sumTime += dt;
            this.entity.transform.position.x += this.direction.x * this.speed * dt;
            this.entity.transform.position.y += this.direction.y * this.speed * dt;
            this.entity.transform.position.z += this.direction.z * this.speed * dt;
            this.entity.transform.euler.y += this.rotationY;
        } else {
            this.removeEnemy();
        }
    };
    D3Enemy.prototype.onCollide = function (comp) {
        if (comp instanceof d3Player_1.default) {
            eventCenter_1.default.emit(eventCenter_1.default.HURT_PLAYER);
            eventCenter_1.default.emit(eventCenter_1.default.GET_SCORE, this.score.collide);
            this.removeEnemy();
        } else if (comp instanceof d3Bullet_1.default) {
            this.hp -= comp.attack;
            this.hurtParticle.emitter.start = true;
            if (this.hp <= 0) {
                eventCenter_1.default.emit(eventCenter_1.default.GET_SCORE, this.score.dead);
                this.removeEnemy();
            }
        }
    };
    D3Enemy.prototype.removeEnemy = function () {
        if (this.entity.transform) {
            var parentTransform = this.entity.transform.parent.entity.transform;
            parentTransform.removeChild(this.entity.transform);
            collider_1.default.unwatch(this);
            this.entity.destroy();
            D3Enemy_1.enemyCount--;
        }
    };
    D3Enemy.prototype.onDestroy = function () {};
    var D3Enemy_1;
    D3Enemy.enemyCount = 0;
    D3Enemy = D3Enemy_1 = tslib_1.__decorate([engine_1.default.decorators.serialize("D3Enemy")], D3Enemy);
    return D3Enemy;
}(engine_1.default.Script);
exports.default = D3Enemy;
// none
});
define("assets/Scripts/components/d3Main.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var collider_1 = require("../commons/collider");
var dataCenter_1 = require("../commons/dataCenter");
var d3Enemy_1 = require("./d3Enemy");
var d3Player_1 = require("./d3Player");
var ENEMY_INTERVAL = 0.5;
var randomBetween = function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
};
var D3Main = function (_super) {
    tslib_1.__extends(D3Main, _super);
    function D3Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.world = null;
        _this.enemyTime = 0;
        _this.enemyPrefab = null;
        return _this;
    }
    D3Main.prototype.onAwake = function () {
        console.log("onAwake D3Main");
        this.world = this.entity.transform.parent.entity;
        dataCenter_1.default.worldEntity = this.world;
        collider_1.default.watchGroup("enemy", "player");
        collider_1.default.watchGroup("enemy", "bullet");
        this.initPlayer();
        this.initEnemy();
    };
    D3Main.prototype.onUpdate = function (dt) {
        collider_1.default.onUpdate(dt);
        this.enemyTime += dt;
        if (this.enemyTime >= ENEMY_INTERVAL) {
            this.addEnemy();
            this.enemyTime -= ENEMY_INTERVAL;
        }
    };
    D3Main.prototype.initPlayer = function () {
        var _this = this;
        engine_1.default.loader.load("resource/Aircraft.prefab").promise.then(function (prefab) {
            var entity = prefab.instantiate();
            entity.addComponent(d3Player_1.default);
            entity.transform.position.y += 1;
            entity.transform.position.z = 8;
            _this.world.transform.addChild(entity.transform);
        });
    };
    D3Main.prototype.initEnemy = function () {
        var _this = this;
        engine_1.default.loader.load("resource/Enemy01.prefab").promise.then(function (prefab) {
            _this.enemyPrefab = prefab;
        });
    };
    D3Main.prototype.addEnemy = function () {
        if (!this.enemyPrefab) {
            return;
        }
        if (d3Enemy_1.default.enemyCount >= 20) {
            return;
        }
        var entity = this.enemyPrefab.instantiate();
        var script = entity.addComponent(d3Enemy_1.default);
        entity.transform.position.x = randomBetween(-26, 26);
        entity.transform.position.y += 1;
        entity.transform.position.z = randomBetween(-50, -20);
        this.world.transform.addChild(entity.transform);
        d3Enemy_1.default.enemyCount++;
    };
    D3Main = tslib_1.__decorate([engine_1.default.decorators.serialize("D3Main")], D3Main);
    return D3Main;
}(engine_1.default.Script);
exports.default = D3Main;
// none
});
define("assets/Scripts/components/d3Player.js", function(require, module, exports, process){ 
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var collider_1 = require("../commons/collider");
var dataCenter_1 = require("../commons/dataCenter");
var eventCenter_1 = require("../commons/eventCenter");
var d3Bullet_1 = require("./d3Bullet");
var POS_LIMIT = {
    x: [-30, 30],
    z: [-54, 14.3]
};
var D3Player = function (_super) {
    tslib_1.__extends(D3Player, _super);
    function D3Player() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bulletPrefab = null;
        _this.bulletInterval = 0.3;
        _this.bulletTime = 0;
        _this.player = null;
        _this.hurtParticle = null;
        _this.speed = 10;
        _this.direction = engine_1.default.Vector3.ZERO.clone();
        _this.rotation = engine_1.default.Vector3.ZERO.clone();
        _this.bound = engine_1.default.Vector3.createFromNumber(2.75 / 2, 0.46 / 2, 0.5 / 2);
        return _this;
    }
    D3Player.prototype.onAwake = function () {
        console.log("onAwake D3Player");
        this.player = this.entity;
        dataCenter_1.default.playerEntity = this.player;
        dataCenter_1.default.playerComp = this;
        this.hurtParticle = this.player.transform._children[0].findChildByName("Hurt").entity.getComponent(engine_1.default.Particle);
        this.initEvent();
        this.initPrefab();
        collider_1.default.watch(this, ["player"]);
        eventCenter_1.default.emit(eventCenter_1.default.ADD_PLAYER);
    };
    D3Player.prototype.onUpdate = function (dt) {
        if (this.player) {
            this.updateMove(dt);
            this.updateBullet(dt);
        }
    };
    D3Player.prototype.initPrefab = function () {
        var _this = this;
        engine_1.default.loader.load("resource/Bullet.prefab").promise.then(function (prefab) {
            _this.bulletPrefab = prefab;
        });
    };
    D3Player.prototype.initEvent = function () {
        var _this = this;
        eventCenter_1.default.on(eventCenter_1.default.TOUCH_MOVE, function (direction) {
            _this.direction.x = direction.x;
            _this.direction.y = direction.y;
            _this.direction.z = direction.z;
            if (direction.x === 0) {
                _this.rotation.x = 0;
                _this.rotation.z = 0;
            } else {
                _this.rotation.x = 0.01;
                _this.rotation.z = direction.x < 0 ? 0.01 : -0.01;
            }
        });
        eventCenter_1.default.on(eventCenter_1.default.HURT_PLAYER, function () {
            _this.hurtParticle.emitter.start = true;
        });
        eventCenter_1.default.on(eventCenter_1.default.START_SHOOT, function () {
            _this.bulletInterval = 0.1;
        });
        eventCenter_1.default.on(eventCenter_1.default.END_SHOOT, function () {
            _this.bulletInterval = 0.3;
        });
    };
    D3Player.prototype.updateMove = function (dt) {
        for (var k in POS_LIMIT) {
            if (this.rotation[k] === 0) {
                this.player.transform.euler[k] = 0;
            } else {
                this.player.transform.euler[k] += this.rotation[k];
                if (this.player.transform.euler[k] > 0.2) {
                    this.player.transform.euler[k] = 0.2;
                } else if (this.player.transform.euler[k] < -0.2) {
                    this.player.transform.euler[k] = -0.2;
                }
            }
        }
        var move = {
            x: this.speed * this.direction.x * dt,
            y: this.speed * this.direction.y * dt,
            z: this.speed * this.direction.z * dt
        };
        var pos = this.player.transform.position;
        for (var k in POS_LIMIT) {
            if (pos[k] + move[k] < POS_LIMIT[k][0] || pos[k] + move[k] > POS_LIMIT[k][1]) {
                move[k] = 0;
            }
            this.player.transform.position[k] += move[k];
        }
        if (move.x !== 0 || move.y !== 0 || move.z !== 0) {
            eventCenter_1.default.emit(eventCenter_1.default.MOVE_PLAYER, move);
        }
    };
    D3Player.prototype.updateBullet = function (dt) {
        if (!this.bulletPrefab) {
            return;
        }
        this.bulletTime += dt;
        if (this.bulletTime >= this.bulletInterval) {
            var entity = this.bulletPrefab.instantiate();
            var script = entity.addComponent(d3Bullet_1.default);
            entity.transform.position = this.player.transform.position.clone();
            script.direction.z = -1;
            dataCenter_1.default.worldEntity.transform.addChild(entity.transform);
            this.bulletTime -= this.bulletInterval;
        }
    };
    D3Player = tslib_1.__decorate([engine_1.default.decorators.serialize("D3Player")], D3Player);
    return D3Player;
}(engine_1.default.Script);
exports.default = D3Player;
// none
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJfX01PRFNfXyIsIl9fREVGSU5FX18iLCJtb2RJZCIsImZ1bmMiLCJyZXEiLCJtIiwiX3RlbXBleHBvcnRzIiwic3RhdHVzIiwiX19SRVFVSVJFX18iLCJzb3VyY2UiLCJyZXF1aXJlIiwiX2V4cG9ydHMiLCJkZXNwIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiY29uZmlndXJhYmxlIiwiZGVmaW5lUHJvcGVydHkiLCJzZXQiLCJ2YWwiLCJfX3Byb3RvX18iLCJrZXlzIiwiZm9yRWFjaCIsImsiLCJnZXQiLCJfX1JFUVVJUkVfV0lMRENBUkRfXyIsIm9iaiIsIl9fZXNNb2R1bGUiLCJuZXdPYmoiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJkZWZhdWx0IiwiX19SRVFVSVJFX0RFRkFVTFRfXyIsImhhcyIsInByZWZpeCIsIkV2ZW50cyIsImNyZWF0ZSIsIkVFIiwiZm4iLCJjb250ZXh0Iiwib25jZSIsImFkZExpc3RlbmVyIiwiZW1pdHRlciIsImV2ZW50IiwiVHlwZUVycm9yIiwibGlzdGVuZXIiLCJldnQiLCJfZXZlbnRzIiwiX2V2ZW50c0NvdW50IiwicHVzaCIsImNsZWFyRXZlbnQiLCJFdmVudEVtaXR0ZXIiLCJldmVudE5hbWVzIiwibmFtZXMiLCJldmVudHMiLCJuYW1lIiwic2xpY2UiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJjb25jYXQiLCJsaXN0ZW5lcnMiLCJoYW5kbGVycyIsImkiLCJsIiwibGVuZ3RoIiwiZWUiLCJBcnJheSIsImxpc3RlbmVyQ291bnQiLCJlbWl0IiwiYTEiLCJhMiIsImEzIiwiYTQiLCJhNSIsImxlbiIsImFyZ3VtZW50cyIsImFyZ3MiLCJyZW1vdmVMaXN0ZW5lciIsInVuZGVmaW5lZCIsImFwcGx5IiwiaiIsIm9uIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwib2ZmIiwicHJlZml4ZWQiLCJtYXAiLCJfX2V4dGVuZHMiLCJfX2Fzc2lnbiIsIl9fcmVzdCIsIl9fZGVjb3JhdGUiLCJfX3BhcmFtIiwiX19tZXRhZGF0YSIsIl9fYXdhaXRlciIsIl9fZ2VuZXJhdG9yIiwiX19leHBvcnRTdGFyIiwiX192YWx1ZXMiLCJfX3JlYWQiLCJfX3NwcmVhZCIsIl9fc3ByZWFkQXJyYXlzIiwiX19hd2FpdCIsIl9fYXN5bmNHZW5lcmF0b3IiLCJfX2FzeW5jRGVsZWdhdG9yIiwiX19hc3luY1ZhbHVlcyIsIl9fbWFrZVRlbXBsYXRlT2JqZWN0IiwiX19pbXBvcnRTdGFyIiwiX19pbXBvcnREZWZhdWx0IiwiX19jbGFzc1ByaXZhdGVGaWVsZEdldCIsIl9fY2xhc3NQcml2YXRlRmllbGRTZXQiLCJmYWN0b3J5Iiwicm9vdCIsImdsb2JhbCIsInNlbGYiLCJkZWZpbmUiLCJhbWQiLCJjcmVhdGVFeHBvcnRlciIsInByZXZpb3VzIiwidmFsdWUiLCJpZCIsInYiLCJleHBvcnRlciIsImV4dGVuZFN0YXRpY3MiLCJzZXRQcm90b3R5cGVPZiIsImQiLCJiIiwicCIsIl9fIiwiY29uc3RydWN0b3IiLCJhc3NpZ24iLCJ0IiwicyIsIm4iLCJlIiwiaW5kZXhPZiIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiciIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsInBhcmFtSW5kZXgiLCJkZWNvcmF0b3IiLCJtZXRhZGF0YUtleSIsIm1ldGFkYXRhVmFsdWUiLCJtZXRhZGF0YSIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsImFkb3B0IiwicmVzb2x2ZSIsIlByb21pc2UiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJzdGVwIiwibmV4dCIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJib2R5IiwiXyIsImxhYmVsIiwic2VudCIsInRyeXMiLCJvcHMiLCJmIiwieSIsImciLCJ2ZXJiIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJvcCIsInBvcCIsIm8iLCJhciIsImVycm9yIiwiaWwiLCJhIiwiamwiLCJhc3luY0l0ZXJhdG9yIiwicSIsInJlc3VtZSIsInNldHRsZSIsImZ1bGZpbGwiLCJzaGlmdCIsImNvb2tlZCIsInJhdyIsIm1vZCIsInJlY2VpdmVyIiwicHJpdmF0ZU1hcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUNBOEIscUJBQVMsU0FBVCxFQUFvQjdCLE9BQXBCO0FBQ0E2QixxQkFBUyxZQUFULEVBQXVCNUIsVUFBdkI7QUFDQTRCLHFCQUFTLFdBQVQsRUFBc0IzQixTQUF0QjtBQUNBMkIscUJBQVMsYUFBVCxFQUF3QjFCLFdBQXhCO0FBQ0EwQixxQkFBUyxjQUFULEVBQXlCekIsWUFBekI7QUFDQXlCLHFCQUFTLFVBQVQsRUFBcUJ4QixRQUFyQjtBQUNBd0IscUJBQVMsUUFBVCxFQUFtQnZCLE1BQW5CO0FBQ0F1QixxQkFBUyxVQUFULEVBQXFCdEIsUUFBckI7QUFDQXNCLHFCQUFTLGdCQUFULEVBQTJCckIsY0FBM0I7QUFDQXFCLHFCQUFTLFNBQVQsRUFBb0JwQixNQUFwQjtBQUNBb0IscUJBQVMsa0JBQVQsRUFBNkJuQixnQkFBN0I7QUFDQW1CLHFCQUFTLGtCQUFULEVBQTZCbEIsZ0JBQTdCO0FBQ0FrQixxQkFBUyxlQUFULEVBQTBCakIsYUFBMUI7QUFDQWlCLHFCQUFTLHNCQUFULEVBQWlDaEIsb0JBQWpDO0FBQ0FnQixxQkFBUyxjQUFULEVBQXlCZixZQUF6QjtBQUNBZSxxQkFBUyxpQkFBVCxFQUE0QmQsZUFBNUI7QUFDQWMscUJBQVMsd0JBQVQsRUFBbUNiLHNCQUFuQztBQUNBYSxxQkFBUyx3QkFBVCxFQUFtQ1osc0JBQW5DO0FBQ0gsU0E5T0Q7QUFnUEMsS0F0UkQsRUFzUkcsVUFBU3hHLEtBQVQsRUFBZ0I7QUFBQyxZQUFJa0YsTUFBTSxFQUFWLENBQWMsT0FBTzVFLFlBQVk0RSxJQUFJbEYsS0FBSixDQUFaLEVBQXdCQSxLQUF4QixDQUFQO0FBQXdDLEtBdFIxRTtBQXVSQSxXQUFPTSxZQUFZLGFBQVosQ0FBUDtBQUNDLENBOVJnQixFQUFqQjtBQStSQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbnZhciBfX01PRFNfXyA9IHt9O1xudmFyIF9fREVGSU5FX18gPSBmdW5jdGlvbihtb2RJZCwgZnVuYywgcmVxKSB7IHZhciBtID0geyBleHBvcnRzOiB7fSwgX3RlbXBleHBvcnRzOiB7fSB9OyBfX01PRFNfX1ttb2RJZF0gPSB7IHN0YXR1czogMCwgZnVuYzogZnVuYywgcmVxOiByZXEsIG06IG0gfTsgfTtcbnZhciBfX1JFUVVJUkVfXyA9IGZ1bmN0aW9uKG1vZElkLCBzb3VyY2UpIHsgaWYoIV9fTU9EU19fW21vZElkXSkgcmV0dXJuIHJlcXVpcmUoc291cmNlKTsgaWYoIV9fTU9EU19fW21vZElkXS5zdGF0dXMpIHsgdmFyIG0gPSBfX01PRFNfX1ttb2RJZF0ubTsgbS5fZXhwb3J0cyA9IG0uX3RlbXBleHBvcnRzOyB2YXIgZGVzcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgXCJleHBvcnRzXCIpOyBpZiAoZGVzcCAmJiBkZXNwLmNvbmZpZ3VyYWJsZSkgT2JqZWN0LmRlZmluZVByb3BlcnR5KG0sIFwiZXhwb3J0c1wiLCB7IHNldDogZnVuY3Rpb24gKHZhbCkgeyBpZih0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiICYmIHZhbCAhPT0gbS5fZXhwb3J0cykgeyBtLl9leHBvcnRzLl9fcHJvdG9fXyA9IHZhbC5fX3Byb3RvX187IE9iamVjdC5rZXlzKHZhbCkuZm9yRWFjaChmdW5jdGlvbiAoaykgeyBtLl9leHBvcnRzW2tdID0gdmFsW2tdOyB9KTsgfSBtLl90ZW1wZXhwb3J0cyA9IHZhbCB9LCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG0uX3RlbXBleHBvcnRzOyB9IH0pOyBfX01PRFNfX1ttb2RJZF0uc3RhdHVzID0gMTsgX19NT0RTX19bbW9kSWRdLmZ1bmMoX19NT0RTX19bbW9kSWRdLnJlcSwgbSwgbS5leHBvcnRzKTsgfSByZXR1cm4gX19NT0RTX19bbW9kSWRdLm0uZXhwb3J0czsgfTtcbnZhciBfX1JFUVVJUkVfV0lMRENBUkRfXyA9IGZ1bmN0aW9uKG9iaikgeyBpZihvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZihvYmogIT0gbnVsbCkgeyBmb3IodmFyIGsgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrKSkgbmV3T2JqW2tdID0gb2JqW2tdOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfTtcbnZhciBfX1JFUVVJUkVfREVGQVVMVF9fID0gZnVuY3Rpb24ob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmouZGVmYXVsdCA6IG9iajsgfTtcbl9fREVGSU5FX18oMTYwNTg2NzA3OTk3OSwgZnVuY3Rpb24ocmVxdWlyZSwgbW9kdWxlLCBleHBvcnRzKSB7XG4vKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXG5cblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbi8qIGdsb2JhbCBnbG9iYWwsIGRlZmluZSwgU3lzdGVtLCBSZWZsZWN0LCBQcm9taXNlICovXG52YXIgX19leHRlbmRzO1xudmFyIF9fYXNzaWduO1xudmFyIF9fcmVzdDtcbnZhciBfX2RlY29yYXRlO1xudmFyIF9fcGFyYW07XG52YXIgX19tZXRhZGF0YTtcbnZhciBfX2F3YWl0ZXI7XG52YXIgX19nZW5lcmF0b3I7XG52YXIgX19leHBvcnRTdGFyO1xudmFyIF9fdmFsdWVzO1xudmFyIF9fcmVhZDtcbnZhciBfX3NwcmVhZDtcbnZhciBfX3NwcmVhZEFycmF5cztcbnZhciBfX2F3YWl0O1xudmFyIF9fYXN5bmNHZW5lcmF0b3I7XG52YXIgX19hc3luY0RlbGVnYXRvcjtcbnZhciBfX2FzeW5jVmFsdWVzO1xudmFyIF9fbWFrZVRlbXBsYXRlT2JqZWN0O1xudmFyIF9faW1wb3J0U3RhcjtcbnZhciBfX2ltcG9ydERlZmF1bHQ7XG52YXIgX19jbGFzc1ByaXZhdGVGaWVsZEdldDtcbnZhciBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0O1xuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICAgdmFyIHJvb3QgPSB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgPyBzZWxmIDogdHlwZW9mIHRoaXMgPT09IFwib2JqZWN0XCIgPyB0aGlzIDoge307XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShcInRzbGliXCIsIFtcImV4cG9ydHNcIl0sIGZ1bmN0aW9uIChleHBvcnRzKSB7IGZhY3RvcnkoY3JlYXRlRXhwb3J0ZXIocm9vdCwgY3JlYXRlRXhwb3J0ZXIoZXhwb3J0cykpKTsgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGZhY3RvcnkoY3JlYXRlRXhwb3J0ZXIocm9vdCwgY3JlYXRlRXhwb3J0ZXIobW9kdWxlLmV4cG9ydHMpKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmYWN0b3J5KGNyZWF0ZUV4cG9ydGVyKHJvb3QpKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlRXhwb3J0ZXIoZXhwb3J0cywgcHJldmlvdXMpIHtcbiAgICAgICAgaWYgKGV4cG9ydHMgIT09IHJvb3QpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlkLCB2KSB7IHJldHVybiBleHBvcnRzW2lkXSA9IHByZXZpb3VzID8gcHJldmlvdXMoaWQsIHYpIDogdjsgfTtcbiAgICB9XG59KVxuKGZ1bmN0aW9uIChleHBvcnRlcikge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG5cbiAgICBfX2V4dGVuZHMgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG5cbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuXG4gICAgX19yZXN0ID0gZnVuY3Rpb24gKHMsIGUpIHtcbiAgICAgICAgdmFyIHQgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcbiAgICAgICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XG4gICAgICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG5cbiAgICBfX2RlY29yYXRlID0gZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG4gICAgfTtcblxuICAgIF9fcGFyYW0gPSBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxuICAgIH07XG5cbiAgICBfX21ldGFkYXRhID0gZnVuY3Rpb24gKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XG4gICAgfTtcblxuICAgIF9fYXdhaXRlciA9IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICAgICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgX19nZW5lcmF0b3IgPSBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgICAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgICAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICAgICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgICAgIHdoaWxlIChfKSB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgX19leHBvcnRTdGFyID0gZnVuY3Rpb24gKG0sIGV4cG9ydHMpIHtcbiAgICAgICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xuICAgIH07XG5cbiAgICBfX3ZhbHVlcyA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XG4gICAgICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xuICAgICAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XG4gICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbiAgICB9O1xuXG4gICAgX19yZWFkID0gZnVuY3Rpb24gKG8sIG4pIHtcbiAgICAgICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xuICAgICAgICBpZiAoIW0pIHJldHVybiBvO1xuICAgICAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXI7XG4gICAgfTtcblxuICAgIF9fc3ByZWFkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcbiAgICAgICAgcmV0dXJuIGFyO1xuICAgIH07XG5cbiAgICBfX3NwcmVhZEFycmF5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcbiAgICAgICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxuICAgICAgICAgICAgICAgIHJba10gPSBhW2pdO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9O1xuXG4gICAgX19hd2FpdCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xuICAgIH07XG5cbiAgICBfX2FzeW5jR2VuZXJhdG9yID0gZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xuICAgICAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xuICAgICAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XG4gICAgICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxuICAgICAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgIH1cbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxuICAgICAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XG4gICAgICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cbiAgICB9O1xuXG4gICAgX19hc3luY0RlbGVnYXRvciA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIHZhciBpLCBwO1xuICAgICAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xuICAgICAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XG4gICAgfTtcblxuICAgIF9fYXN5bmNWYWx1ZXMgPSBmdW5jdGlvbiAobykge1xuICAgICAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xuICAgICAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XG4gICAgICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cbiAgICAgICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxuICAgIH07XG5cbiAgICBfX21ha2VUZW1wbGF0ZU9iamVjdCA9IGZ1bmN0aW9uIChjb29rZWQsIHJhdykge1xuICAgICAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxuICAgICAgICByZXR1cm4gY29va2VkO1xuICAgIH07XG5cbiAgICBfX2ltcG9ydFN0YXIgPSBmdW5jdGlvbiAobW9kKSB7XG4gICAgICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcbiAgICAgICAgcmVzdWx0W1wiZGVmYXVsdFwiXSA9IG1vZDtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgX19pbXBvcnREZWZhdWx0ID0gZnVuY3Rpb24gKG1vZCkge1xuICAgICAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbiAgICB9O1xuXG4gICAgX19jbGFzc1ByaXZhdGVGaWVsZEdldCA9IGZ1bmN0aW9uIChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xuICAgICAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByaXZhdGVNYXAuZ2V0KHJlY2VpdmVyKTtcbiAgICB9O1xuXG4gICAgX19jbGFzc1ByaXZhdGVGaWVsZFNldCA9IGZ1bmN0aW9uIChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gc2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBleHBvcnRlcihcIl9fZXh0ZW5kc1wiLCBfX2V4dGVuZHMpO1xuICAgIGV4cG9ydGVyKFwiX19hc3NpZ25cIiwgX19hc3NpZ24pO1xuICAgIGV4cG9ydGVyKFwiX19yZXN0XCIsIF9fcmVzdCk7XG4gICAgZXhwb3J0ZXIoXCJfX2RlY29yYXRlXCIsIF9fZGVjb3JhdGUpO1xuICAgIGV4cG9ydGVyKFwiX19wYXJhbVwiLCBfX3BhcmFtKTtcbiAgICBleHBvcnRlcihcIl9fbWV0YWRhdGFcIiwgX19tZXRhZGF0YSk7XG4gICAgZXhwb3J0ZXIoXCJfX2F3YWl0ZXJcIiwgX19hd2FpdGVyKTtcbiAgICBleHBvcnRlcihcIl9fZ2VuZXJhdG9yXCIsIF9fZ2VuZXJhdG9yKTtcbiAgICBleHBvcnRlcihcIl9fZXhwb3J0U3RhclwiLCBfX2V4cG9ydFN0YXIpO1xuICAgIGV4cG9ydGVyKFwiX192YWx1ZXNcIiwgX192YWx1ZXMpO1xuICAgIGV4cG9ydGVyKFwiX19yZWFkXCIsIF9fcmVhZCk7XG4gICAgZXhwb3J0ZXIoXCJfX3NwcmVhZFwiLCBfX3NwcmVhZCk7XG4gICAgZXhwb3J0ZXIoXCJfX3NwcmVhZEFycmF5c1wiLCBfX3NwcmVhZEFycmF5cyk7XG4gICAgZXhwb3J0ZXIoXCJfX2F3YWl0XCIsIF9fYXdhaXQpO1xuICAgIGV4cG9ydGVyKFwiX19hc3luY0dlbmVyYXRvclwiLCBfX2FzeW5jR2VuZXJhdG9yKTtcbiAgICBleHBvcnRlcihcIl9fYXN5bmNEZWxlZ2F0b3JcIiwgX19hc3luY0RlbGVnYXRvcik7XG4gICAgZXhwb3J0ZXIoXCJfX2FzeW5jVmFsdWVzXCIsIF9fYXN5bmNWYWx1ZXMpO1xuICAgIGV4cG9ydGVyKFwiX19tYWtlVGVtcGxhdGVPYmplY3RcIiwgX19tYWtlVGVtcGxhdGVPYmplY3QpO1xuICAgIGV4cG9ydGVyKFwiX19pbXBvcnRTdGFyXCIsIF9faW1wb3J0U3Rhcik7XG4gICAgZXhwb3J0ZXIoXCJfX2ltcG9ydERlZmF1bHRcIiwgX19pbXBvcnREZWZhdWx0KTtcbiAgICBleHBvcnRlcihcIl9fY2xhc3NQcml2YXRlRmllbGRHZXRcIiwgX19jbGFzc1ByaXZhdGVGaWVsZEdldCk7XG4gICAgZXhwb3J0ZXIoXCJfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0XCIsIF9fY2xhc3NQcml2YXRlRmllbGRTZXQpO1xufSk7XG5cbn0sIGZ1bmN0aW9uKG1vZElkKSB7dmFyIG1hcCA9IHt9OyByZXR1cm4gX19SRVFVSVJFX18obWFwW21vZElkXSwgbW9kSWQpOyB9KVxucmV0dXJuIF9fUkVRVUlSRV9fKDE2MDU4NjcwNzk5NzkpO1xufSkoKVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl19