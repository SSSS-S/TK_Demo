"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("./eventCenter");
var Health_1 = require("./Health");
var Explosion = (function (_super) {
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
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'boolean',
        })
    ], Explosion.prototype, "shooterAISupport", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], Explosion.prototype, "explosionForce", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], Explosion.prototype, "explosionRadius", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'boolean',
        })
    ], Explosion.prototype, "shakeCamera", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], Explosion.prototype, "cameraShakeViolence", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'boolean',
        })
    ], Explosion.prototype, "causeDamage", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], Explosion.prototype, "damage", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: engine_1.default.Prefab,
        })
    ], Explosion.prototype, "PHY", void 0);
    Explosion = Explosion_1 = tslib_1.__decorate([
        engine_1.default.decorators.serialize("Explosion")
    ], Explosion);
    return Explosion;
}(engine_1.default.Script));
exports.default = Explosion;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFzc2V0cy9TY3JpcHRzL0V4cGxvc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBNEI7QUFFNUIsNkNBQTJDO0FBQzNDLG1DQUE4QjtBQUU5QjtJQUF1QyxxQ0FBYTtJQUFwRDtRQUFBLHFFQStHQztRQTFHUSxzQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFLbEMsb0JBQWMsR0FBVSxHQUFHLENBQUM7UUFLNUIscUJBQWUsR0FBVSxJQUFJLENBQUM7UUFLOUIsaUJBQVcsR0FBWSxJQUFJLENBQUM7UUFLNUIseUJBQW1CLEdBQVUsR0FBRyxDQUFDO1FBS2pDLGlCQUFXLEdBQVksSUFBSSxDQUFDO1FBSzVCLFlBQU0sR0FBVSxJQUFJLENBQUM7O0lBNEU5QixDQUFDO2tCQS9Hb0IsU0FBUztJQTBDckIsMkJBQU8sR0FBZDtRQUFBLGlCQXNDQztRQXJDQyxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUM7WUFFdkIsSUFBTSxJQUFJLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBRTNGLElBQUksS0FBSSxDQUFDLFdBQVcsRUFBRTtnQkFFcEIsS0FBa0IsVUFBSSxFQUFKLGFBQUksRUFBSixrQkFBSSxFQUFKLElBQUksRUFBRTtvQkFBbkIsSUFBTSxHQUFHLGFBQUE7b0JBQ1osSUFBTSxZQUFZLEdBQUcsS0FBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBRzVILElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQVMsZ0JBQU0sQ0FBQyxJQUFJLElBQUksRUFBRTt3QkFDbkQsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFD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MUIsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQzt1REFDdUM7SUFLekM7UUFIQyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDMUIsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO3FEQUNpQztJQUtuQztRQUhDLGdCQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztZQUMxQixJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7c0RBQ21DO0lBS3JDO1FBSEMsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1lBQzFCLElBQUksRUFBRSxTQUFTO1NBQ2hCLENBQUM7a0RBQ2lDO0lBS25DO1FBSEMsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1lBQzFCLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQzswREFDc0M7SUFLeEM7UUFIQyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDMUIsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQztrREFDaUM7SUFLbkM7UUFIQyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDMUIsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDOzZDQUMwQjtJQUs1QjtRQUhDLGdCQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztZQUMxQixJQUFJLEVBQUUsZ0JBQU0sQ0FBQyxNQUFNO1NBQ3BCLENBQUM7MENBQ3VCO0lBeENOLFNBQVM7UUFEN0IsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztPQUNwQixTQUFTLENBK0c3QjtJQUFELGdCQUFDO0NBL0dELEFBK0dDLENBL0dzQyxnQkFBTSxDQUFDLE1BQU0sR0ErR25EO2tCQS9Hb0IsU0FBUyIsImZpbGUiOiJBc3NldHMvU2NyaXB0cy9FeHBsb3Npb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZW5naW5lIGZyb20gXCJlbmdpbmVcIjtcbmltcG9ydCB7IGZsb2F0IH0gZnJvbSBcImVuZ2luZS90eXBlXCI7XG5pbXBvcnQgeyBkYXRlQ2VudGVyIH0gZnJvbSBcIi4vZXZlbnRDZW50ZXJcIjtcbmltcG9ydCBIZWFsdGggZnJvbSBcIi4vSGVhbHRoXCI7XG5AZW5naW5lLmRlY29yYXRvcnMuc2VyaWFsaXplKFwiRXhwbG9zaW9uXCIpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBsb3Npb24gZXh0ZW5kcyBlbmdpbmUuU2NyaXB0IHtcblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgfSlcbiAgcHVibGljIHNob290ZXJBSVN1cHBvcnQ6IGJvb2xlYW4gPSBmYWxzZTtcdFx0Ly8g5L2/5YW85a655bCE5Ye7QUnnmoTnvZHlhbPmuLjmiI9cblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6ICdudW1iZXInLFxuICB9KVxuICBwdWJsaWMgZXhwbG9zaW9uRm9yY2U6IGZsb2F0ID0gNS4wO1x0XHRcdC8vIFRoZSBmb3JjZSB3aXRoIHdoaWNoIG5lYXJieSBvYmplY3RzIHdpbGwgYmUgYmxhc3RlZCBvdXR3YXJkc1xuXG4gIEBlbmdpbmUuZGVjb3JhdG9ycy5wcm9wZXJ0eSh7XG4gICAgdHlwZTogJ251bWJlcicsXG4gIH0pXG4gIHB1YmxpYyBleHBsb3Npb25SYWRpdXM6IGZsb2F0ID0gMTAuMDtcdFx0Ly8gVGhlIHJhZGl1cyBvZiB0aGUgZXhwbG9zaW9uXG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gIH0pXG4gIHB1YmxpYyBzaGFrZUNhbWVyYTogYm9vbGVhbiA9IHRydWU7XHRcdFx0XHQvLyBHaXZlIGNhbWVyYSBzaGFraW5nIGVmZmVjdHMgdG8gbmVhcmJ5IGNhbWVyYXMgdGhhdCBoYXZlIHRoZSB2aWJyYXRpb24gY29tcG9uZW50XG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcbiAgICB0eXBlOiAnbnVtYmVyJyxcbiAgfSlcbiAgcHVibGljIGNhbWVyYVNoYWtlVmlvbGVuY2U6IGZsb2F0ID0gMC41O1x0Ly8gVGhlIHZpb2xlbmNlIG9mIHRoZSBjYW1lcmEgc2hha2UgZWZmZWN0XG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gIH0pXG4gIHB1YmxpYyBjYXVzZURhbWFnZTogYm9vbGVhbiA9IHRydWU7XHRcdFx0XHQvLyBXaGV0aGVyIG9yIG5vdCB0aGUgZXhwbG9zaW9uIHNob3VsZCBhcHBseSBkYW1hZ2UgdG8gbmVhcmJ5IEdhbWVPYmplY3RzIHdpdGggdGhlIEhlYXRsaCBjb21wb25lbnRcblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6ICdudW1iZXInLFxuICB9KVxuICBwdWJsaWMgZGFtYWdlOiBmbG9hdCA9IDEwLjA7XHRcdFx0XHQvLyBUaGUgbXVsdGlwbGllciBieSB3aGljaCB0aGUgYW1tb3VudCBvZiBkYW1hZ2UgdG8gYmUgYXBwbGllZCBpcyBkZXRlcm1pbmVkXG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcbiAgICB0eXBlOiBlbmdpbmUuUHJlZmFiLFxuICB9KVxuICBwdWJsaWMgUEhZOiBlbmdpbmUuUHJlZmFiXG5cbiAgcHVibGljIG9uU3RhcnQoKSB7XG4gICAgbGV0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIOmZhOi/keeisOaSnuWZqOeahOaVsOe7hFxuICAgICAgY29uc3QgY29scyA9IHRoaXMuT3ZlcmxhcFNwaGVyZSh0aGlzLmVudGl0eS50cmFuc2Zvcm0ud29ybGRQb3NpdGlvbiwgdGhpcy5leHBsb3Npb25SYWRpdXMpO1xuICAgICAgLy8gQXBwbHkgZGFtYWdlIHRvIGFueSBuZWFyYnkgR2FtZU9iamVjdHMgd2l0aCB0aGUgSGVhbHRoIGNvbXBvbmVudFxuICAgICAgaWYgKHRoaXMuY2F1c2VEYW1hZ2UpIHtcblxuICAgICAgICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xzKSB7XG4gICAgICAgICAgY29uc3QgZGFtYWdlQW1vdW50ID0gdGhpcy5kYW1hZ2UgKiAoMSAvIHRoaXMuZW50aXR5LnRyYW5zZm9ybS53b3JsZFBvc2l0aW9uLmRpc3RhbmNlVG8oY29sLmVudGl0eS50cmFuc2Zvcm0ud29ybGRQb3NpdGlvbikpO1xuXG4gICAgICAgICAgLy8g5aSE55CG5Y+X5Yiw5Lyk5a6zXG4gICAgICAgICAgaWYgKGNvbC5lbnRpdHkuZ2V0Q29tcG9uZW50PEhlYWx0aD4oSGVhbHRoKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBoZWFsdGggPSBjb2wuZW50aXR5LmdldENvbXBvbmVudDxIZWFsdGg+KEhlYWx0aCk7XG4gICAgICAgICAgICBoZWFsdGguQ2hhbmdlSGVhbHRoKGRhbWFnZUFtb3VudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyDlrrnnurPpmYTov5HliJrkvZPnmoTliJfooahcbiAgICAgIGNvbnN0IHJpZ2lkYm9kaWVzID0gbmV3IEFycmF5PGVuZ2luZS5SaWdpZGJvZHk+KCk7XG5cbiAgICAgIGZvciAoY29uc3QgY29sIG9mIGNvbHMpIHtcbiAgICAgICAgLy8g6I635Y+W6ZmE6L+R5Yia5L2T55qE5YiX6KGoXG4gICAgICAgIGlmIChjb2wuYXR0YWNoZWRSaWdpZGJvZHkgIT0gbnVsbCAmJiByaWdpZGJvZGllcy5pbmRleE9mKGNvbC5hdHRhY2hlZFJpZ2lkYm9keSkgPT0gLTEpIHtcbiAgICAgICAgICByaWdpZGJvZGllcy5wdXNoKGNvbC5hdHRhY2hlZFJpZ2lkYm9keSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmkYfliqjnm7jmnLrvvIzlpoLmnpzlroPmnInmjK/liqjnu4Tku7ZcbiAgICAgICAgLy8gaWYgKHRoaXMuc2hha2VDYW1lcmEgJiYgY29sLmVudGl0eS50cmFuc2Zvcm0uR2V0Q29tcG9uZW50SW5DaGlsZHJlbjxWaWJyYXRpb24+KCkgIT0gbnVsbCkge1xuICAgICAgICAvLyAgIGZsb2F0IHNoYWtlVmlvbGVuY2UgPSAxIC8gKFZlY3RvcjMuRGlzdGFuY2UodHJhbnNmb3JtLnBvc2l0aW9uLCBjb2wudHJhbnNmb3JtLnBvc2l0aW9uKSAqIGNhbWVyYVNoYWtlVmlvbGVuY2UpO1xuICAgICAgICAvLyAgIGNvbC50cmFuc2Zvcm0uR2V0Q29tcG9uZW50SW5DaGlsZHJlbjxWaWJyYXRpb24+KCkuU3RhcnRTaGFraW5nUmFuZG9tKC1zaGFrZVZpb2xlbmNlLCBzaGFrZVZpb2xlbmNlLCAtc2hha2VWaW9sZW5jZSwgc2hha2VWaW9sZW5jZSk7XG4gICAgICAgIC8vIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCByYiBvZiByaWdpZGJvZGllcykge1xuICAgICAgICByYi5BZGRFeHBsb3Npb25Gb3JjZSh0aGlzLmV4cGxvc2lvbkZvcmNlLCB0aGlzLmVudGl0eS50cmFuc2Zvcm0ud29ybGRQb3NpdGlvbiwgdGhpcy5leHBsb3Npb25SYWRpdXMsIDEsIGVuZ2luZS5Gb3JjZU1vZGUuSW1wdWxzZSk7XG4gICAgICB9XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIHByaXZhdGUgT3ZlcmxhcFNwaGVyZShwb3NpdGlvbjogZW5naW5lLlZlY3RvcjMsIHJhZGl1czogbnVtYmVyKTogZW5naW5lLkNvbGxpZGVyW10ge1xuICAgIGNvbnN0IE92ZXJsYXBTcGhlcmVzOiBlbmdpbmUuQ29sbGlkZXJbXSA9IFtdO1xuICAgIEV4cGxvc2lvbi5TZWFyY2goZGF0ZUNlbnRlci5TY2VuZU5vZGUpO1xuICAgIGZvciAoY29uc3QgaXRlcmF0b3Igb2YgRXhwbG9zaW9uLkNvbGxpZGVyQXJyeSkge1xuICAgICAgY29uc3QgZGlzdGFuY2UgPSBwb3NpdGlvbi5kaXN0YW5jZVRvKGl0ZXJhdG9yLnRyYW5zZm9ybS53b3JsZFBvc2l0aW9uKTtcbiAgICAgIGlmIChkaXN0YW5jZSA8PSByYWRpdXMpIHtcbiAgICAgICAgT3ZlcmxhcFNwaGVyZXMucHVzaChpdGVyYXRvci5nZXRDb21wb25lbnQoZW5naW5lLkNvbGxpZGVyKSk7XG4gICAgICB9XG4gICAgfVxuICAgIEV4cGxvc2lvbi5Db2xsaWRlckFycnkuc3BsaWNlKDAsIEV4cGxvc2lvbi5Db2xsaWRlckFycnkubGVuZ3RoKTtcbiAgICByZXR1cm4gT3ZlcmxhcFNwaGVyZXNcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgQ29sbGlkZXJBcnJ5OiBlbmdpbmUuRW50aXR5W10gPSBbXTtcblxuICBwcml2YXRlIHN0YXRpYyBTZWFyY2godGFyZ2V0Tm9kZTogZW5naW5lLkVudGl0eSk6IGVuZ2luZS5FbnRpdHkge1xuICAgIGlmICh0YXJnZXROb2RlLmdldENvbXBvbmVudDxlbmdpbmUuQ29sbGlkZXI+KGVuZ2luZS5Db2xsaWRlcikgIT0gbnVsbCkge1xuICAgICAgdGhpcy5Db2xsaWRlckFycnkucHVzaCh0YXJnZXROb2RlKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXJnZXROb2RlLnRyYW5zZm9ybS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hpbGQgPSB0YXJnZXROb2RlLnRyYW5zZm9ybS5jaGlsZHJlbltpXTtcbiAgICAgIGxldCByZXN1bHQgPSB0aGlzLlNlYXJjaChjaGlsZC5lbnRpdHkpO1xuICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuQ29sbGlkZXJBcnJ5LnB1c2gocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxufSJdfQ==
