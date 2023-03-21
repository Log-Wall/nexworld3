import * as topojson from "topojson-client";
import { topoj } from "./topo";

import NexDialog from "../components/NexDialog";
import "./topographies/mainlandReefs/mainlandMiddleEast";
import "./topographies/mainlandReefs/mainlandMiddleWest";
import "./topographies/mainlandReefs/mainlandNorth";
import "./topographies/mainlandReefs/mainlandSouth";

import "./topographies/mainlandInternal/mainlandAshtan";
import "./topographies/mainlandInternal/mainlandFissure";
import "./topographies/mainlandInternal/mainlandGraniteHills";
import "./topographies/mainlandInternal/mainlandHarae";
import "./topographies/mainlandInternal/mainlandLowerGranite";
import "./topographies/mainlandInternal/mainlandMhaldor";
import "./topographies/mainlandInternal/mainlandMiddleEast";
import "./topographies/mainlandInternal/mainlandNewHope";
import "./topographies/mainlandInternal/mainlandNewHope2";
import "./topographies/mainlandInternal/mainlandNorth";
import "./topographies/mainlandInternal/mainlandNorthReach";
import "./topographies/mainlandInternal/mainlandSouth";

import "./topographies/islands/ageiro";
import "./topographies/islands/shalaKhulia";
import "./topographies/islands/polyargos";
import "./topographies/islands/colchis";
import "./topographies/islands/umbrin";
import "./topographies/islands/ilyrean";
import "./topographies/islands/suliel";
import "./topographies/islands/minos";
import "./topographies/islands/mysia";
import "./topographies/islands/tearsOfSarapis";
import "./topographies/islands/tuar";
import "./topographies/islands/ulangi";
import "./topographies/islands/zanzibar";

import "./topographies/chops/chopsWest";
import "./topographies/chops/chopsNorth";
import "./topographies/chops/chopsTasurke";
import "./topographies/chops/chopsTenwat";

import "./topographies/roughs/roughsWest";
import "./topographies/roughs/roughsPhereklos";
import "./topographies/roughs/roughsAgeiro";
import "./topographies/roughs/roughsHaraeSouth";
import "./topographies/roughs/roughsZanzibar";
import "./topographies/roughs/roughsSouth";

import { topographies, toggleDirs, longDirConversion } from "./tables";
//import snake from './sea-serpent.svg';
import snake from './trogdor.png';
import tree from './tree.png';

const unitWidth = 10;
const unitHeight = 10;
const gridWidth = 10000;
const gridHeight = 10000;
const leaderLine = {
  color: "red",
  length: 200,
};
const scaling = (k) => {
  let scale = 1;
  switch (true) {
    case k < 0.05:
      scale = 100;
      break;
    case k < 0.15:
      scale = 50;
      break;
    case k < 0.35:
      scale = 20;
      break;
    case k < 0.8:
      scale = 10;
      break;
    case k < 1.4:
      scale = 5;
      break;
    default:
      scale = 1;
      break;
  }

  return scale;
};

const drawMap = ({ context, path, transform, width, height }) => {
  context.save();
  context.clearRect(0, 0, width, height);

  for (const topography in topographies) {
    drawFeatures({
      context: context,
      path: path,
      type: topography,
      rgba: topographies[topography],
    });
  }

  drawGrid({ context: context, transform: transform });

  drawPoint({
    context: context,
    transform: transform,
    coords: [0, 0],
    radius: 5,
  });

  drawShip({
    context: context,
    transform: transform,
    coords: nexWorld.location,
  });

  const ss = new Image();
  ss.src = snake;
  context.drawImage(ss, (2 * 10) - 5, (4 * 10) - 5, 10, 10);

  context.restore();
};

const drawGrid = ({ context, transform }) => {
  const scale = scaling(transform.k);

  context.closePath();
  context.beginPath();
  context.lineWidth = 0.5 * scale;
  context.strokeStyle = "rgba( 15, 35, 75,0.75)";

  const offset = unitWidth / 2 * scale;
  for (let i = -gridWidth; i <= gridWidth; i += unitWidth * scale) {
    context.moveTo(i + offset, -gridHeight);
    context.lineTo(i + offset, gridHeight);
    context.moveTo(-gridWidth, i + offset);
    context.lineTo(gridWidth, i + offset);
  }

  context.stroke();
  context.closePath();
};

const drawShip = ({ context, transform, coords }) => {
  context.closePath();
  let angle = 0;
  switch (nexWorld.direction) {
    case "n":
      angle = 0;
      break;
    case "nne":
      angle = 26.57;
      break;
    case "ne":
      angle = 45;
      break;
    case "ene":
      angle = 63.43;
      break;
    case "e":
      angle = 90;
      break;
    case "ese":
      angle = 116.57;
      break;
    case "se":
      angle = 135;
      break;
    case "sse":
      angle = 153.43;
      break;
    case "s":
      angle = 180;
      break;
    case "ssw":
      angle = 206.57;
      break;
    case "sw":
      angle = 225;
      break;
    case "wsw":
      angle = 243.43;
      break;
    case "w":
      angle = 270;
      break;
    case "wnw":
      angle = 296.57;
      break;
    case "nw":
      angle = 315;
      break;
    case "nnw":
      angle = 333.43;
      break;
    default:
      angle = 0;
  }

  const scale = scaling(transform.k);

  const x = coords[0] * nexWorld.unitWidth;
  const y = coords[1] * nexWorld.unitHeight;

  context.save();
  // Rotate the drawing area based on ship direction
  context.translate(x, y);
  context.rotate((angle * Math.PI) / 180);
  context.scale(scale, scale);
  context.translate(-x, -y);

  // Draw the leader line from ship
  context.beginPath();
  context.fillStyle = leaderLine.color;
  context.strokeStyle = leaderLine.color;
  context.lineWidth = 0.25;
  context.moveTo(x, y);
  context.lineTo(x, y - leaderLine.length);
  context.lineTo(x + 2, y - leaderLine.length + 2);
  context.lineTo(x - 2, y - leaderLine.length + 2);
  context.lineTo(x, y - leaderLine.length);
  context.fill();
  context.stroke();
  context.closePath();

  // Ship hull
  context.fillStyle = "rgb(139,69,19)";
  context.lineWidth = 0.25;
  context.strokeStyle = "black";
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x, y - 5);
  context.quadraticCurveTo(x + 2, y - 3, x + 2, y);
  context.quadraticCurveTo(x + 2, y + 4, x + 0.5, y + 4);
  context.lineTo(x - 0.5, y + 4);
  context.quadraticCurveTo(x - 2, y + 4, x - 2, y);
  context.quadraticCurveTo(x - 2, y - 3, x, y - 5);
  context.fill();
  context.stroke();
  context.closePath();

  // Ship front sail
  context.fillStyle = "white";
  context.beginPath();
  context.moveTo(x - 3, y - 2);
  context.quadraticCurveTo(x, y - 3.5, x + 3, y - 2);
  context.fill();
  context.closePath();

  // Ship main sail
  context.beginPath();
  context.moveTo(x, y + 1);
  context.quadraticCurveTo(x + 2, y - 1, x + 4, y + 1);
  context.lineTo(x - 4, y + 1);
  context.quadraticCurveTo(x - 2, y - 1, x, y + 1);
  context.fill();
  context.closePath();

  // Ship front mast
  context.beginPath();
  context.strokeStyle = "black";
  context.lineWidth = 0.25;
  context.fillStyle = "	rgb(105,105,105)";
  context.arc(x, y - 2, 0.5, 0, 360, false);
  context.fill();
  context.stroke();
  context.closePath();

  // Ship main mast
  context.beginPath();
  context.strokeStyle = "black";
  context.lineWidth = 0.25;
  context.fillStyle = "	rgb(105,105,105)";
  context.arc(x, y + 1, 0.5, 0, 360, false);
  context.fill();
  context.stroke();
  context.closePath();

  context.restore();
};
const drawFeatures = ({ context, path, type, rgba }) => {
  const feature = topojson.feature(topoj, topoj.objects[type]);
  context.fillStyle = rgba;
  //context.strokeStyle = "rgba(0, 0, 0, 1)";
  context.lineWidth = 0;
  context.closePath();
  context.beginPath();
  path(feature);
  context.fill();
  //context.stroke(); // Do we want outlines? Maybe for reefs?
  context.closePath();
};
const drawImage = ({ context, path, type, rgba }) => {
  context.closePath();
  context.beginPath();
  //
  //context.stroke(); // Do we want outlines? Maybe for reefs?
  context.closePath();
};
const drawPoint = ({ context, transform, coords, rgba, radius }) => {
  // TOD How should we color the port points? All the same or by another metric?

  const scale = scaling(transform.k);
  context.closePath();
  context.beginPath();
  context.moveTo(coords[0], coords[1]);
  context.arc(coords[0], coords[1], radius, 0, 2 * Math.PI);
  context.fillStyle = rgba || "rgba( 190, 100,  55, 1)";
  context.fill();
  context.fillStyle = "black";
  context.font = "bold 12px RobotoMono Consolas monospace";
  context.fillText("?", coords[0] - 2.5, coords[1] + 3.75);
  context.strokeStyle = "white";
  context.font = `bold ${12 * (scale / 2)}px RobotoMono Consolas monospace`;
  context.strokeText("Shala-Khulia", coords[0] - 2.5, coords[1] - 6.25);
  context.fillStyle = "black";
  context.font = `bold ${12 * (scale / 2)}px RobotoMono Consolas monospace`;
  context.fillText("Shala-Khulia", coords[0] - 2.5, coords[1] - 6.25);

  context.closePath();
};
const turnShip = (direction) => {
  nexWorld.direction = direction;
  nexWorld.directionToggle = 0;
  nexWorld.evt.dispatchEvent(
    new CustomEvent("nexWorld-direction-update", {
      detail: direction,
    })
  );
};
const moveShip = (dir) => {
  let newCoords = [0, 0];
  let direction = dir;
  if (Object.keys(toggleDirs).includes(direction)) {
    direction = toggleDirs[dir][nexWorld.directionToggle];
    nexWorld.directionToggle = nexWorld.directionToggle ? 0 : 1;
  }

  switch (direction) {
    case "n":
      newCoords = [0, -1];
      break;
    case "nne":
      newCoords = [0, -1];
      break;
    case "ne":
      newCoords = [1, -1];
      break;
    case "ene":
      newCoords = [0, -1];
      break;
    case "e":
      newCoords = [1, 0];
      break;
    case "ese":
      newCoords = [0, -1];
      break;
    case "se":
      newCoords = [1, 1];
      break;
    case "sse":
      newCoords = [0, -1];
      break;
    case "s":
      newCoords = [0, 1];
      break;
    case "ssw":
      newCoords = [0, -1];
      break;
    case "sw":
      newCoords = [-1, 1];
      break;
    case "wsw":
      newCoords = [0, -1];
      break;
    case "w":
      newCoords = [-1, 0];
      break;
    case "wnw":
      newCoords = [0, -1];
      break;
    case "nw":
      newCoords = [-1, -1];
      break;
    case "nnw":
      newCoords = [0, -1];
      break;
    default:
      newCoords = [0, 0];
  }

  nexWorld.direction = dir;
  nexWorld.location[0] += newCoords[0];
  nexWorld.location[1] += newCoords[1];
  nexWorld.move = [...newCoords];

  nexWorld.evt.dispatchEvent(
    new CustomEvent("nexWorld-location-update", {
      detail: [...nexWorld.location],
    })
  );
};

const center = () => {
  nexWorld.follow = true;

  nexWorld.zoomRef.translateTo(
    nexWorld.selection,
    nexWorld.location[0] * nexWorld.unitWidth,
    nexWorld.location[1] * nexWorld.unitHeight
  );
};

const startup = () => {
  if (typeof ReactDOM === "undefined") {
    return;
  }

  nexSys.checkForUpdate();

  if (!document.getElementById("modal-root")) {
    document
      .getElementsByTagName("body")[0]
      .appendChild(
        Object.assign(document.createElement("div"), { id: "modal-root" })
      );
  }

  document.getElementById("nexworld-modal")?.remove();
  document
    .getElementById("modal-root")
    .appendChild(
      Object.assign(document.createElement("div"), { id: "nexworld-modal" })
    );

  ReactDOM.render(
    React.createElement(nexWorld.component, { nexWorld: nexWorld }),
    document.getElementById("nexworld-modal")
  );

  // Nexus processes the overhead map stuff in the background.
  // This snippet also sends the information to eventStream.
  nexusclient.datahandler().on_special_display = function (
    type,
    lines,
    params
  ) {
    const t = nexusclient;
    if (type === "ohmap") {
      t.ui().layout().set_overhead_map(lines);
      nexusclient
        .reflexes()
        .run_function(
          "onGMCP",
          { gmcp_method: "IRE.Display.Ohmap", gmcp_args: lines },
          "eventStream3"
        );
      console.log({ gmcp_method: "IRE.Display.Ohmap", gmcp_args: lines });
    }
    if (type === "help") t.ui().layout().help_window(lines);
    if (type === "window") t.ui().layout().command_window(lines, params["cmd"]);
  };
};

export const nexWorld = {
  evt: new EventTarget(),
  component: NexDialog,

  drawMap: drawMap,
  drawGrid: drawGrid,
  drawShip: drawShip,
  setLocation() { },
  moveShip: moveShip,
  turnShip: turnShip,
  startup: startup,
  center: center,

  unitHeight: unitHeight,
  unitWidth: unitWidth,
  topoj: topoj,
  location: [0, 0],
  move: [0, 0],
  direction: "se",
  follow: true,
  directionToggle: 0,
  longDirs: longDirConversion,
  leaderLine: leaderLine,
};

window.nexWorld = nexWorld;
nexWorld.startup();
