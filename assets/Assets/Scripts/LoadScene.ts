import engine from "engine";
@engine.decorators.serialize("LoadScene")
export default class LoadScene extends engine.Script {
  public onStart() {
    const self = this;
    setTimeout(() => {
      engine.loader.load("resource/newdemo3d.scene", { useFrameSystem: false }).promise.then(function (scene: engine.Scene) {
        engine.game.playScene(scene);
        self.entity.transform2D.parent.entity.transform2D.children[1].active = true;
        self.entity.transform2D.parent.entity.transform2D.children[2].active = true;
        self.entity.transform2D.parent.entity.transform2D.children[3].active = true;
        self.entity.active = false;
      }).catch(function (error) {
        console.error('Fail to load scenes.', error.message, error.stack);
      });
    }, 3000);
  }
}