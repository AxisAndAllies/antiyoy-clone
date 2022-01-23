import { Grid } from "honeycomb-grid";
import { canMove, Stat, Stats, UnitType } from "./stats";
import { MyHex } from "./types";

class Game {
  players: Player[];
  whoseTurn: number = 0;
  units: Unit[];
  grid: Grid<MyHex>;

  constructor(players: Player[], hexgrid: Grid<MyHex>) {
    this.players = players;
    this.units = [];
    this.grid = hexgrid;
  }

  currentPlayerId() {
    return this.players[this.whoseTurn].id;
  }
  getPlayerById(id: string) {
    return this.players.find((p) => p.id == id);
  }
  buy(unitType: UnitType, hex: MyHex) {
    // let curPlayer = this.players[this.whoseTurn];
    let curPlayer = this.getPlayerById(hex.ownerId);
    let res = curPlayer?.buy(unitType, hex);
    if (res) {
      this.units.push(res);
    }
  }
  move(fromHex: MyHex, toHex: MyHex) {
    let unit = this.units.find((u) => u.hex == fromHex);
    if (!unit) {
      return false;
    }
    return this._move(unit, toHex);
  }
  _move(unit: Unit, toHex: MyHex) {
    //  // check within range
    const dist = unit.hex.distance(toHex.cube());
    if (!canMove(unit.type)) {
      return false;
    }
    if (dist > 4) {
      return false;
    }
    if (this.getFriendlyNeighbors(toHex, unit.owner).length == 0) {
      return false;
    }
    // TODO: need to check more thoroughly...

    if (toHex.ownerId == unit.owner.id) {
      // moving to friendly hex
      this._forceMoveUnit(unit, toHex);
      return true;
    }
    console.log(this.getProtection(toHex));
    // check strength
    if (unit.stat.strength > this.getProtection(toHex)) {
      // moving to enemy hex
      this._forceMoveUnit(unit, toHex);
      return true;
    }
    return false;
  }
  _forceMoveUnit(unit: Unit, toHex: MyHex) {
    // removing all units on that hex
    this.units = this.units.filter((u) => u.hex != toHex);
    // moving new unit to that hex
    unit.hex = toHex;
  }
  getFriendlyNeighbors(hex: MyHex, owner: Player) {
    return this.grid.neighborsOf(hex).filter((hex) => hex.ownerId == owner.id);
  }
  getProtection(hex: MyHex) {
    const neighbors = this.units.filter(
      (u) => u.owner.id == hex.ownerId && u.hex.distance(hex.cube()) == 1
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
  id: number;

  constructor(type: UnitType, owner: Player, hex: MyHex) {
    this.type = type;
    this.stat = Stats[type];
    this.hex = hex;
    this.owner = owner;
    this.id = Math.floor(Math.random() * 1000000);
  }
  moveTo(toHex: MyHex) {
    this.hex = toHex;
  }
}
class Tree {}
class Renderer {
  pairs: Record<string | number, fabric.Group> = {};
  constructor() {}
  addPair(unit: Unit, graphic: fabric.Group) {
    this.pairs[unit.id] = graphic;
  }
  getGraphic(unit: Unit) {
    return this.pairs[unit.id];
  }
}

export { Game, Player, Tree, Unit, Renderer };
