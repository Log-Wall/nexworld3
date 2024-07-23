import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { topoj } from "../base/topo";

const TopologyMap = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    // Clear any existing SVG content
    svg.selectAll("*").remove();

    // Extract the bounding box for projection fitting
    const geojson = feature(
      topoj,
      topoj.objects[Object.keys(topoj.objects)[0]]
    );
    const bounds = d3.geoBounds(geojson);
    const centerX = (bounds[0][0] + bounds[1][0]) / 2;
    const centerY = (bounds[0][1] + bounds[1][1]) / 2;

    // Create a projection and path generator
    const projection = d3
      .geoMercator()
      .center([centerX, centerY])
      .fitSize([width, height], geojson);

    const path = d3.geoPath().projection(projection);

    // Extract categories and their geometries
    const categories = Object.keys(topoj.objects);

    categories.forEach((category) => {
      const geometries = topoj.objects[category].geometries;
      const geojson = feature(topoj, topoj.objects[category]);

      // Log data for debugging
      console.log(`Category: ${category}`, geojson);

      // Append a group for each category
      const categoryGroup = svg.append("g").attr("class", category);

      // Draw geometries
      categoryGroup
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", 0.5);
    });
  }, []);

  return <svg ref={svgRef} width={800} height={600}></svg>;
};

export default TopologyMap;
