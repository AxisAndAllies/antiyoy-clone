import "./style.css";
import { Stat } from "./stats";
import * as Honeycomb from "honeycomb-grid";
import { fabric } from "fabric";
import { Game, Player } from "./game";
import { MyHex } from "./types";

let fromHex: MyHex | null = null;
let players = [new Player("#ab0"), new Player("#30b")];
let game = new Game(players);
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

// render 10,000 hexes
const grid = Grid.rectangle({ width: 30, height: 30 });

grid.forEach((hex) => {
  const rand = Math.random();
  if (rand < 0.02) {
    hex.ownerId = players[0].id;
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
  canvas.requestRenderAll();
  document.getElementById("whoseturn").innerHTML = game.whoseTurn;
}, 50);

createUI();
setupCanvas();

const mapGen = () => {
  // generate map
};

function getColor(playerId: string): string {
  return game.players.filter((p) => p.id == playerId)[0].color;
}

function createUI() {
  const store = document.querySelector<HTMLDivElement>("#store")!;
  Object.entries(Stat).forEach(([name, stat]) => {
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
        res?.polygon.set("fill", getColor(res.ownerId));
      }
      console.log(fromHex);
      console.log(res);
      // reset
      fromHex.polygon.set("fill", getColor(res.ownerId));
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
function takeOver(from: MyHex, to: MyHex) {
  // check within range
  // check diff owner
  if (to.ownerId == from.ownerId) {
    return true;
  }
  // check strength
  // resolve
  return true;
}
