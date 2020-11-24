"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var engine_1 = require("engine");
var LoadScene = (function (_super) {
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
    LoadScene = tslib_1.__decorate([
        engine_1.default.decorators.serialize("LoadScene")
    ], LoadScene);
    return LoadScene;
}(engine_1.default.Script));
exports.default = LoadScene;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFzc2V0cy9TY3JpcHRzL0xvYWRTY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBNEI7QUFFNUI7SUFBdUMscUNBQWE7SUFBcEQ7O0lBZUEsQ0FBQztJQWRRLDJCQUFPLEdBQWQ7UUFDRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsVUFBVSxDQUFDO1lBQ1QsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQW1CO2dCQUNsSCxnQkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQzVFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUM3QixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLO2dCQUN0QixPQUFPLENBQUMsS0FBSyxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BFLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQWRrQixTQUFTO1FBRDdCLGdCQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7T0FDcEIsU0FBUyxDQWU3QjtJQUFELGdCQUFDO0NBZkQsQUFlQyxDQWZzQyxnQkFBTSxDQUFDLE1BQU0sR0FlbkQ7a0JBZm9CLFNBQVMiLCJmaWxlIjoiQXNzZXRzL1NjcmlwdHMvTG9hZFNjZW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVuZ2luZSBmcm9tIFwiZW5naW5lXCI7XG5AZW5naW5lLmRlY29yYXRvcnMuc2VyaWFsaXplKFwiTG9hZFNjZW5lXCIpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkU2NlbmUgZXh0ZW5kcyBlbmdpbmUuU2NyaXB0IHtcbiAgcHVibGljIG9uU3RhcnQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBlbmdpbmUubG9hZGVyLmxvYWQoXCJyZXNvdXJjZS9uZXdkZW1vM2Quc2NlbmVcIiwgeyB1c2VGcmFtZVN5c3RlbTogZmFsc2UgfSkucHJvbWlzZS50aGVuKGZ1bmN0aW9uIChzY2VuZTogZW5naW5lLlNjZW5lKSB7XG4gICAgICAgIGVuZ2luZS5nYW1lLnBsYXlTY2VuZShzY2VuZSk7XG4gICAgICAgIHNlbGYuZW50aXR5LnRyYW5zZm9ybTJELnBhcmVudC5lbnRpdHkudHJhbnNmb3JtMkQuY2hpbGRyZW5bMV0uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5lbnRpdHkudHJhbnNmb3JtMkQucGFyZW50LmVudGl0eS50cmFuc2Zvcm0yRC5jaGlsZHJlblsyXS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICBzZWxmLmVudGl0eS50cmFuc2Zvcm0yRC5wYXJlbnQuZW50aXR5LnRyYW5zZm9ybTJELmNoaWxkcmVuWzNdLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHNlbGYuZW50aXR5LmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWwgdG8gbG9hZCBzY2VuZXMuJywgZXJyb3IubWVzc2FnZSwgZXJyb3Iuc3RhY2spO1xuICAgICAgfSk7XG4gICAgfSwgMzAwMCk7XG4gIH1cbn0iXX0=
