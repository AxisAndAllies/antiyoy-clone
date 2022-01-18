import "./style.css";
import * as Honeycomb from "honeycomb-grid";
import { SVG } from "@svgdotjs/svg.js";

const app = document.querySelector<HTMLDivElement>("#app")!;

// app.innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `;
window.onload = () => {
  const draw = SVG().addTo(app).size("90%", "90%");

  const Hex = Honeycomb.extendHex({ size: 30 });
  const Grid = Honeycomb.defineGrid(Hex);
  // get the corners of a hex (they're the same for all hexes created with the same Hex factory)
  const corners = Hex().corners();
  // an SVG symbol can be reused
  const hexSymbol = draw
    .symbol()
    // map the corners' positions to a string and create a polygon
    .polygon(corners.map(({ x, y }) => `${x},${y}`))
    .fill("none")
    .stroke({ width: 1, color: "#999" });

  // render 10,000 hexes
  Grid.rectangle({ width: 30, height: 30 }).forEach((hex) => {
    const { x, y } = hex.toPoint();
    // use hexSymbol and set its position for each hex
    draw.use(hexSymbol).translate(x, y);
  });
};
