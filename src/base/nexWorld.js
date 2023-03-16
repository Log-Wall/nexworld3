import * as topojson from "topojson-client";
import { topoj } from "./topo";

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
const gridWidth = 20000;
const gridHeight = 20000;

const drawMap = ({ context, path, transform }) => {
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
    rgba: 'rgba(  85,  55,   1, 0.65)',
  });
  drawFeatures({
    context: context,
    path: path,
    type: "nnnbr",
    rgba: 'rgba( 165, 135, 100, 0.75)',
  });
  drawFeatures({
    context: context,
    path: path,
    type: "___br",
    rgba: 'rgba( 200, 180, 145, 0.65)',
  });
  drawFeatures({
    context: context,
    path: path,
    type: "...wt",
    rgba: 'rgba( 200, 200, 215, 0.65)',
  });
  drawFeatures({
    context: context,
    path: path,
    type: "WWbwn",
    rgba: 'rgba(  95,  45,  45, 0.55)',
  });
  drawFeatures({
    context: context,
    path: path,
    type: "YYred",
    rgba: 'rgba( 215,  25,   5, 0.25)',
  });
  drawFeatures({
    context: context,
    path: path,
    type: "__blk",
    rgba: 'rgba(  15,  15,  15, 0.75)',
  });
  drawFeatures({
    context: context,
    path: path,
    type: "##bwn",
    rgba: 'rgba( 110,  85,  60, 0.75)',
  });
  drawFeatures({
    context: context,
    path: path,
    type: "..blk",
    rgba: 'rgba( 165,  15,  15, 0.35)',
  });
  drawFeatures({
    context: context,
    path: path,
    type: "##ylw",
    rgba: 'rgba( 165, 206,  65, 0.35)',
  });
  drawFeatures({
    context: context,
    path: path,
    type: "..wht",
    rgba: 'rgba( 200, 200, 215, 0.65)',
  });
  drawFeatures({
    context: context,
    path: path,
    type: "mmblk",
    rgba: 'rgba( 165, 206,  65, 0.35)',
  });

  drawGrid({ context: context, transform: transform });
};

const drawGrid = ({ context, transform }) => {
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

export const nexWorld = {
  drawMap: drawMap,
  drawGrid: drawGrid,
  unitHeight: unitHeight,
  unitWidth: unitWidth,
  topoj: topoj,
};

window.nexWorld = nexWorld;

//drawFeatures("reefs", "rgba( 100, 130, 180, 0.55)");
//drawFeatures("marsh", "rgba(  55, 140, 135, 0.88)");
//drawFeatures("grass", "rgba(  65, 150,  65, 0.25)");
