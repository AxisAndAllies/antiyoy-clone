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

  constructor() {
    this.money = 0;
  }

  greet() {
    return "Hello, " + this.greeting;
  }
}
class Unit {}

class Building {}

export { Game };
