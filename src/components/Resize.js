import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

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

export default function DraggableDialog() {
  const [open, setOpen] = React.useState(true);
  const [height, setHeight] = React.useState(100);
  const [width, setWidth] = React.useState(300);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
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
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Drag Me
          </DialogTitle>
          <DialogContent>
            <DialogContentText height={`${height}px`} width={`${width}px`}>
              Resize using the control in the bottom right corner.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </>
      </Resizable>
    </Dialog>
  );
}
