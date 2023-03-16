import React, { useRef, useEffect, useState } from "react";
import { select } from "d3-selection";
import { geoPath } from "d3-geo";
import { zoom, zoomTransform } from "d3-zoom";
import * as d3 from "d3";

const WorldMapCanvas = ({ nexWorld, setCoords }) => {
  const [location, setLocation] = useState([0, 0]);
  nexWorld.setLocation = setLocation;
  const canvasRef = useRef();
  const z = zoom().scaleExtent([1 / 27, 85]);

  useEffect(() => {
    const canvas = select(canvasRef.current);
    const context = canvasRef.current.getContext("2d"/*, { alpha: false }*/);
    nexWorld.context = context;
    //setContextState(context);

    //const width = canvas.node().parentElement.clientWidth;
    //const height = canvas.node().parentElement.clientHeight;
    const width = window.innerWidth;
    const height = window.innerHeight;


    canvas.attr("width", width).attr("height", height);

    const path = geoPath().context(context);
    window.cc1 = context;
    window.z = zoom();

    canvas.call(
      z.on("zoom", (event) => {
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(event.transform.x, event.transform.y);
        context.scale(event.transform.k, event.transform.k);

        nexWorld.drawMap({ context: context, zoom: z, path: path, transform: event.transform });
        nexWorld.drawShip({
          coords: nexWorld.location,
        });
        console.log(nexWorld.location);
      })
    );

    canvas.on("mousemove", (event) => {
      //console.log(event);
      const [x, y] = d3.pointer(event);
      const r = zoomTransform(canvasRef.current);
      //console.log(canvasRef.current);
      //console.log(r);
      setCoords([Math.round(
        (x - r.x) / (10 * r.k)
      ), Math.round((y - r.y) / (10 * r.k))]);
      return;
      console.log(
        `Mouse coordinates: (${Math.round(
          (x - r.x) / (10 * r.k)
        )}, ${Math.round((y - r.y) / (10 * r.k))})`
      );
    });

    nexWorld.drawMap({ context: context, zoom: z, path: path, transform: context.getTransform() });

    nexWorld.drawShip({
      coords: nexWorld.location,
    });

    // Set initial starting coordinate view [0, 0]
    z.translateBy(select(canvasRef.current), canvasRef.current.width / 2 - (0 * nexWorld.unitWidth), canvasRef.current.height / 2 + (0 * nexWorld.unitHeight));
    // Set initial zoom scale
    z.scaleTo(select(canvasRef.current), 1.5);
  }, []);

  useEffect(() => {
    nexWorld.location = location;
    console.log(location);
  }, [location]);

  return <canvas ref={canvasRef} style={{
    background: "rgba(20, 60, 135, 0.93)",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  }} />;
};

export default WorldMapCanvas;
