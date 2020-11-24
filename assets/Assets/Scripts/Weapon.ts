import engine from "engine";
import { float } from "engine/type";
import EventCenter, { dateCenter } from "./eventCenter";

const enum WeaponType {
	Projectile,
	Raycast,
	Beam
}
const enum Auto {
	Full,
	Semi
}

@engine.decorators.serialize("Weapon")
export default class Weapon extends engine.Script {
	// 武器类型
	@engine.decorators.property.enum({
		type: { 'Projectile': 0, 'Raycast': 1, 'Beam': 2 },
		tooltips: '武器类型'
	})
	public type: WeaponType = WeaponType.Projectile;     // 使用的是哪种武器系统

	// Auto
	@engine.decorators.property.enum({
		type: { 'Full': 0, 'Semi': 1 },
		tooltips: '半自动和全自动'
	})
	public auto: Auto = Auto.Full;						// 这种武器是如何开火的——半自动还是全自动

	// General
	@engine.decorators.property({
		type: 'boolean',
		tooltips: '是否玩家'
	})
	public playerWeapon: boolean = true;					// 这是否是玩家的武器，还是AI的武器

	@engine.decorators.property({
		type: engine.Transform3D,
		tooltips: '武器模型的实体'
	})
	public weaponModels: engine.Transform3D = null;						// 这个武器模型的实体
	private weaponModel: engine.Entity = null;
	private originalPoint: engine.Vector3 = null;             //武器模型的初始坐标，用于后座力恢复
	private originalQua: engine.Quaternion = null;            //武器模型的初始旋转，用于后座力恢复

	// Warmup
	public warmup: boolean = false;						// 射击前是否允许“蓄力”-当玩家长时间按住射击按钮时，允许能量增加，这只适用于半自动光线投射和投射武器
	public maxWarmup: float = 2.0;						// 蓄力的最长时间可以对力量产生任何影响，等等。
	public multiplyForce: boolean = true;					//弹丸的初始力是否应该根据蓄力值乘以-仅对弹丸适用
	public multiplyPower: boolean = false;					// 射弹的伤害是否应该根据蓄力值乘以-仅对射弹
	public powerMultiplier: float = 1.0;			   	// 蓄力可以影响武器功率的乘数;功率=功率*(蓄力量*功率倍增器)
	public initialForceMultiplier: float = 1.0;			// 在一个抛射系统中，使蓄力能影响初始力的倍增器
	private heat: float = 0.0;							// 武器蓄力的时间，可以在(0，最大蓄力)的范围内

	// Projectile
	@engine.decorators.property({
		type: engine.Prefab
	})
	public projectile: engine.Prefab = null;						// 要发射的炮弹(如果类型是弹丸)

	@engine.decorators.property({
		type: engine.Transform3D
	})
	public projectileSpawnSpot: engine.Transform3D = null;				// 炮弹应该实例化的位置

	// Rate of Fire
	public rateOfFire: float = 2;						// 这种武器每秒发射的子弹数
	private actualROF: float = 0;							// The frequency between shots based on the rateOfFire
	private fireTimer: float = 0;							// 计时器用于按设定的频率开火

	// 弹药
	@engine.decorators.property({
		type: 'boolean',
		tooltips: '是否无限弹药'
	})
	public infiniteAmmo: boolean = false;					// Whether or not this weapon should have unlimited ammo
	public ammoCapacity: number = 20;						// The number of rounds this weapon can fire before it has to reload
	public shotPerRound: number = 1;						// The number of "bullets" that will be fired on each round.  Usually this will be 1, but set to a higher number for things like shotguns with spread
	private currentAmmo: number = 0;							// How much ammo the weapon currently has
	public reloadTime: float = 2.0;						// How much time it takes to reload the weapon
	public reloadAutomatically: boolean = true;				// Whether or not the weapon should reload automatically when out of ammo

	// Burst
	public burstRate: number = 3;							// 每次爆炸发射的子弹数
	public burstPause: float = 0.0;						// 爆炸之间的停顿时间
	private burstCounter: number = 0;						// 计数器跟踪有多少枪已经发射了每个爆破
	private burstTimer: float = 0.0;					// 计时器来记录武器在爆发之间停顿了多长时间

	// 后坐力
	public recoil: boolean = true;							// 这个武器是否应该有反冲
	public recoilKickBackMin: number = 0.4;				// The minimum distance the weapon will kick backward when fired
	public recoilKickBackMax: number = 0.5;				// The maximum distance the weapon will kick backward when fired
	public recoilRotationMin: number = 5;				// The minimum rotation the weapon will kick when fired
	public recoilRotationMax: number = 8;				// The maximum rotation the weapon will kick when fired
	public recoilRecoveryRate: float = 6;			// The rate at which the weapon recovers from the recoil displacement

	// Effects
	private makeMuzzleEffects: boolean = true;				// 武器是否应该造成枪口效果
	@engine.decorators.property({
		type: engine.Prefab
	})
	public muzzleEffects: engine.Prefab = null;	     // 枪口上出现的效果(枪口闪光、冒烟等)
	@engine.decorators.property({
		type: engine.Transform3D,
		tooltips: '枪口效果位置'
	})
	public muzzleEffectsPosition: engine.Transform3D = null;				// 枪口效果应该出现的位置

	// Other
	private canFire: boolean = true;						// 武器当前是否可以开火(用于半自动武器)

	// 	Input
	private press: boolean = false;              //点击开火按钮

	public onAwake() {
		this.initEvent();
	}

	//使用它进行初始化
	public onStart() {
		this.projectileSpawnSpot.euler.x = -5 * 0.0174;
		dateCenter.SceneNode = this.entity.transform.parent.entity;
		// 计算武器系统中实际使用的射速。rateOfFire变量的设计是为了让用户更容易使用，它代表每秒发射的子弹数。在这里，计算了一个实际的ROF十进制值，它可以用于计时器。
		if (this.rateOfFire != 0)
			this.actualROF = 1.0 / this.rateOfFire;
		else
			this.actualROF = 0.01;

		// 确保开火计时器在0开始
		this.fireTimer = 0.0;



		// 用弹匣装满武器
		this.currentAmmo = this.ammoCapacity;

		// 确保枪口效果位置不为空
		if (this.muzzleEffectsPosition == null)
			this.muzzleEffectsPosition = this.entity.transform.children[3].entity.transform;

		// 确保炮弹产卵点不为空
		if (this.projectileSpawnSpot == null)
			this.projectileSpawnSpot = this.entity.transform.children[3].entity.transform;

		// 确保武器模型不是空的
		this.weaponModel = this.weaponModels.entity;
		if (this.weaponModels == null)
			this.weaponModel = this.entity.transform.children[0].entity;

		//记录武器模型的初始本地坐标
		this.originalPoint = engine.Vector3.createFromNumber(0, 0, 0);
		this.originalQua = engine.Quaternion.createFromNumber(0, 0, 0, 1);
	}

	private initEvent() {
		EventCenter.on(EventCenter.HURT_PLAYER, () => {

		});

		EventCenter.on(EventCenter.START_SHOOT, () => {
			this.press = true;
		});

		EventCenter.on(EventCenter.END_SHOOT, () => {
			this.press = false;
		});
	}

	// Update is called once per frame
	public onUpdate(dt) {

		// Update the fireTimer
		this.fireTimer += dt;

		// CheckForUserInput() handles the firing based on user input
		if (this.playerWeapon) {
			this.CheckForUserInput(dt);
		}

		// 如果武器没有弹药，请重新装填
		if (this.reloadAutomatically && this.currentAmmo <= 0)
			this.Reload();

		// Recoil Recovery
		if (this.playerWeapon && this.recoil && this.type != WeaponType.Beam) {
			this.weaponModel.transform.position = this.weaponModel.transform.position.lerp(this.originalPoint, this.recoilRecoveryRate * dt);
			this.weaponModel.transform.quaternion = this.weaponModel.transform.quaternion.slerp(this.originalQua, this.recoilRecoveryRate * dt);
		}
	}

	// 检查用户输入使用武器-只有当武器是玩家控制的
	private CheckForUserInput(dt) {
		// 如果这是一种抛射武器，用户按下开火按钮，则发射抛射物
		if (this.type == WeaponType.Projectile) {
			if (this.fireTimer >= this.actualROF && this.burstCounter < this.burstRate && this.canFire) {
				if (this.press) {
					if (!this.warmup)	// 当用户按住开火按钮时正常开火
					{
						this.Launch();
					}
					else if (this.heat < this.maxWarmup)	// 否则，只需添加到蓄力，直到用户放开按钮
					{
						this.heat += dt;
					}
				}
				if (this.warmup && this.press) {
					this.Launch();
				}
			}
		}

		// Reset the Burst
		if (this.burstCounter >= this.burstRate) {
			this.burstTimer += dt;
			if (this.burstTimer >= this.burstPause) {
				this.burstCounter = 0;
				this.burstTimer = 0.0;
			}
		}

		// 如果“填充弹药”按钮被按下，填充弹药
		// if (Input.GetButtonDown("Reload"))
		// 	this.Reload();

		// 如果武器是半自动的，用户松开按钮，将canFire设置为true
		if (this.press)
			this.canFire = true;
	}

	// Projectile system
	private Launch() {
		// 重置开火计时器为0(对于ROF)
		this.fireTimer = 0.0;

		// 增加突发计数器
		this.burstCounter++;

		// 如果这是一种半自动武器，将canFire设置为false(这意味着在玩家松开开火按钮之前武器不能再次开火)。
		if (this.auto == Auto.Semi)
			this.canFire = false;

		// First make sure there is ammo
		if (this.currentAmmo <= 0) {
			this.DryFire();
			return;
		}

		// 每次射击从当前弹药中减去1
		if (!this.infiniteAmmo)
			this.currentAmmo--;

		// Fire once for each shotPerRound value
		for (let i = 0; i < this.shotPerRound; i++) {
			// 实例化炮弹
			if (this.projectile != null) {
				const proj = this.projectile.instantiate();
				this.entity.transform.parent.entity.transform.addChild(proj.transform);
				proj.transform.worldPosition = this.projectileSpawnSpot.worldPosition;
				proj.transform.quaternion = this.projectileSpawnSpot.worldQuaternion;
				// 武器蓄力
				if (this.warmup) {
					if (this.multiplyPower)
						EventCenter.emit("MultiplyDamage", this.heat * this.powerMultiplier);
					if (this.multiplyForce)
						EventCenter.emit("MultiplyInitialForce", this.heat * this.initialForceMultiplier);

					this.heat = 0.0;
				}
			}
			else {
				console.log("Projectile to be instantiated is null.  Make sure to set the Projectile field in the inspector.");
			}
		}

		// 后坐力
		if (this.recoil)
			this.Recoil();

		// 枪口闪光效果
		if (this.makeMuzzleEffects) {
			const muzfx = this.muzzleEffects.instantiate();
			this.entity.transform.children[3].entity.transform.addChild(muzfx.transform);
			muzfx.transform.position = engine.Vector3.ZERO.clone();
		}

		// 播放开火时的枪声
		// GetComponent<AudioSource>().PlayOneShot(fireSound);
	}

	// 当武器试图在没有任何弹药的情况下开火
	private DryFire() {
		// GetComponent<AudioSource>().PlayOneShot(dryFireSound);
	}

	// 开火后座。这是你在射击时看到的武器后退
	private Recoil() {
		// ai无后坐力
		if (!this.playerWeapon)
			return;

		// 确保用户没有让武器模型字段空着
		if (this.weaponModel == null) {
			console.log("Weapon Model is null.  Make sure to set the Weapon Model field in the inspector.");
			return;
		}

		// 计算后坐位置和旋转的随机值
		const kickBack: number = this.random(this.recoilKickBackMin, this.recoilKickBackMax);
		const kickRot: number = this.random(this.recoilRotationMin, this.recoilRotationMax);

		// 对武器的位置和旋转应用随机值
		this.weaponModel.transform.position = this.weaponModel.transform.position.add(engine.Vector3.createFromNumber(0, 0, -kickBack));
		this.weaponModel.transform.rotate(engine.Vector3.createFromNumber(-kickRot, 0, 0), true, false);
	}

	// 填充武器弹药
	private Reload() {
		this.currentAmmo = this.ammoCapacity;
		this.fireTimer = -this.reloadTime;

		//弹药填充时的声音
		// GetComponent<AudioSource>().PlayOneShot(reloadSound);            

		// 发送一个事件消息，以便用户可以在发生这种情况时执行其他操作
		EventCenter.emit("OnEasyWeaponsReload");
	}

	private random(min: number, max: number): number {
		let vaer: number = Math.random() * (max - min) + min;
		return parseFloat(vaer.toFixed(5))
	}

}