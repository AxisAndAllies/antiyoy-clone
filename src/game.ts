import { canMove, Stat, Stats, UnitType } from "./stats";
import { MyHex } from "./types";

class Game {
  players: Player[];
  whoseTurn: number = 0;
  units: Unit[];

  constructor(players: Player[]) {
    this.players = players;
    this.units = [];
  }

  currentPlayerId() {
    return this.players[this.whoseTurn].id;
  }
  buy(unitType: UnitType, hex: MyHex) {
    let curPlayer = this.players[this.whoseTurn];
    let res = curPlayer.buy(unitType, hex);
    if (res) {
      this.units.push(res);
    }
  }
  move(unit: Unit, toHex: MyHex) {
    //  // check within range
    const dist = unit.hex.distance(toHex.cube());
    if (!canMove(unit.type)) {
      return false;
    }
    if (dist > 4) {
      false;
      // TODO: need to check more thoroughly...
    }
    if (toHex.ownerId == unit.owner.id) {
      // check diff owner
      return true;
    }
    // check strength
    if (unit.stat.strength > this.getProtection(toHex)) {
      return true;
    }
    return false;
  }
  getProtection(hex: MyHex) {
    const neighbors = this.units.filter(
      (u) => u.owner.id == hex.ownerId && u.hex.distance(hex.cube())
    );
    return Math.max(...neighbors.map((n) => n.stat.protection));
  }

  nextTurn() {
    console.log("next turn");
    this.whoseTurn = (this.whoseTurn + 1) % this.players.length;
  }
}

class Player {
  money: number;
  id: string;
  color: string;

  constructor(color: string) {
    this.money = 0;
    this.color = color;
    this.id = Math.floor(Math.random() * 1000).toString();
  }

  buy(unitType: UnitType, hex: MyHex): Unit | null {
    if (this.money <= Stats[unitType].cost) {
      return new Unit(unitType, this, hex);
    }
    return null;
  }
}
class Unit {
  type: UnitType;
  stat: Stat;
  hex: MyHex;
  owner: Player;

  constructor(type: UnitType, owner: Player, hex: MyHex) {
    this.type = type;
    this.stat = Stats[type];
    this.hex = hex;
    this.owner = owner;
  }
  moveTo(toHex: MyHex) {
    this.hex = toHex;
  }
}
class Tree {}

export { Game, Player, Tree, Unit };
