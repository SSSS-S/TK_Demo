/// <summary>
/// TimedObjectDestroyer.cs
/// 这个脚本在生命周期变量中指定的秒数之后销毁游戏对象。用于爆炸和火箭。
/// </summary>
import engine from "engine";
import { float } from "engine/type";
@engine.decorators.serialize("TimedObjectDestroyer")
export default class TimedObjectDestroyer extends engine.Script {

  @engine.decorators.property({
    type: 'number',
  })
  public lifeTime: float = 10.0;

  public onStart() {
    let timeout = setTimeout(() => {
      this.entity.destroy();
      clearTimeout(timeout);
    }, this.lifeTime * 1000);
  }
}