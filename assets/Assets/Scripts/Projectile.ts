/// <summary>
/// Projectile.cs
/// 把这个脚本附加到投射预制件上。这包括火箭、导弹、迫击炮、榴弹发射器和许多其他武器。这个脚本可以处理查找导弹和爆炸的实例化等特性。
/// </summary>
import engine from "engine";
import Collision from "engine/game/physics/collision";
import { float, int } from "engine/type";
import EventCenter, { dateCenter } from "./eventCenter";

const enum ProjectileType {
  Standard,
  Seeker,
  ClusterBomb
}
const enum DamageType {
  Direct,
  Explosion
}

@engine.decorators.serialize("Projectile")
export default class Projectile extends engine.Script {

  @engine.decorators.property.enum({
    type: { 'Standard': 0, 'Seeker': 1, 'ClusterBomb': 2 },
    tooltips: '射弹类型'
  })
  public projectileType: ProjectileType = ProjectileType.Standard;		// 射弹类型-标准是一个笔直向前移动的射弹，探索者类型寻找带有指定标签的游戏对象

  @engine.decorators.property.enum({
    type: { 'Direct': 0, 'Explosion': 1, },
    tooltips: '伤害类型'
  })
  public damageType: DamageType = DamageType.Direct;					// 伤害类型-直接使用射弹造成的伤害，爆炸让一个实例化的爆炸处理伤害

  @engine.decorators.property({
    type: 'number',
    tooltips: '伤害值'
  })
  public damage: float = 100.0;									   	  // 适用的伤害值(仅适用于直接损害类型)

  @engine.decorators.property({
    type: 'number',
    tooltips: '炮弹移动速度'
  })
  public speed: float = 10.0;											    // 发射物移动的速度

  @engine.decorators.property({
    type: 'number',
  })
  public initialForce: float = 1000.0;								// 弹丸初始移动时所施加在弹丸上的速度力

  @engine.decorators.property({
    type: 'number',
  })
  public lifetime: float = 30.0;										  // 在炮弹被摧毁前的最大时间(以秒为单位)

  @engine.decorators.property({
    type: 'number',
  })
  public seekRate: float = 1.0;									   	  // 炮弹寻找敌人的速度

  @engine.decorators.property({
    type: 'string',
  })
  public seekName: string = 'barrel_1';								   	// 投射体将寻找带有这个标签的游戏对象

  @engine.decorators.property({
    type: engine.Prefab,
  })
  public explosion: engine.Prefab = null;										// 当这个炮弹击中某物时将被实例化的爆炸特效

  @engine.decorators.property({
    type: 'number',
  })
  public targetListUpdateRate: float = 1.0;							// 投射物将更新所有目标敌人列表的速率

  @engine.decorators.property({
    type: engine.Prefab,
  })
  public clusterBomb: engine.Prefab = null;										// 如果此炮弹是集束炸弹类型，则在爆炸上实例化的炸弹

  @engine.decorators.property({
    type: 'number',
  })
  public clusterBombNum: int = 6;										 // 要实例化的集束炸弹的数量

  private lifeTimer: float = 0.0;									  	// 计时器来跟踪这个抛物已经存在了多长时间
  private targetListUpdateTimer: float = 0.0;							// 计时器用于记录敌人列表上次更新后的时间
  private enemyList: engine.Entity[] = [];								// 存储可能目标的数组
  private _Rigidbody: engine.Rigidbody = null;
  private isBurst: boolean = false;

  public onAwake() {
    this._Rigidbody = this.entity.getComponent(engine.Rigidbody);
    this.initEvent();
  }

  public onStart() {
    // Initialize the enemy list
    this.UpdateEnemyList();

    // Add the initial force to rigidbody
    this._Rigidbody.addRelativeForce(engine.Vector3.createFromNumber(0, 0, this.initialForce), engine.ForceMode.Force);

    // 使抛射体移动
    if (this.initialForce == 0 && !this.entity.isDestroyed) {
      // 只有当初始力没有被用来推动抛射物
      const movement = engine.Vector3.createFromNumber(this.entity.transform.forward.x * this.speed * -1, this.entity.transform.forward.y * this.speed * -1, this.entity.transform.forward.z * this.speed * -1);
      this._Rigidbody.velocity = movement;
    }
  }

  public onUpdate(dt) {
    // Update the timer
    this.lifeTimer += dt;

    // 如果时间到了，并且弹丸没有爆炸就摧毁弹丸
    if (this.lifeTimer >= this.lifetime && !this.isBurst) {
      this.Explode(this.entity.transform.worldPosition);
      // this._Rigidbody.sleep();
      // // 销毁这个炮弹
      // const self = this;
      // let timeout = function () {
      //   self.entity.destroy();
      // }
      // setTimeout(timeout, 20)
    }

    //如果弹丸类型设置为Seeker，弹丸就会寻找附近的目标
    if (this.projectileType == ProjectileType.Seeker) {
      // Keep the timer updating
      this.targetListUpdateTimer += dt;

      // 如果targetListUpdateTimer达到targetListUpdateRate，更新敌人列表并重新启动计时器
      if (this.targetListUpdateTimer >= this.targetListUpdateRate) {
        this.UpdateEnemyList();
      }

      if (this.enemyList != null) {
        //选择一个要“寻找”或旋转的目标
        let greatestDotSoFar: float = 0;
        let target: engine.Vector3 = engine.Vector3.createFromNumber(this.entity.transform.forward.x * 1000, this.entity.transform.forward.y * 1000, this.entity.transform.forward.z * 1000);
        for (const enemy of this.enemyList) {
          if (enemy != null) {
            const direction: engine.Vector3 = enemy.transform.worldPosition.clone().sub(this.entity.transform.worldPosition.clone());
            const dot: float = direction.normalize().dot(this.entity.transform.forward);
            if (dot > greatestDotSoFar) {
              target = enemy.transform.worldPosition;
              greatestDotSoFar = dot;
            }
          }
        }

        // 旋转抛射体以注视目标
        const targetRotation: engine.Quaternion = engine.Quaternion.lookRotation(target.sub(this.entity.transform.worldPosition), this.entity.transform.up);
        this.entity.transform.quaternion = this.entity.transform.worldQuaternion.slerp(targetRotation, dt * this.seekRate);
      }
    }
  }

  private UpdateEnemyList() {
    this.enemyList = this.FindGameObjectsWithTag(this.seekName);
    this.targetListUpdateTimer = 0.0;
  }

  public onCollisionEnter(col: Collision) {
    // 如果弹丸与某物发生碰撞，就使炮弹爆炸
    const position = col.contacts[0].point.clone();
    this.Explode(position);

    // 如果damageType设置为直接，对命中的物体施加伤害
    if (this.damageType == DamageType.Direct) {
      EventCenter.emit("ChangeHealth", -this.damage);
    }
  }

  private Explode(position: engine.Vector3) {
    this.isBurst = true;
    // 实例化爆炸粒子特效
    if (this.explosion != null) {
      const exp = this.explosion.instantiate();
      exp.transform.worldPosition = position;
      //添加为场景根节点的子物体
      dateCenter.SceneNode.transform.addChild(exp.transform);
    }

    // 实例化 clusterBombNum 个 Cluster bombs
    // if (this.projectileType == ProjectileType.ClusterBomb) {
    //   if (this.clusterBomb != null) {
    //     for (let i = 0; i <= this.clusterBombNum; i++) {
    //       const cB = this.clusterBomb.instantiate();
    //       cB.transform.worldPosition = position;
    //       //添加为场景根节点的子物体
    //       dateCenter.SceneNode.transform.addChild(cB.transform);
    //     }
    //   }
    // }

    // 销毁这个炮弹
    const self = this;
    let timeout = function () {
      self.entity.destroy();
    }
    setTimeout(timeout, 20)

  }

  private initEvent() {
    // 修改此炮弹所能造成的伤害
    EventCenter.once(EventCenter.MultiplyDamage, (amount: number) => {
      this.damage *= amount;
    })
    // 修改初始力
    EventCenter.once(EventCenter.MultiplyInitialForce, (amount: number) => {
      this.initialForce *= amount;
    })
  }

  private FindGameObjectsWithTag(seekName: string): engine.Entity[] {
    const entityList: engine.Entity[] = [];
    const root = dateCenter.SceneNode.transform.findChildByName('environment').entity;
    for (let i = 0; i < root.transform.childrenCount; i++) {
      const element = root.transform.children[i].entity;
      if (element.name == seekName) {
        entityList.push(element);
      }
    }
    return entityList
  }
}