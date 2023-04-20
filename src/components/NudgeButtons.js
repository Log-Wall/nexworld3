import { Button, ButtonGroup, IconButton, Icon } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowDown,
  faArrowRight,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

const NudgeButtons = () => {
  const handleClick = (dir) => {
    nexWorld.waveCall(dir, 1);
  };
  return (
    <>
      <ButtonGroup>
        <IconButton
          onClick={() => {
            handleClick("w");
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </IconButton>
        <IconButton
          onClick={() => {
            handleClick("n");
          }}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </IconButton>
        <IconButton
          onClick={() => {
            handleClick("s");
          }}
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </IconButton>
        <IconButton
          onClick={() => {
            handleClick("e");
          }}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </IconButton>
      </ButtonGroup>
    </>
  );
};

export default NudgeButtons;
