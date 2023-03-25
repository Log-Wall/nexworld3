import { checkClosed, reverseCoords, stringToArc, topoj } from "./topo";

import NexDialog from "../components/NexDialog";
import { toggleDirs, longDirConversion } from "./tables";
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

const waveCall = ({ dir, num }) => {
  let newCoords = [0, 0];
  let direction = dir;
  /* // TODO Not sure how wavecall works with odd dirs
  if (Object.keys(toggleDirs).includes(direction)) {
    direction = toggleDirs[dir][nexWorld.directionToggle];
    nexWorld.directionToggle = nexWorld.directionToggle ? 0 : 1;
  }
  */

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

  nexWorld.location[0] += newCoords[0] * num;
  nexWorld.location[1] += newCoords[1] * num;
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

export const nexWorld = {
  evt: new EventTarget(),
  component: NexDialog,

  drawMap: drawMap,
  // Canvas variables provided by component
  selection: {},
  zoomRef: {},

  alias: alias,
  moveShip: moveShip,
  turnShip: turnShip,
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
  longDirs: longDirConversion,

  //DEBUG
  topoj: topoj,
  stringToArc: stringToArc,
  reverseCoords: reverseCoords,
  checkClosed: checkClosed,
};

window.nexWorld = nexWorld;
nexWorld.startup();
