import React, { useRef, useEffect, useState } from "react";
import { select } from "d3-selection";
import { geoPath } from "d3-geo";
import { zoom, zoomTransform } from "d3-zoom";
import * as d3 from "d3";

const WorldMapCanvas = ({ nexWorld, setCoords }) => {
  const [location, setLocation] = useState([10, 15]);
  const [context, setContext] = useState();
  const [canvas, setCanvas] = useState();
  const [path, setPath] = useState();
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [transform, setTransform] = useState();
  const [firstRender, setFirstRender] = useState(true);
  const canvasRef = useRef();
  const zoomRef = useRef();
  const z = zoom().scaleExtent([1 / 27, 85]);
  zoomRef.current = z;
  window.z = zoomRef.current;


  nexWorld.evt.addEventListener("nexWorld-location-update", ({ detail }) => {
    setLocation(detail);
  });



  useEffect(() => {
    const canvas = select(canvasRef.current);
    const context = canvasRef.current.getContext("2d"/*, { alpha: false }*/);
    const path = geoPath().context(context);
    window.cc1 = canvas;
    setCanvas(canvas);
    setContext(context);
    setPath(path);

    //const width = canvas.node().parentElement.clientWidth;
    //const height = canvas.node().parentElement.clientHeight;
    const width = window.innerWidth;
    const height = window.innerHeight;
    setWidth(width);
    setHeight(height);

    canvas.attr("width", width).attr("height", height);

    canvas.call(
      zoomRef.current.on("zoom", (event) => {
        setTransform(event.transform);
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(event.transform.x, event.transform.y);
        context.scale(event.transform.k, event.transform.k);

        nexWorld.drawMap({ context: context, zoom: z, path: path, transform: event.transform });
      })
    );

    canvas.on("mousemove", (event) => {
      const [x, y] = d3.pointer(event);
      const r = zoomTransform(canvasRef.current);
      setCoords([Math.round(
        (x - r.x) / (10 * r.k)
      ), Math.round((y - r.y) / (10 * r.k))]);
    });

    context.clearRect(0, 0, width, height);
    context.save();
    nexWorld.drawMap({ context: context, zoom: z, path: path, transform: context.getTransform() });

    // Set initial starting coordinate view [0, 0]
    zoomRef.current.translateBy(select(canvasRef.current), canvasRef.current.width / 2 - (0 * nexWorld.unitWidth), canvasRef.current.height / 2 + (0 * nexWorld.unitHeight));
    // Set initial zoom scale
    zoomRef.current.scaleTo(select(canvasRef.current), 1.5);
    console.log('rednder');
  }, []);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    const path = geoPath().context(context);
    console.log(nexWorld.move);
    transform.x -= nexWorld.move[0] * 15;
    transform.y -= nexWorld.move[1] * 15;
    context.save();
    context.clearRect(0, 0, width, height);
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);
    //zoomRef.current.translateBy(select(canvasRef.current), canvasRef.current.width / 2 - (location[0] * nexWorld.unitWidth), canvasRef.current.height / 2 + (location[1] * nexWorld.unitHeight));
    nexWorld.drawMap({ context: context, zoom: z, path: path, transform: transform || context.getTransform() });

    context.restore();
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
