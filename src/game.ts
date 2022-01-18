import { Stat, UnitType } from "./stats";
class Game {
  players: Player[];
  whoseTurn: number = 0;

  constructor(players: Player[]) {
    this.players = players;
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

  buy(unitType: UnitType) {
    if (this.money <= Stat[unitType].cost) {
    }
  }
}
class Unit {}

class Building {}

export { Game, Player, Unit, Building };
