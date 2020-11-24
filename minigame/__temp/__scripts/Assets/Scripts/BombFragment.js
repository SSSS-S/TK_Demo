"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var eventCenter_1 = require("./eventCenter");
var BombFragment = (function (_super) {
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
        var timeout = function () {
            self.entity.destroy();
        };
        setTimeout(timeout, 20);
    };
    BombFragment.prototype.random = function (min, max) {
        var vaer = Math.random() * (max - min) + min;
        return parseFloat(vaer.toFixed(2));
    };
    var BombFragment_1;
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], BombFragment.prototype, "speed", void 0);
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: engine_1.default.Prefab,
        })
    ], BombFragment.prototype, "explosion", void 0);
    BombFragment = BombFragment_1 = tslib_1.__decorate([
        engine_1.default.decorators.serialize("BombFragment")
    ], BombFragment);
    return BombFragment;
}(engine_1.default.Script));
exports.default = BombFragment;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFzc2V0cy9TY3JpcHRzL0JvbWJGcmFnbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBNEI7QUFFNUIsNkNBQTJDO0FBRTNDO0lBQTBDLHdDQUFhO0lBQXZEO1FBQUEscUVBaURDO1FBNUNRLFdBQUssR0FBVyxHQUFHLENBQUM7UUFLcEIsZUFBUyxHQUFrQixJQUFJLENBQUM7O0lBdUN6QyxDQUFDO3FCQWpEb0IsWUFBWTtJQVl4Qiw4QkFBTyxHQUFkO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQW1CLGdCQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9ILElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEksQ0FBQztJQUNNLCtCQUFRLEdBQWYsVUFBZ0IsRUFBRTtRQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5SCxDQUFDO0lBQ00sdUNBQWdCLEdBQXZCLFVBQXdCLEdBQWM7UUFFcEMsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQWUsY0FBWSxDQUFDLElBQUksSUFBSSxFQUFFO1lBRXhFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUM3QztJQUNILENBQUM7SUFFTyw4QkFBTyxHQUFmLFVBQWdCLFFBQXdCO1FBRXRDLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7WUFDMUIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QyxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUM7WUFDdkMsd0JBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDeEQ7UUFJRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxPQUFPLEdBQUc7WUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hCLENBQUMsQ0FBQTtRQUNELFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFFekIsQ0FBQztJQUVPLDZCQUFNLEdBQWQsVUFBZSxHQUFXLEVBQUUsR0FBVztRQUNyQyxJQUFJLElBQUksR0FBVyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3JELE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNwQyxDQUFDOztJQTNDRDtRQUhDLGdCQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztZQUMxQixJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7K0NBQ3lCO0lBSzNCO1FBSEMsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1lBQzFCLElBQUksRUFBRSxnQkFBTSxDQUFDLE1BQU07U0FDcEIsQ0FBQzttREFDcUM7SUFWcEIsWUFBWTtRQURoQyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO09BQ3ZCLFlBQVksQ0FpRGhDO0lBQUQsbUJBQUM7Q0FqREQsQUFpREMsQ0FqRHlDLGdCQUFNLENBQUMsTUFBTSxHQWlEdEQ7a0JBakRvQixZQUFZIiwiZmlsZSI6IkFzc2V0cy9TY3JpcHRzL0JvbWJGcmFnbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlbmdpbmUgZnJvbSBcImVuZ2luZVwiO1xuaW1wb3J0IENvbGxpc2lvbiBmcm9tIFwiZW5naW5lL2dhbWUvcGh5c2ljcy9jb2xsaXNpb25cIjtcbmltcG9ydCB7IGRhdGVDZW50ZXIgfSBmcm9tIFwiLi9ldmVudENlbnRlclwiO1xuQGVuZ2luZS5kZWNvcmF0b3JzLnNlcmlhbGl6ZShcIkJvbWJGcmFnbWVudFwiKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9tYkZyYWdtZW50IGV4dGVuZHMgZW5naW5lLlNjcmlwdCB7XG5cbiAgQGVuZ2luZS5kZWNvcmF0b3JzLnByb3BlcnR5KHtcbiAgICB0eXBlOiAnbnVtYmVyJyxcbiAgfSlcbiAgcHVibGljIHNwZWVkOiBudW1iZXIgPSA1LjA7XHRcdFx0XHRcdC8vIFRoZSBzcGVlZCBhdCB3aGljaCB0aGlzIGJvbWIgZnJhZ21lbnQgaXMgcHJvcGVsbGVkIGF3YXkgZnJvbSB0aGUgaW5pdGlhbCBleHBsb3Npb25cblxuICBAZW5naW5lLmRlY29yYXRvcnMucHJvcGVydHkoe1xuICAgIHR5cGU6IGVuZ2luZS5QcmVmYWIsXG4gIH0pXG4gIHB1YmxpYyBleHBsb3Npb246IGVuZ2luZS5QcmVmYWIgPSBudWxsO1x0XHRcdFx0Ly8g54iG54K46aKE5Yi25Lu25bCG6KKr5a6e5L6L5YyW77yM5b2T6L+Z5Liq54K45by556KO54mH5Ye75Lit5p+Q54mpXG5cbiAgcHVibGljIG9uU3RhcnQoKSB7XG4gICAgdGhpcy5lbnRpdHkuZ2V0Q29tcG9uZW50PGVuZ2luZS5SaWdpZGJvZHk+KGVuZ2luZS5SaWdpZGJvZHkpLnJvdGF0aW9uQ29uc3RyYWludHMgPSBuZXcgZW5naW5lLkJvb2xlYW5WZWN0b3IzKHRydWUsIHRydWUsIHRydWUpO1xuICAgIHRoaXMuZW50aXR5LnRyYW5zZm9ybS5yb3RhdGUoZW5naW5lLlZlY3RvcjMuY3JlYXRlRnJvbU51bWJlcih0aGlzLnJhbmRvbSgtMTgwLCAxODApLCB0aGlzLnJhbmRvbSgtMTgwLCAxODApLCB0aGlzLnJhbmRvbSgtMTgwLCAxODApKSk7XG4gIH1cbiAgcHVibGljIG9uVXBkYXRlKGR0KSB7XG4gICAgdGhpcy5lbnRpdHkudHJhbnNmb3JtLnBvc2l0aW9uID0gdGhpcy5lbnRpdHkudHJhbnNmb3JtLnBvc2l0aW9uLmFkZChlbmdpbmUuVmVjdG9yMy5jcmVhdGVGcm9tTnVtYmVyKDAsIDAsIHRoaXMuc3BlZWQgKiBkdCkpO1xuICB9XG4gIHB1YmxpYyBvbkNvbGxpc2lvbkVudGVyKGNvbDogQ29sbGlzaW9uKSB7XG4gICAgLy8g5L2/54Ku5by554iG54K4XG4gICAgaWYgKGNvbC5jb2xsaWRlci5lbnRpdHkuZ2V0Q29tcG9uZW50PEJvbWJGcmFnbWVudD4oQm9tYkZyYWdtZW50KSA9PSBudWxsKSB7XG4gICAgICAvLyDlj6rmnInlvZPnorDmkp7kuI3mmK/kuI7lj6bkuIDkuKrngrjlvLnnoo7niYfnorDmkp7ml7bmiY3kvJrniIbngrhcbiAgICAgIHRoaXMuRXhwbG9kZShjb2wuY29udGFjdHNbMF0ucG9pbnQuY2xvbmUoKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBFeHBsb2RlKHBvc2l0aW9uOiBlbmdpbmUuVmVjdG9yMykge1xuICAgIC8vIEluc3RhbnRpYXRlIHRoZSBleHBsb3Npb25cbiAgICBpZiAodGhpcy5leHBsb3Npb24gIT0gbnVsbCkge1xuICAgICAgY29uc3QgZXhwID0gdGhpcy5leHBsb3Npb24uaW5zdGFudGlhdGUoKTtcbiAgICAgIGV4cC50cmFuc2Zvcm0ud29ybGRQb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgZGF0ZUNlbnRlci5TY2VuZU5vZGUudHJhbnNmb3JtLmFkZENoaWxkKGV4cC50cmFuc2Zvcm0pO1xuICAgIH1cbiAgICBcblxuICAgIC8vIERlc3Ryb3kgdGhpcyBwcm9qZWN0aWxlXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgbGV0IHRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLmVudGl0eS5kZXN0cm95KCk7XG4gICAgfVxuICAgIHNldFRpbWVvdXQodGltZW91dCwgMjApXG5cbiAgfVxuXG4gIHByaXZhdGUgcmFuZG9tKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgbGV0IHZhZXI6IG51bWJlciA9IE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWVyLnRvRml4ZWQoMikpXG4gIH1cbn0iXX0=
