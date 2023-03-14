import React, { useRef, useEffect } from "react";
import { select } from "d3-selection";
import { geoPath } from "d3-geo";
import { zoom, ZoomTransform, zoomTransform } from "d3-zoom";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const WorldMapCanvas = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = select(canvasRef.current);
    const context = canvasRef.current.getContext("2d");

    //const width = canvas.node().parentElement.clientWidth;
    //const height = canvas.node().parentElement.clientHeight;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scale = width / 2000;

    canvas.attr("width", width).attr("height", height);

    //const projection = (coords) => [coords[1] * scale, coords[1] * scale];
    const projection = (coords) => [coords[1], coords[1]];

    const path = geoPath().projection(projection).context(context);

    const drawGrid = (fr) => {
      const step = 10;
      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = "rgba( 15, 35, 75,0.45)";
      /*
      for (let i = 0; i <= 2000; i += step) {
        context.moveTo(i * scale, 0);
        context.lineTo(i * scale, 2000 * scale);
        context.moveTo(0, i * scale);
        context.lineTo(2000 * scale, i * scale);
      }*/
      for (let i = 0; i <= 2005; i += step) {
        context.moveTo(i + 5, 5);
        context.lineTo(i + 5, 2005);
        context.moveTo(5, i + 5);
        context.lineTo(2005, i + 5);
      }

      context.stroke();
    };

    canvas.call(
      zoom().on("zoom", (event) => {
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(event.transform.x, event.transform.y);
        context.scale(event.transform.k, event.transform.k);
        console.log(event.transform.k);
        drawGrid();
        context.restore();
      })
    );

    canvas.on("mousemove", (event) => {
      console.log(event);
      const [x, y] = d3.pointer(event);
      const r = zoomTransform(canvasRef.current);
      console.log(canvasRef.current);
      console.log(r);
      console.log(
        `Mouse coordinates: (${Math.round(
          (x - r.x) / (10 * r.k)
        )}, ${Math.round((y - r.y) / (10 * r.k))})`
      );
    });

    drawGrid();
  }, []);

  return <canvas ref={canvasRef} />;
};

export default WorldMapCanvas;
