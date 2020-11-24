import engine from "engine";
import Collision from "engine/game/physics/collision";
import { dateCenter } from "./eventCenter";
@engine.decorators.serialize("BombFragment")
export default class BombFragment extends engine.Script {

  @engine.decorators.property({
    type: 'number',
  })
  public speed: number = 5.0;					// The speed at which this bomb fragment is propelled away from the initial explosion

  @engine.decorators.property({
    type: engine.Prefab,
  })
  public explosion: engine.Prefab = null;				// 爆炸预制件将被实例化，当这个炸弹碎片击中某物

  public onStart() {
    this.entity.getComponent<engine.Rigidbody>(engine.Rigidbody).rotationConstraints = new engine.BooleanVector3(true, true, true);
    this.entity.transform.rotate(engine.Vector3.createFromNumber(this.random(-180, 180), this.random(-180, 180), this.random(-180, 180)));
  }
  public onUpdate(dt) {
    this.entity.transform.position = this.entity.transform.position.add(engine.Vector3.createFromNumber(0, 0, this.speed * dt));
  }
  public onCollisionEnter(col: Collision) {
    // 使炮弹爆炸
    if (col.collider.entity.getComponent<BombFragment>(BombFragment) == null) {
      // 只有当碰撞不是与另一个炸弹碎片碰撞时才会爆炸
      this.Explode(col.contacts[0].point.clone());
    }
  }

  private Explode(position: engine.Vector3) {
    // Instantiate the explosion
    if (this.explosion != null) {
      const exp = this.explosion.instantiate();
      exp.transform.worldPosition = position;
      dateCenter.SceneNode.transform.addChild(exp.transform);
    }
    

    // Destroy this projectile
    const self = this;
    let timeout = function () {
      self.entity.destroy();
    }
    setTimeout(timeout, 20)

  }

  private random(min: number, max: number): number {
    let vaer: number = Math.random() * (max - min) + min;
    return parseFloat(vaer.toFixed(2))
  }
}