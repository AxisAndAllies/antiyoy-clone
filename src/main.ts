import "./style.css";
import { Stat } from "./stats";
import * as Honeycomb from "honeycomb-grid";
import { fabric } from "fabric";
import { Game, Player } from "./game";

let fromHex: fabric.Object | null | undefined = null;
let players = [new Player("#ab0"), new Player("#30b")];
let game = new Game(players);

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
createUI();

var canvas = new fabric.Canvas("c");
canvas.selection = false; // disable group selection
canvas.on("mouse:down", function (options) {
  options.target?.set("fill", "#aaa");
});
canvas.on("mouse:over", function (e) {
  fromHex = e.target;
  e.target?.set("stroke", "#000");
});
canvas.on("mouse:out", function (e) {
  e.target?.set("stroke", "white");
});

const Hex = Honeycomb.extendHex({
  size: 30,
  orientation: "flat",
  custom: {
    owner: "",
  },
});

const Grid = Honeycomb.defineGrid(Hex);
// get the corners of a hex (they're the same for all hexes created with the same Hex factory)
const corners = Hex().corners();

// render 10,000 hexes
Grid.rectangle({ width: 30, height: 30 }).forEach((hex) => {
  const rand = Math.random();
  if (rand < 0.02) {
    hex.custom.owner = players[0].id;
  } else if (rand < 0.04) {
    hex.custom.owner = players[1].id;
  } else {
    hex.custom.owner = "";
  }
  const { x, y } = hex.toPoint();

  let polygon = new fabric.Polygon(corners.map(({ x, y }) => ({ x, y })));
  polygon.left = x;
  polygon.top = y;
  polygon.set("fill", hex.custom.owner ? getColor(hex.custom.owner) : "#ccc");
  polygon.set("stroke", "white");

  polygon.selectable = false;
  canvas.add(polygon);
});
setInterval(() => {
  canvas.requestRenderAll();
  document.getElementById("whoseturn").innerHTML = game.whoseTurn;
}, 50);

const mapGen = () => {
  // generate map
};

function getColor(playerId: string): string {
  return game.players.filter((p) => p.id == playerId)[0].color;
}
