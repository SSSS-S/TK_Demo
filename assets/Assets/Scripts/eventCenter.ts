import engine from "engine";
import { EventEmitter } from "eventemitter3";

class EventEmitterCenter extends EventEmitter {
  public TOUCH_MOVE = 'TOUCH_MOVE';
  public START_SHOOT = 'START_SHOOT';
  public END_SHOOT = 'END_SHOOT';

  public ADD_PLAYER = 'ADD_PLAYER';
  public ADD_ENEMY = 'ADD_ENEMY';
  public MOVE_PLAYER = 'MOVE_PLAYER';
  public HURT_PLAYER = 'HURT_PLAYER';
  public GET_SCORE = 'GET_SCORE';

  public OnEasyWeaponsReload = 'OnEasyWeaponsReload';
  public MultiplyDamage = 'MultiplyDamage';
  public MultiplyInitialForce = 'MultiplyInitialForce';
  public ChangeHealth = 'ChangeHealth';
  public Damage = 'Damage';

  constructor() {
    super();
  }
}

export const EventCenter = new EventEmitterCenter();
export default EventCenter;
export class dateCenter {
  public static SceneNode:engine.Entity = null;
}