import {
  checkClosed,
  reverseCoords,
  WASDToArc,
  NESWToArc,
  topoj,
} from "./topo";

import NexDialog from "../components/NexDialog";
import { toggleDirs, longDirConversion, directionCoords } from "./tables";
import { drawMap, unitHeight, unitWidth } from "./drawing";

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
    direction = nexWorld.toggleDirs[dir][nexWorld.directionToggle];
    nexWorld.directionToggle = nexWorld.directionToggle ? 0 : 1;
  }

  newCoords = directionCoords[direction];

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

const waveCall = (dir, num) => {
  let newCoords = [0, 0];
  let direction = dir;
  /* // TODO Not sure how wavecall works with odd dirs
  if (Object.keys(toggleDirs).includes(direction)) {
    direction = toggleDirs[dir][nexWorld.directionToggle];
    nexWorld.directionToggle = nexWorld.directionToggle ? 0 : 1;
  }
  */

  newCoords = directionCoords[direction];

  nexWorld.location[0] += newCoords[0] * num;
  nexWorld.location[1] += newCoords[1] * num;
  nexWorld.move = [...newCoords];

  console.log(nexWorld.location);
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

const goto = (coords) => {
  nexWorld.follow = true;

  nexWorld.zoomRef.translateTo(
    nexWorld.selection,
    coords[0] * nexWorld.unitWidth,
    coords[1] * nexWorld.unitHeight
  );
};

const open = () => {
  nexWorld.evt.dispatchEvent(
    new CustomEvent("nexWorld-open-dialog", {
      detail: true,
    })
  );
};

const alias = (id, args) => {
  switch (id) {
    case "open":
      open();
      break;
    case "move":
      moveShip(args);
      break;
    case "turn":
      turnShip(args);
      break;
    case "center":
      center(args);
      break;
    case "goto":
      goto(args);
      break;
    default:
      console.log("nexWorld: Invalid alias sent");
  }
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

const traceTopo = {
  type: "Topology",
  transform: { scale: [10, 10], translate: [0, 0] }, // This will be overwritten later
  arcs: [[[0, 0]]],
  objects: {
    trace: {
      type: "GeometryCollection",
      geometries: [{ type: "Polygon", id: "Trace", arcs: [[0]] }],
    },
  },
};
const traceInsert = (dir) => {
  const newCoords = directionCoords[dir];
  if (nexWorld.traceLastDir === dir) {
    let lastArc = [...traceTopo.arcs[0].at(-1)];
    lastArc[0] += newCoords[0];
    lastArc[1] += newCoords[1];
    traceTopo.arcs[0][traceTopo.arcs[0].length - 1] = [...lastArc];
    console.log(traceTopo.arcs[0].length + lastArc[0] + lastArc[1]);
    nexWorld.setTraceCount(traceTopo.arcs[0].length + lastArc[0] + lastArc[1]);
  } else {
    traceTopo.arcs[0].push([...newCoords]);
    nexWorld.setTraceCount(traceTopo.arcs[0].length);
  }
  nexWorld.traceLastDir = dir;
};
const traceUndo = () => {
  traceTopo.arcs[0].pop();
  nexWorld.setTraceCount(traceTopo.arcs[0].length);
};
const traceStart = (coords) => {
  traceTopo.arcs[0][0] = [...coords];
  nexWorld.traceLastDir = false;
};
const traceReset = () => {
  traceTopo.arcs = [[[0, 0]]];
  nexWorld.traceLastDir = false;
};

export const nexWorld = {
  evt: new EventTarget(),
  component: NexDialog,

  drawMap: drawMap,
  // Canvas variables provided by component
  selection: {},
  zoomRef: {},

  moveShip: moveShip,
  turnShip: turnShip,
  waveCall: waveCall,
  startup: startup,
  center: center,
  open: open,
  goto: goto,
  alias: alias,

  unitHeight: unitHeight,
  unitWidth: unitWidth,
  location: [0, 0],
  move: [0, 0],
  direction: "se",
  follow: true,
  directionToggle: 0,
  toggleDirs: toggleDirs,
  longDirs: longDirConversion,

  //DEBUG
  topoj: topoj,
  geoj: {},
  WASDToArc: WASDToArc,
  NESWToArc: NESWToArc,
  reverseCoords: reverseCoords,
  checkClosed: checkClosed,

  //Tracing
  traceTopo: traceTopo,
  traceInsert: traceInsert,
  traceStart: traceStart,
  traceReset: traceReset,
  traceUndo: traceUndo,
  traceLastDir: false,
};

window.nexWorld = nexWorld;
nexWorld.startup();
