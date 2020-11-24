import engine from "engine";
import { float } from "engine/type";
import { dateCenter } from "./eventCenter";
import Health from "./Health";
@engine.decorators.serialize("Explosion")
export default class Explosion extends engine.Script {

  @engine.decorators.property({
    type: 'boolean',
  })
  public shooterAISupport: boolean = false;		// 使兼容射击AI的网关游戏

  @engine.decorators.property({
    type: 'number',
  })
  public explosionForce: float = 5.0;			// The force with which nearby objects will be blasted outwards

  @engine.decorators.property({
    type: 'number',
  })
  public explosionRadius: float = 10.0;		// The radius of the explosion

  @engine.decorators.property({
    type: 'boolean',
  })
  public shakeCamera: boolean = true;				// Give camera shaking effects to nearby cameras that have the vibration component

  @engine.decorators.property({
    type: 'number',
  })
  public cameraShakeViolence: float = 0.5;	// The violence of the camera shake effect

  @engine.decorators.property({
    type: 'boolean',
  })
  public causeDamage: boolean = true;				// Whether or not the explosion should apply damage to nearby GameObjects with the Heatlh component

  @engine.decorators.property({
    type: 'number',
  })
  public damage: float = 10.0;				// The multiplier by which the ammount of damage to be applied is determined

  @engine.decorators.property({
    type: engine.Prefab,
  })
  public PHY: engine.Prefab

  public onStart() {
    let timeout = setTimeout(() => {
      // 附近碰撞器的数组
      const cols = this.OverlapSphere(this.entity.transform.worldPosition, this.explosionRadius);
      // Apply damage to any nearby GameObjects with the Health component
      if (this.causeDamage) {

        for (const col of cols) {
          const damageAmount = this.damage * (1 / this.entity.transform.worldPosition.distanceTo(col.entity.transform.worldPosition));

          // 处理受到伤害
          if (col.entity.getComponent<Health>(Health) != null) {
            const health = col.entity.getComponent<Health>(Health);
            health.ChangeHealth(damageAmount);
          }
        }
      }
      // 容纳附近刚体的列表
      const rigidbodies = new Array<engine.Rigidbody>();

      for (const col of cols) {
        // 获取附近刚体的列表
        if (col.attachedRigidbody != null && rigidbodies.indexOf(col.attachedRigidbody) == -1) {
          rigidbodies.push(col.attachedRigidbody);
        }

        // 摇动相机，如果它有振动组件
        // if (this.shakeCamera && col.entity.transform.GetComponentInChildren<Vibration>() != null) {
        //   float shakeViolence = 1 / (Vector3.Distance(transform.position, col.transform.position) * cameraShakeViolence);
        //   col.transform.GetComponentInChildren<Vibration>().StartShakingRandom(-shakeViolence, shakeViolence, -shakeViolence, shakeViolence);
        // }
      }

      for (const rb of rigidbodies) {
        rb.AddExplosionForce(this.explosionForce, this.entity.transform.worldPosition, this.explosionRadius, 1, engine.ForceMode.Impulse);
      }
      clearTimeout(timeout);
    }, 100);
  }

  private OverlapSphere(position: engine.Vector3, radius: number): engine.Collider[] {
    const OverlapSpheres: engine.Collider[] = [];
    Explosion.Search(dateCenter.SceneNode);
    for (const iterator of Explosion.ColliderArry) {
      const distance = position.distanceTo(iterator.transform.worldPosition);
      if (distance <= radius) {
        OverlapSpheres.push(iterator.getComponent(engine.Collider));
      }
    }
    Explosion.ColliderArry.splice(0, Explosion.ColliderArry.length);
    return OverlapSpheres
  }

  public static ColliderArry: engine.Entity[] = [];

  private static Search(targetNode: engine.Entity): engine.Entity {
    if (targetNode.getComponent<engine.Collider>(engine.Collider) != null) {
      this.ColliderArry.push(targetNode);
    }
    for (let i = 0; i < targetNode.transform.children.length; i++) {
      const child = targetNode.transform.children[i];
      let result = this.Search(child.entity);
      if (result != null) {
        this.ColliderArry.push(result);
      }
    }
    return null;
  }

}