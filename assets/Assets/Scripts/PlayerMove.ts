import engine from "engine";
import { float } from "engine/type";
import EventCenter from "./eventCenter";

@engine.decorators.serialize("PlayerMove")
export default class PlayerMove extends engine.Script {

  private m_Speed: float = 8;
  private m_MoveValue: float = 0;
  private m_TurnValue: float = 0;
  //private m_Rigidbody: engine.Rigidbody = null;
  private m_characterController: engine.CharacterController = null;
  private camera: engine.Entity;
  private distance = engine.Vector3.ZERO.clone();

  public onAwake() {
    this.initEvent();
    //this.m_Rigidbody = this.entity.getComponent(engine.Rigidbody);
    this.m_characterController = this.entity.getComponent(engine.CharacterController);
    this.camera = this.entity.transform.parent.entity.transform.findChildByName('Main Camera').entity;
  }

  public onStart() {
    this.entity.game.activeScene.settings.ambientSkyColor = new engine.Color(38, 183, 255, 1);
    this.m_characterController.center = engine.Vector3.createFromNumber(0, 0.43, 0.1);
    this.m_characterController.radius = 0.5;
    this.m_characterController.height = 1.8;
    this.m_characterController.detectCollisions = true;
    this.m_characterController.slopeLimit = 0;
    this.distance = this.camera.transform.position.clone().sub(this.entity.transform.position.clone());
  }

  public initEvent() {
    EventCenter.on(EventCenter.TOUCH_MOVE, (direction) => {

      if (direction.z == 0) {
        this.m_MoveValue = 0;
      } else {
        this.m_MoveValue = -1;
      }

      if (Math.abs(direction.x) < 0.1) {
        this.m_TurnValue = 0;
      } else {
        this.m_TurnValue = direction.x * 100;
      }

      if (direction.z > 0) {
        if (this.m_TurnValue < 0) {
          this.m_TurnValue = -180 - this.m_TurnValue;
        } else if (this.m_TurnValue > 0) {
          this.m_TurnValue = 180 - this.m_TurnValue;
        } else if (this.m_TurnValue == 0) {
          this.m_TurnValue = 180;
        }
      }
      this.Turn();
    });
  }

  public onUpdate(dt) {
    this.Move(dt);
  }

  private Move(dt) {
    const Value = this.m_MoveValue * this.m_Speed * dt;
    const movement = engine.Vector3.createFromNumber(this.entity.transform.forward.x * Value, this.entity.transform.forward.y * Value, this.entity.transform.forward.z * Value);
    // this.m_Rigidbody.movePosition(this.m_Rigidbody.position.add(movement));
    this.m_characterController.move(movement);
    if (this.entity.transform.position.y != 0) {
      this.entity.transform.position.y = 0;
    }
  }

  private Turn() {
    //const turnRotation = engine.Quaternion.fromEulerAngles(engine.Vector3.createFromNumber(0, turn, 0));
    //this.m_Rigidbody.moveRotation(this.m_Rigidbody.rotation.multiply(turnRotation));
    const turnRotation = this.m_TurnValue * 0.0174;
    this.entity.transform.euler.y = turnRotation * -1;
  }

  public onLateUpdate() {
    this.camera.transform.position = this.camera.transform.position.lerp(this.entity.transform.position.clone().add(this.distance), 0.1);
  }

}