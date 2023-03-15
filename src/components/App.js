import { useState } from "react";
import CoordinateDisplay from "./CoordinateDisplay";
import WorldMapCanvas from "./WorldMapCanvas";
import WorldMap from "./WorldMapTests";
import { nexWorld } from "../base/nexWorld";

function App() {
  const [coords, setCoords] = useState([0, 0]);
  return (
    <div className="App">
      <CoordinateDisplay coords={coords} />
      <WorldMapCanvas nexWorld={nexWorld} setCoords={setCoords} />
    </div>
  );
}

export default App;
