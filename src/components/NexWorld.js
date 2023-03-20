import WorldMapCanvas from "./WorldMapCanvas";

const NexWorld = ({ nexWorld, setCoords, width, height }) => {
  return (
    <div>
      <WorldMapCanvas
        nexWorld={nexWorld}
        setCoords={setCoords}
        width={width}
        height={height}
      />
    </div>
  );
};

export default NexWorld;
