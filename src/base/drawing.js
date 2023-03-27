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
import "./topographies/islands/tapoa";
import "./topographies/islands/tearsOfSarapis";
import "./topographies/islands/tuar";
import "./topographies/islands/ulangi";
import "./topographies/islands/zanzibar";

import "./topographies/chops/chopsWest";
import "./topographies/chops/chopsNorth";
import "./topographies/chops/chopsTasurke";
import "./topographies/chops/chopsTenwat";
import "./topographies/chops/chopsTapoa";

import "./topographies/roughs/roughsWest";
import "./topographies/roughs/roughsPhereklos";
import "./topographies/roughs/roughsAgeiro";
import "./topographies/roughs/roughsHaraeSouth";
import "./topographies/roughs/roughsZanzibar";
import "./topographies/roughs/roughsSouth";

import { topoj } from "./topo";
import { topographies } from "./tables";
import * as topojson from "topojson-client";
import { harbours } from "./points/harbours";
import monster from "./sea-serpent.svg";

export const unitWidth = 10;
export const unitHeight = 10;
export const gridWidth = 10000;
export const gridHeight = 10000;
const leaderLine = {
  color: "red",
  length: 200,
};

const scaling = (k) => {
  let scale = 1;
  switch (true) {
    case k < 0.05:
      scale = 50; //100;
      break;
    case k < 0.15:
      scale = 25;
      break;
    case k < 0.35:
      scale = 10;
      break;
    case k < 0.8:
      scale = 5;
      break;
    case k < 1:
      scale = 1;
      break;
    default:
      scale = 1;
      break;
  }

  return scale;
};

export const drawMap = ({ context, path, transform, width, height }) => {
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

  traceFeature({ context: context, path: path });
  tracePoint({ context: context });

  drawGrid({ context: context, transform: transform });

  for (const id in harbours) {
    drawPoint({
      context: context,
      transform: transform,
      coords: harbours[id].coordinates,
      rgba: harbours[id].color,
      radius: 5,
    });

    drawLabel({
      context: context,
      transform: transform,
      coords: harbours[id].coordinates,
      text: id,
    });
  }

  drawShip({
    context: context,
    transform: transform,
    coords: nexWorld.location,
  });

  //const ss = new Image();
  //ss.src = monster;
  //context.drawImage(ss, 2 * 10 - 5, 4 * 10 - 5, 10, 10);

  context.restore();
};

const drawGrid = ({ context, transform }) => {
  const scale = scaling(transform.k);

  context.closePath();
  context.beginPath();
  context.lineWidth = 0.5 * scale;
  context.strokeStyle = "rgba( 15, 35, 75,0.75)";

  const offset = (unitWidth / 2) * scale;
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
  nexWorld.geoj[type] = feature;
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
  coords = [coords[0] * unitWidth, coords[1] * -unitHeight];
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

  context.closePath();
};

const drawLabel = ({ context, transform, coords, text }) => {
  coords = [coords[0] * unitWidth, coords[1] * -unitHeight];

  const scale = scaling(transform.k);
  context.strokeStyle = "black";
  context.font = `bold ${12 * (scale / 2)}px RobotoMono Consolas monospace`;
  context.strokeText(text, coords[0] - 2.5, coords[1] - 6.25);
  context.fillStyle = "silver";
  context.font = `bold ${12 * (scale / 2)}px RobotoMono Consolas monospace`;
  context.fillText(text, coords[0] - 2.5, coords[1] - 6.25);
};

const traceFeature = ({ context, path }) => {
  const feature = topojson.feature(
    nexWorld.traceTopo,
    nexWorld.traceTopo.objects.trace
  );
  context.fillStyle = "red";
  context.strokeStyle = "rgba(0, 0, 0, 1)";
  context.lineWidth = 0;
  context.closePath();
  context.beginPath();
  path(feature);
  context.fill();
  context.stroke(); // Do we want outlines? Maybe for reefs?
  context.closePath();
};
const tracePoint = ({ context }) => {
  // TODO How should we color the port points? All the same or by another metric?
  const startCoords = nexWorld.traceTopo.arcs[0][0].map((val) => val * 10);
  const endCoords = nexWorld.traceTopo.arcs[0]
    .reduce((acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]], [0, 0])
    .map((val) => val * 10);
  if (startCoords[0] === endCoords[0] && startCoords[1] === endCoords[1]) {
    console.log(JSON.stringify(nexWorld.traceTopo.arcs[0]));
  }
  context.closePath();
  context.beginPath();
  context.fillStyle = "black";
  context.moveTo(startCoords[0], startCoords[1]);
  context.arc(startCoords[0], startCoords[1], 2.5, 0, 2 * Math.PI);
  context.fill();
  context.closePath();
  context.beginPath();
  context.fillStyle = "yellow";
  context.moveTo(endCoords[0], endCoords[1]);
  context.arc(endCoords[0], endCoords[1], 2.5, 0, 2 * Math.PI);

  context.fill();

  context.closePath();
};
