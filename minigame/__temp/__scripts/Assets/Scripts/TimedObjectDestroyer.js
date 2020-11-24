"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var TimedObjectDestroyer = (function (_super) {
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
    tslib_1.__decorate([
        engine_1.default.decorators.property({
            type: 'number',
        })
    ], TimedObjectDestroyer.prototype, "lifeTime", void 0);
    TimedObjectDestroyer = tslib_1.__decorate([
        engine_1.default.decorators.serialize("TimedObjectDestroyer")
    ], TimedObjectDestroyer);
    return TimedObjectDestroyer;
}(engine_1.default.Script));
exports.default = TimedObjectDestroyer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFzc2V0cy9TY3JpcHRzL1RpbWVkT2JqZWN0RGVzdHJveWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLGlDQUE0QjtBQUc1QjtJQUFrRCxnREFBYTtJQUEvRDtRQUFBLHFFQWFDO1FBUlEsY0FBUSxHQUFVLElBQUksQ0FBQzs7SUFRaEMsQ0FBQztJQU5RLHNDQUFPLEdBQWQ7UUFBQSxpQkFLQztRQUpDLElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQztZQUN2QixLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3RCLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QixDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBUEQ7UUFIQyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDMUIsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDOzBEQUM0QjtJQUxYLG9CQUFvQjtRQUR4QyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUM7T0FDL0Isb0JBQW9CLENBYXhDO0lBQUQsMkJBQUM7Q0FiRCxBQWFDLENBYmlELGdCQUFNLENBQUMsTUFBTSxHQWE5RDtrQkFib0Isb0JBQW9CIiwiZmlsZSI6IkFzc2V0cy9TY3JpcHRzL1RpbWVkT2JqZWN0RGVzdHJveWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxzdW1tYXJ5PlxuLy8vIFRpbWVkT2JqZWN0RGVzdHJveWVyLmNzXG4vLy8g6L+Z5Liq6ISa5pys5Zyo55Sf5ZG95ZGo5pyf5Y+Y6YeP5Lit5oyH5a6a55qE56eS5pWw5LmL5ZCO6ZSA5q+B5ri45oiP5a+56LGh44CC55So5LqO54iG54K45ZKM54Gr566t44CCXG4vLy8gPC9zdW1tYXJ5PlxuaW1wb3J0IGVuZ2luZSBmcm9tIFwiZW5naW5lXCI7XG5pbXBvcnQgeyBmbG9hdCB9IGZyb20gXCJlbmdpbmUvdHlwZVwiO1xuQGVuZ2luZS5kZWNvcmF0b3JzLnNlcmlhbGl6ZShcIlRpbWVkT2JqZWN0RGVzdHJveWVyXCIpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZE9iamVjdERlc3Ryb3llciBleHRlbmRzIGVuZ2luZS5TY3JpcHQge1xuXG4gIEBlbmdpbmUuZGVjb3JhdG9ycy5wcm9wZXJ0eSh7XG4gICAgdHlwZTogJ251bWJlcicsXG4gIH0pXG4gIHB1YmxpYyBsaWZlVGltZTogZmxvYXQgPSAxMC4wO1xuXG4gIHB1YmxpYyBvblN0YXJ0KCkge1xuICAgIGxldCB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmVudGl0eS5kZXN0cm95KCk7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfSwgdGhpcy5saWZlVGltZSAqIDEwMDApO1xuICB9XG59Il19
