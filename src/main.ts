import "./style.css";
import { Stat } from "./stats";
import * as Honeycomb from "honeycomb-grid";
import { fabric } from "fabric";

let fromHex: fabric.Object | null | undefined = null;

const store = document.querySelector<HTMLDivElement>("#store")!;
Object.entries(Stat).forEach(([name, stat]) => {
  let btn = document.createElement("button");
  btn.innerHTML = name + "(" + JSON.stringify(stat) + ")";
  store.appendChild(btn);
});

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

const Hex = Honeycomb.extendHex({ size: 30, orientation: "flat" });
const Grid = Honeycomb.defineGrid(Hex);
// get the corners of a hex (they're the same for all hexes created with the same Hex factory)
const corners = Hex().corners();

// render 10,000 hexes
Grid.rectangle({ width: 30, height: 30 }).forEach((hex) => {
  const { x, y } = hex.toPoint();
  // use hexSymbol and set its position for each hex

  let polygon = new fabric.Polygon(corners.map(({ x, y }) => ({ x, y })));
  polygon.left = x;
  polygon.top = y;
  polygon.set("fill", "#ccc");
  polygon.set("stroke", "white");

  polygon.selectable = false;
  canvas.add(polygon);
});
setInterval(() => {
  canvas.requestRenderAll();
}, 50);

const mapGen = () => {
  // generate map
};
