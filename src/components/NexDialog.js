
import "react-resizable/css/styles.css";
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Dialog,
  Paper,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import NexWorld from "./NexWorld";
import CoordinateDisplays from "./CoordinateDisplays";
import CoordinateDisplay from "./CoordinateDisplay";
import ShipCoordinates from "./ShipCoordinates";

let darkTheme = createTheme({
  palette: {
    mode: "dark",
    /*text: {
      primary: "#FFF5D6",
      //secondary: 'green'
    },*/
  },
  typography: {
    fontSize: 12 * (14 / 16), // conversion for px
    fontFamily: ["Robot Mono", "Consolas", "Montserrat", "monospace"].join(","),
  },
});

darkTheme = createTheme(darkTheme, {
  components: {
    MuiList: {
      defaultProps: {
        sx: { color: "#FFF5D6" },
      },
    },
    MuiFormControlLabel: {
      defaultProps: {
        sx: { color: "#FFF5D6" },
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiPopover: {
      styleOverrides: {
        // Name of the slot
        paper: {
          // Some CSS
          background: "black",
          border: "1px solid white",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        determinate: {
          transition: "none",
          background: "blue",
        },
      },
    },
  },
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const NexDialog = ({ nexWorld }) => {
  const [open, setOpen] = useState(true);
  const [height, setHeight] = useState(500);
  const [width, setWidth] = useState(500);
  const [coords, setCoords] = useState([0, 0]);
  const [location, setLocation] = useState([0, 0]);

  useEffect(() => {
    nexWorld.evt.addEventListener("nexWorld-open-dialog", ({ detail }) => {
      setOpen(detail);
    });
    nexWorld.evt.addEventListener("nexWorld-location-update", ({ detail }) => {
      setLocation(detail);
    });
  }, []);

  const handleClickClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={open}
        onClose={handleClickClose}
        PaperComponent={PaperComponent}
        hideBackdrop={true}
        disableEnforceFocus
        style={{ pointerEvents: "none" }}
        maxWidth={false}
        PaperProps={{ style: { pointerEvents: "auto" } }}
        aria-labelledby="draggable-dialog-title"
      >
        <Resizable
          height={height}
          width={width}
          onResize={(event, data) => {
            setHeight(height + event.movementY);
            setWidth(width + event.movementX);
          }}
        >
          <>
            <DialogTitle>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  pointerEvents: "none",
                  cursor: "move",
                }}
              >
                <span>nexWorld Map</span>
                <CoordinateDisplays location={location} coords={coords} />
              </div>
            </DialogTitle>
            <DialogContent
              sx={{
                background: "#121212",
                height: `${height}px`,
                width: `${width}px`,
                overflow: "hidden",
                padding: 0,
              }}
            >
              <NexWorld
                nexWorld={nexWorld}
                setCoords={setCoords}
                width={width}
                height={height}
              />
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={() => {
                  nexWorld.center(nexWorld.location);
                }}
              >
                Recenter
              </Button>
              <Button onClick={handleClickClose}>close</Button>
            </DialogActions>
          </>
        </Resizable>
      </Dialog>
    </ThemeProvider>
  );
};

export default NexDialog;
//nexSys.evt.dispatchEvent(new CustomEvent('nexSys-config-dialog', {detail: true}))
