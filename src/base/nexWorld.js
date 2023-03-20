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

const unitWidth = 10;
const unitHeight = 10;
const gridWidth = 10000;
const gridHeight = 10000;

const drawMap = ({ context, path, transform, width, height }) => {
  context.save();
  context.clearRect(0, 0, width, height);
  drawFeatures({
    context: context,
    path: path,
    type: "reefs",
    rgba: "rgba( 100, 130, 180, 0.55)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "marsh",
    rgba: "rgba(  55, 140, 135, 0.88)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "grass",
    rgba: "rgba(  65, 150,  65, 0.85)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "mount",
    rgba: "rgba( 100,  70,  35, 0.85)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "swamp",
    rgba: "rgba(  10,  60,  30, 0.85)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "lowmt",
    rgba: "rgba( 130, 100,  70, 0.65)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "chops",
    rgba: "rgba(   5,  20,  75, 0.65)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "roughs",
    rgba: "rgba( 165, 185, 195, 0.15)",
  });

  drawFeatures({
    context: context,
    path: path,
    type: "nnnbb",
    rgba: "rgba(  85,  55,   1, 0.65)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "nnnbr",
    rgba: "rgba( 165, 135, 100, 0.75)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "___br",
    rgba: "rgba( 200, 180, 145, 0.65)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "...wt",
    rgba: "rgba( 200, 200, 215, 0.65)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "WWbwn",
    rgba: "rgba(  95,  45,  45, 0.55)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "YYred",
    rgba: "rgba( 215,  25,   5, 0.25)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "__blk",
    rgba: "rgba(  15,  15,  15, 0.75)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "##bwn",
    rgba: "rgba( 110,  85,  60, 0.75)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "..blk",
    rgba: "rgba( 165,  15,  15, 0.35)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "##ylw",
    rgba: "rgba( 165, 206,  65, 0.35)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "..wht",
    rgba: "rgba( 200, 200, 215, 0.65)",
  });
  drawFeatures({
    context: context,
    path: path,
    type: "mmblk",
    rgba: "rgba( 165, 206,  65, 0.35)",
  });

  drawGrid({ context: context, transform: transform });
  drawShip({
    context: context,
    transform: transform,
    coords: nexWorld.location,
  });

  context.restore();
};

const drawGrid = ({ context, transform }) => {
  context.closePath();
  context.beginPath();
  context.lineWidth = 0.5;
  context.strokeStyle = "rgba( 15, 35, 75,0.45)";

  let scale = 1;
  switch (true) {
    case transform.k < 0.05:
      scale = 100;
      break;
    case transform.k < 0.15:
      scale = 50;
      break;
    case transform.k < 0.35:
      scale = 20;
      break;
    case transform.k < 0.8:
      scale = 10;
      break;
    case transform.k < 1.4:
      scale = 5;
      break;
    default:
      scale = 1;
      break;
  }

  const offset = unitHeight / 2;
  for (let i = -gridWidth; i <= gridWidth; i += unitHeight * scale) {
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
  let scale = 1;
  switch (true) {
    case transform.k < 0.05:
      scale = 100;
      break;
    case transform.k < 0.15:
      scale = 50;
      break;
    case transform.k < 0.35:
      scale = 20;
      break;
    case transform.k < 0.8:
      scale = 10;
      break;
    case transform.k < 1.4:
      scale = 5;
      break;
    default:
      scale = 1;
      break;
  }

  const x = coords[0] * 10;
  const y = coords[1] * 10;
  context.save();
  context.translate(x, y);
  context.rotate((angle * Math.PI) / 180);
  //context.scale(scale, scale);
  context.translate(-x, -y);

  context.beginPath();
  context.fillStyle = "red";
  context.strokeStyle = "red";
  context.lineWidth = 0.25;
  context.moveTo(x, y);
  context.lineTo(x, y - 100);
  context.lineTo(x + 2, y - 98);
  context.lineTo(x - 2, y - 98);
  context.lineTo(x, y - 100);
  context.fill();
  context.stroke();
  context.closePath();

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

  context.fillStyle = "white";
  context.beginPath();
  context.moveTo(x - 3, y - 2);
  context.quadraticCurveTo(x, y - 3.5, x + 3, y - 2);
  context.fill();
  context.closePath();
  context.beginPath();
  context.moveTo(x, y + 1);
  context.quadraticCurveTo(x + 2, y - 1, x + 4, y + 1);
  context.lineTo(x - 4, y + 1);
  context.quadraticCurveTo(x - 2, y - 1, x, y + 1);
  context.fill();
  context.closePath();

  context.beginPath();
  context.strokeStyle = "black";
  context.lineWidth = 0.25;
  context.fillStyle = "	rgb(105,105,105)";
  context.arc(x, y - 2, 0.5, 0, 360, false);
  context.fill();
  context.stroke();
  context.closePath();
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
  context.strokeStyle = "rgba(0, 0, 0, 1)";
  context.lineWidth = 0;
  context.closePath();
  context.beginPath();
  path(feature);
  context.fill();
  //context.stroke();
  context.closePath();
};

const moveShip = (direction) => {
  let newCoords = [0, 0];
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

  nexWorld.direction = direction;
  nexWorld.location[0] += newCoords[0];
  nexWorld.location[1] += newCoords[1];
  nexWorld.move = [...newCoords];

  nexWorld.evt.dispatchEvent(
    new CustomEvent("nexWorld-location-update", {
      detail: [...nexWorld.location],
    })
  );
};

const center = (args) => {
  nexWorld.evt.dispatchEvent(
    new CustomEvent("nexWorld-location-center", {
      detail: args || [...nexWorld.location],
    })
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
};

export const nexWorld = {
  evt: new EventTarget(),
  component: NexDialog,
  //component: DraggableDialog,

  drawMap: drawMap,
  drawGrid: drawGrid,
  drawShip: drawShip,
  setLocation() {},
  moveShip: moveShip,
  startup: startup,
  center: center,

  unitHeight: unitHeight,
  unitWidth: unitWidth,
  topoj: topoj,
  location: [0, 0],
  move: [0, 0],
  direction: "se",
};

window.nexWorld = nexWorld;
nexWorld.startup();

//drawFeatures("reefs", "rgba( 100, 130, 180, 0.55)");
//drawFeatures("marsh", "rgba(  55, 140, 135, 0.88)");
//drawFeatures("grass", "rgba(  65, 150,  65, 0.25)");
