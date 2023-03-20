import WorldMapCanvas from "./WorldMapCanvas";

const NexWorld = ({ nexWorld, setCoords, width, height }) => {
  return (
    <div style={{ position: "relative", overflow: "visible" }}>
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
