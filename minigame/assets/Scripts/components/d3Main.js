"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var collider_1 = require("../commons/collider");
var dataCenter_1 = require("../commons/dataCenter");
var d3Enemy_1 = require("./d3Enemy");
var d3Player_1 = require("./d3Player");
var ENEMY_INTERVAL = 0.5;
var randomBetween = function (min, max) {
    return Math.random() * (max - min) + min;
};
var D3Main = (function (_super) {
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
    D3Main = tslib_1.__decorate([
        engine_1.default.decorators.serialize("D3Main")
    ], D3Main);
    return D3Main;
}(engine_1.default.Script));
exports.default = D3Main;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcmlwdHMvY29tcG9uZW50cy9kM01haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQTRCO0FBQzVCLGdEQUEyQztBQUMzQyxvREFBK0M7QUFDL0MscUNBQWdDO0FBQ2hDLHVDQUFrQztBQUVsQyxJQUFNLGNBQWMsR0FBRyxHQUFHLENBQUM7QUFDM0IsSUFBTSxhQUFhLEdBQUcsVUFBQyxHQUFHLEVBQUUsR0FBRztJQUM3QixPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDM0MsQ0FBQyxDQUFDO0FBR0Y7SUFBb0Msa0NBQWE7SUFBakQ7UUFBQSxxRUE0REM7UUEzRFEsV0FBSyxHQUF5QixJQUFJLENBQUM7UUFDbkMsZUFBUyxHQUFXLENBQUMsQ0FBQztRQUN0QixpQkFBVyxHQUF5QixJQUFJLENBQUM7O0lBeURsRCxDQUFDO0lBdkRRLHdCQUFPLEdBQWQ7UUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2pELG9CQUFVLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFcEMsa0JBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLGtCQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFTSx5QkFBUSxHQUFmLFVBQWdCLEVBQVU7UUFDeEIsa0JBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7UUFDckIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLGNBQWMsRUFBRTtZQUNwQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUM7U0FDbEM7SUFDSCxDQUFDO0lBRU0sMkJBQVUsR0FBakI7UUFBQSxpQkFRQztRQVBDLGdCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBZ0IsMEJBQTBCLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBTTtZQUNoRixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDcEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxrQkFBUSxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLEtBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sMEJBQVMsR0FBaEI7UUFBQSxpQkFJQztRQUhDLGdCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBZ0IseUJBQXlCLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBTTtZQUMvRSxLQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSx5QkFBUSxHQUFmO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsT0FBTztTQUNSO1FBQ0QsSUFBSSxpQkFBTyxDQUFDLFVBQVUsSUFBSSxFQUFFLEVBQUU7WUFDNUIsT0FBTztTQUNSO1FBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM5QyxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLGlCQUFPLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBR3RELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEQsaUJBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUV2QixDQUFDO0lBM0RrQixNQUFNO1FBRDFCLGdCQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7T0FDakIsTUFBTSxDQTREMUI7SUFBRCxhQUFDO0NBNURELEFBNERDLENBNURtQyxnQkFBTSxDQUFDLE1BQU0sR0E0RGhEO2tCQTVEb0IsTUFBTSIsImZpbGUiOiJTY3JpcHRzL2NvbXBvbmVudHMvZDNNYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVuZ2luZSBmcm9tIFwiZW5naW5lXCI7XG5pbXBvcnQgQ29sbGlkZXIgZnJvbSBcIi4uL2NvbW1vbnMvY29sbGlkZXJcIjtcbmltcG9ydCBEYXRhQ2VudGVyIGZyb20gXCIuLi9jb21tb25zL2RhdGFDZW50ZXJcIjtcbmltcG9ydCBEM0VuZW15IGZyb20gXCIuL2QzRW5lbXlcIjtcbmltcG9ydCBEM1BsYXllciBmcm9tIFwiLi9kM1BsYXllclwiO1xuXG5jb25zdCBFTkVNWV9JTlRFUlZBTCA9IDAuNTtcbmNvbnN0IHJhbmRvbUJldHdlZW4gPSAobWluLCBtYXgpID0+IHtcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcbn07XG5cbkBlbmdpbmUuZGVjb3JhdG9ycy5zZXJpYWxpemUoXCJEM01haW5cIilcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEQzTWFpbiBleHRlbmRzIGVuZ2luZS5TY3JpcHQge1xuICBwdWJsaWMgd29ybGQ6IG51bGwgfCBlbmdpbmUuRW50aXR5ID0gbnVsbDsgLy8gd29ybGQgZW50aXR5XG4gIHB1YmxpYyBlbmVteVRpbWU6IG51bWJlciA9IDA7XG4gIHB1YmxpYyBlbmVteVByZWZhYjogZW5naW5lLlByZWZhYiB8IG51bGwgPSBudWxsO1xuXG4gIHB1YmxpYyBvbkF3YWtlKCkge1xuICAgIGNvbnNvbGUubG9nKFwib25Bd2FrZSBEM01haW5cIik7XG4gICAgdGhpcy53b3JsZCA9IHRoaXMuZW50aXR5LnRyYW5zZm9ybS5wYXJlbnQuZW50aXR5O1xuICAgIERhdGFDZW50ZXIud29ybGRFbnRpdHkgPSB0aGlzLndvcmxkO1xuXG4gICAgQ29sbGlkZXIud2F0Y2hHcm91cChcImVuZW15XCIsIFwicGxheWVyXCIpO1xuICAgIENvbGxpZGVyLndhdGNoR3JvdXAoXCJlbmVteVwiLCBcImJ1bGxldFwiKTtcblxuICAgIHRoaXMuaW5pdFBsYXllcigpO1xuICAgIHRoaXMuaW5pdEVuZW15KCk7XG4gIH1cblxuICBwdWJsaWMgb25VcGRhdGUoZHQ6IG51bWJlcikge1xuICAgIENvbGxpZGVyLm9uVXBkYXRlKGR0KTtcbiAgICB0aGlzLmVuZW15VGltZSArPSBkdDtcbiAgICBpZiAodGhpcy5lbmVteVRpbWUgPj0gRU5FTVlfSU5URVJWQUwpIHtcbiAgICAgIHRoaXMuYWRkRW5lbXkoKTtcbiAgICAgIHRoaXMuZW5lbXlUaW1lIC09IEVORU1ZX0lOVEVSVkFMO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbml0UGxheWVyKCkge1xuICAgIGVuZ2luZS5sb2FkZXIubG9hZDxlbmdpbmUuUHJlZmFiPihcInJlc291cmNlL0FpcmNyYWZ0LnByZWZhYlwiKS5wcm9taXNlLnRoZW4oKHByZWZhYikgPT4ge1xuICAgICAgY29uc3QgZW50aXR5ID0gcHJlZmFiLmluc3RhbnRpYXRlKCk7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KEQzUGxheWVyKTtcbiAgICAgIGVudGl0eS50cmFuc2Zvcm0ucG9zaXRpb24ueSArPSAxO1xuICAgICAgZW50aXR5LnRyYW5zZm9ybS5wb3NpdGlvbi56ID0gODtcbiAgICAgIHRoaXMud29ybGQudHJhbnNmb3JtLmFkZENoaWxkKGVudGl0eS50cmFuc2Zvcm0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGluaXRFbmVteSgpIHtcbiAgICBlbmdpbmUubG9hZGVyLmxvYWQ8ZW5naW5lLlByZWZhYj4oXCJyZXNvdXJjZS9FbmVteTAxLnByZWZhYlwiKS5wcm9taXNlLnRoZW4oKHByZWZhYikgPT4ge1xuICAgICAgdGhpcy5lbmVteVByZWZhYiA9IHByZWZhYjtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRFbmVteSgpIHtcbiAgICBpZiAoIXRoaXMuZW5lbXlQcmVmYWIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKEQzRW5lbXkuZW5lbXlDb3VudCA+PSAyMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmVuZW15UHJlZmFiLmluc3RhbnRpYXRlKCk7XG4gICAgY29uc3Qgc2NyaXB0ID0gZW50aXR5LmFkZENvbXBvbmVudChEM0VuZW15KTtcbiAgICBlbnRpdHkudHJhbnNmb3JtLnBvc2l0aW9uLnggPSByYW5kb21CZXR3ZWVuKC0yNiwgMjYpO1xuICAgIGVudGl0eS50cmFuc2Zvcm0ucG9zaXRpb24ueSArPSAxO1xuICAgIGVudGl0eS50cmFuc2Zvcm0ucG9zaXRpb24ueiA9IHJhbmRvbUJldHdlZW4oLTUwLCAtMjApO1xuICAgIC8vIGVudGl0eS50cmFuc2Zvcm0ucG9zaXRpb24ueCA9IHJhbmRvbUJldHdlZW4oLTEwLCAxMCk7XG4gICAgLy8gZW50aXR5LnRyYW5zZm9ybS5wb3NpdGlvbi56ID0gcmFuZG9tQmV0d2VlbigxMCwgMSk7XG4gICAgdGhpcy53b3JsZC50cmFuc2Zvcm0uYWRkQ2hpbGQoZW50aXR5LnRyYW5zZm9ybSk7XG4gICAgRDNFbmVteS5lbmVteUNvdW50Kys7XG4gICAgLy8gY29uc29sZS5sb2coJ0FkZCBFbmVteScsIEQzRW5lbXkuZW5lbXlDb3VudCk7XG4gIH1cbn1cbiJdfQ==
