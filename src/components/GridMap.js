import { useRef, useEffect } from "react";

const GridMap = () => {
  const svgRef = useRef(null);
  const gridStepRef = useRef(10);

  useEffect(() => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Define the grid step
    const step = gridStepRef.current;

    // Create the SVG element
    const svg = select(svgRef.current);

    // Draw horizontal lines
    for (let i = -height / 2; i <= height / 2; i += step) {
      svg
        .append("line")
        .attr("x1", -width / 2)
        .attr("y1", i)
        .attr("x2", width / 2)
        .attr("y2", i)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    }

    // Draw vertical lines
    for (let i = -width / 2; i <= width / 2; i += step) {
      svg
        .append("line")
        .attr("x1", i)
        .attr("y1", -height / 2)
        .attr("x2", i)
        .attr("y2", height / 2)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="-250 -250 500 500"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default GridMap;
