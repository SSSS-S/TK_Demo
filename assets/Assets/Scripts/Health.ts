import engine from "engine";
import EventCenter, { dateCenter } from "./eventCenter";
@engine.decorators.serialize("Health")
export default class Health extends engine.Script {

  @engine.decorators.property({
    type: 'boolean',
  })
  public canDie: boolean = true;                  // 这种健康是否会死亡

  @engine.decorators.property({
    type: 'number',
  })
  public startingHealth: number = 100;       // 起始健康值

  @engine.decorators.property({
    type: 'number',
  })
  public maxHealth: number = 100;            // 最大健康值

  private currentHealth: number = 0;                // 他目前的健康状况

  @engine.decorators.property({
    type: 'boolean',
  })
  public replaceWhenDead: boolean = false;        // 是否应该实例化死替换。(对于破碎/粉碎/爆炸效果很有用)

  @engine.decorators.property({
    type: engine.Prefab,
  })
  public deadReplacement: engine.Prefab = null;          // 当游戏对象死亡时实例化的物体预制件

  @engine.decorators.property({
    type: 'boolean',
  })
  public makeExplosion: boolean = false;          // 是否应该实例化一个爆炸特效预制件

  @engine.decorators.property({
    type: engine.Prefab,
  })
  public explosion: engine.Prefab = null;                // 要实例化的物体爆炸特效预制件

  @engine.decorators.property({
    type: 'boolean',
  })
  public isPlayer: boolean = false;               // 玩家的健康与否

  @engine.decorators.property({
    type: engine.Transform3D,
  })
  public deathCam: engine.Transform3D = null;                 // 当玩家死亡时，相机将启动

  private dead: boolean = false;                  // 用于确保Die()函数不会被调用两次

  public onAwake() {

  }
  public ChangeHealth(amount: number) {
    // 按amount变量中指定的值更改健康状况
    this.currentHealth -= amount;

    // 如果健康耗尽，调用Die()进入死亡状态
    if (this.currentHealth <= 0 && !this.dead && this.canDie)
      this.Die();

    // 确保健康状况永远不会超过最大健康状况
    else if (this.currentHealth > this.maxHealth)
      this.currentHealth = this.maxHealth;
  }

  public Die() {
    // 这个游戏对象正式死亡了。这用于确保Die()函数不会被再次调用
    this.dead = true;

    // 死亡时的特效
    if (this.replaceWhenDead) {
      const dead = this.deadReplacement.instantiate();
      dateCenter.SceneNode.transform.addChild(dead.transform);
      dead.transform.worldPosition = this.entity.transform.worldPosition;
      dead.transform.quaternion = this.entity.transform.worldQuaternion;
    }

    if (this.makeExplosion) {
      const exp = this.explosion.instantiate();
      dateCenter.SceneNode.transform.addChild(exp.transform);
      exp.transform.worldPosition = this.entity.transform.worldPosition;
      exp.transform.quaternion = this.entity.transform.worldQuaternion;
    }

    if (this.isPlayer && this.deathCam != null)
      this.deathCam.active = true;

    // 将此物体从场景中销毁
    const self = this;
    let timeout = function () {
      self.entity.destroy();
    }
    setTimeout(timeout, 20)
  }

  public onStart() {
    this.currentHealth = this.startingHealth;
  }

}