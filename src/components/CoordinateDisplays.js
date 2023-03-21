const CoordinateDisplays = ({ location, coords }) => {
  return (
    <div>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>[Ship] </span>
        <span>
          <span>X: {location[0]}, </span>
          <span>Y: {location[1]}</span>
        </span>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ marginRight: 10 }}>[Pointer]</span>
        <span>
          <span>X: {coords[0]}, </span>
          <span>Y: {coords[1]}</span>
        </span>
      </div>
    </div>
  );
};

export default CoordinateDisplays;
