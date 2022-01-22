import "./style.css";
import { Stat, Stats, UnitType } from "./stats";
import * as Honeycomb from "honeycomb-grid";
import { fabric } from "fabric";
import { Game, Player, Unit } from "./game";
import { MyHex } from "./types";

let fromHex: MyHex | null = null;
let players = [new Player("#ab0"), new Player("#30b")];
const canvas = new fabric.Canvas("c");

const CustomHex = Honeycomb.extendHex({
  size: 30,
  orientation: "flat",
  // custom
  ownerId: "",
  polygon: null as fabric.Polygon | null,
});

const Grid = Honeycomb.defineGrid(CustomHex);
// get the corners of a hex (they're the same for all hexes created with the same Hex factory)
const corners = CustomHex().corners();

const grid = Grid.rectangle({ width: 30, height: 30 });

let game = new Game(players, grid);

grid.forEach((hex) => {
  const rand = Math.random();
  if (rand < 0.02) {
    hex.ownerId = players[0].id;
    game.buy(UnitType.PEASANT, hex);
  } else if (rand < 0.04) {
    hex.ownerId = players[1].id;
  } else {
    hex.ownerId = "";
  }
  const { x, y } = hex.toPoint();

  let polygon = new fabric.Polygon(corners.map(({ x, y }) => ({ x, y })));
  polygon.left = x;
  polygon.top = y;
  polygon.set("fill", hex.ownerId ? getColor(hex.ownerId) : "#ccc");
  polygon.set("stroke", "white");

  polygon.selectable = false;
  canvas.add(polygon);

  // attach lol
  hex.polygon = polygon;
});
console.log(grid);

setInterval(() => {
  renderGame();
  canvas.requestRenderAll();
  document.getElementById("whoseturn").innerHTML = game.whoseTurn;
}, 50);

createUI();
setupCanvas();

const mapGen = () => {
  // generate map
};

function getColor(playerId: string): string | undefined {
  return game.players.find((p) => p.id == playerId)?.color;
}

function createUI() {
  const store = document.querySelector<HTMLDivElement>("#store")!;
  Object.entries(Stats).forEach(([name, stat]) => {
    let btn = document.createElement("button");
    btn.innerHTML = name + "(" + JSON.stringify(stat) + ")";
    store.appendChild(btn);
  });
  let btn = document.createElement("button");
  btn.innerHTML = "Next turn";
  btn.onclick = () => {
    game.nextTurn();
  };
  store.appendChild(btn);

  let d = document.createElement("div");
  d.id = "whoseturn";
  store.appendChild(d);
}
function setupCanvas() {
  canvas.selection = false; // disable group selection
  canvas.on("mouse:down", function (options) {
    let coords = Grid.pointToHex([options.pointer?.x, options.pointer.y]);
    let res = grid.get(coords) as MyHex;

    if (!fromHex) {
      // from hex not selected
      if (res.ownerId == game.currentPlayerId()) {
        fromHex = res;
      }
    } else {
      // from hex is selected
      if (takeOver(fromHex, res)) {
        res.ownerId = game.currentPlayerId();
        const color = getColor(res.ownerId);
        if (color) {
          res.polygon!.set("fill", color);
        }
      } else {
        alert("Move not successful.");
      }
      console.log(fromHex);
      console.log(res);
      // reset
      const color = getColor(res.ownerId);
      if (color) {
        res.polygon!.set("fill", color);
      }
      fromHex = null;
    }
  });
  canvas.on("mouse:over", function (e) {
    e.target?.set("stroke", "#000");
  });
  canvas.on("mouse:out", function (e) {
    e.target?.set("stroke", "white");
  });
}
function takeOver(from: MyHex, to: MyHex): boolean {
  const successful = game.move(from, to);
  return successful;
}
function renderGame() {
  grid.forEach((hex) => {
    hex.polygon.set("stroke", "white");
    hex.polygon.set("strokeWidth", 2);
  });
  game.units.forEach((u) => {
    renderUnit(u);
  });
}
function renderUnit(unit: Unit) {
  unit.hex.polygon!.set("stroke", unit.stat.strength == 1 ? "blue" : "white");
  //
}
