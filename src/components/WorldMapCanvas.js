import React, { useRef, useEffect } from "react";
import { select } from "d3-selection";
import { geoPath } from "d3-geo";
import { zoom, zoomTransform, translate } from "d3-zoom";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { topoj } from "../base/topo";

const WorldMapCanvas = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = select(canvasRef.current);
    const context = canvasRef.current.getContext("2d");

    //const width = canvas.node().parentElement.clientWidth;
    //const height = canvas.node().parentElement.clientHeight;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const gridWidth = 20000;
    const gridHeight = 20000;
    const unitWidth = 10;
    const unitHeight = 10;

    canvas.attr("width", width).attr("height", height);

    //const projection = (coords) => [coords[1] * scale, coords[1] * scale];
    const projection = (coords) => [coords[0.5], coords[0.5]];

    const path = geoPath().context(context);

    const drawGrid = (fr) => {
      context.beginPath();
      context.lineWidth = 0.5;
      context.strokeStyle = "rgba( 15, 35, 75,0.45)";
      /*
      for (let i = 0; i <= 2000; i += step) {
        context.moveTo(i * scale, 0);
        context.lineTo(i * scale, 2000 * scale);
        context.moveTo(0, i * scale);
        context.lineTo(2000 * scale, i * scale);
      }*/
      let scale = 1;
      switch (true) {
        case fr < 0.05:
          scale = 100;
          break;
        case fr < 0.15:
          scale = 50;
          break;
        case fr < 0.35:
          scale = 20;
          break;
        case fr < 0.8:
          scale = 10;
          break;
        case fr < 1.4:
          scale = 5;
          break;
        default:
          scale = 1;
          break;
      }

      const offset = unitHeight / 2;
      for (let i = -gridWidth; i <= gridWidth; i += unitHeight * scale) {
        context.moveTo(i + offset, -gridHeight);
        context.lineTo(i + offset, gridHeight);
        context.moveTo(-gridWidth, i + offset);
        context.lineTo(gridWidth, i + offset);
      }

      context.stroke();
    };

    const drawFeatures = (type, rgb) => {
      const feature = topojson.feature(topoj, topoj.objects[type]);
      console.log(topoj);
      context.fillStyle = rgb;
      //context.strokeStyle = "rgba(0, 0, 0, 1)";
      context.lineWidth = 0;
      context.closePath();
      context.beginPath();
      path(feature);
      context.fill();
      //context.stroke();
      context.closePath();
    };

    canvas.call(
      zoom().on("zoom", (event) => {
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(event.transform.x, event.transform.y);
        context.scale(event.transform.k, event.transform.k);
        console.log(event.transform.k);
        drawGrid(event.transform.k);
        drawFeatures("reefs", "rgba( 100, 130, 180, 0.55)");
        //drawFeatures("marsh", "rgba(  55, 140, 135, 0.88)");
        //drawFeatures("grass", "rgba(  65, 150,  65, 0.85)");
        context.restore();
      })
    );

    canvas.on("mousemove", (event) => {
      //console.log(event);
      const [x, y] = d3.pointer(event);
      const r = zoomTransform(canvasRef.current);
      //console.log(canvasRef.current);
      //console.log(r);
      console.log(
        `Mouse coordinates: (${Math.round(
          (x - r.x) / (10 * r.k)
        )}, ${Math.round((y - r.y) / (10 * r.k))})`
      );
    });

    drawGrid();
    drawFeatures("reefs", "rgba( 100, 130, 180, 0.55)");
    //drawFeatures("marsh", "rgba(  55, 140, 135, 0.88)");
    //drawFeatures("grass", "rgba(  65, 150,  65, 0.85)");
  }, []);

  return <canvas ref={canvasRef} />;
};

export default WorldMapCanvas;
