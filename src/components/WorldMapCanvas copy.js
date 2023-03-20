import React, { useRef, useEffect, useState } from "react";
import { select } from "d3-selection";
import { geoPath } from "d3-geo";
import { zoom, zoomTransform } from "d3-zoom";
import * as d3 from "d3";

const WorldMapCanvas = ({ nexWorld, setCoords }) => {
  const [location, setLocation] = useState([10, 10]);
  const [center, setCenter] = useState([0, 0]);
  const [context, setContext] = useState();
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [firstRender, setFirstRender] = useState(true);

  const canvasRef = useRef();
  const zoomRef = useRef();
  const pathRef = useRef();

  const projection = (coords) => {
    const [x, y] = [...coords];
    return [
      width / 2 - x * nexWorld.unitWidth,
      height / 2 - y * nexWorld.unitHeight,
    ];
  };

  nexWorld.evt.addEventListener("nexWorld-location-update", ({ detail }) => {
    setLocation(detail);
  });

  nexWorld.evt.addEventListener("nexWorld-location-center", ({ detail }) => {
    setCenter(detail);
  });

  useEffect(() => {
    const canvas = select(canvasRef.current);
    const context = canvasRef.current.getContext("2d" /*, { alpha: false }*/);
    const path = geoPath().context(context);
    pathRef.current = path;
    const width = window.innerWidth;
    const height = window.innerHeight;

    setContext(context);
    setWidth(width);
    setHeight(height);

    canvas.attr("width", width).attr("height", height);

    nexWorld.width = width;
    nexWorld.height = height;
    window.cc1 = canvas;

    zoomRef.current = zoom()
      .scaleExtent([1 / 27, 85])
      .on("zoom", ({ transform }) => {
        console.log("zoom");
        context.save();
        context.clearRect(0, 0, width, height);
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);
        nexWorld.drawMap({
          context: context,
          zoom: zoomRef.current,
          path: path,
          transform: transform,
        });
        context.restore();
      });
    window.zr = zoomRef.current;
    canvas.call(zoomRef.current);

    canvas.on("mousemove", (event) => {
      const [x, y] = d3.pointer(event);
      const r = zoomTransform(canvasRef.current);
      setCoords([
        Math.round((x - r.x) / (10 * r.k)),
        Math.round((y - r.y) / (10 * r.k)),
      ]);
    });

    context.save();
    context.clearRect(0, 0, width, height);
    nexWorld.drawMap({
      context: context,
      zoom: zoomRef.current,
      path: path,
      transform: zoomTransform(canvasRef.current),
    });

    // Set initial starting coordinate view [0, 0]
    zoomRef.current.translateTo(select(canvasRef.current), 0, 0);
    // Set initial zoom scale
    zoomRef.current.scaleTo(select(canvasRef.current), 2);

    context.restore();
  }, []);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    const path = geoPath().context(context);
    console.log(nexWorld.move);
    //const newTransform = { ...transform };
    //newTransform.x -= nexWorld.move[0] * 15;
    //newTransform.y -= nexWorld.move[1] * 15;

    context.save();
    context.clearRect(0, 0, width, height);
    context.scale(
      zoomTransform(canvasRef.current).k,
      zoomTransform(canvasRef.current).k
    );
    const coords = projection(location);
    //console.log(coords);
    context.translate(coords[0], coords[1]);
    //context.translate(newTransform.x, newTransform.y);
    //context.scale(newTransform.k, newTransform.k);
    //zoomRef.current.translateBy(select(canvasRef.current), canvasRef.current.width / 2 - (location[0] * nexWorld.unitWidth), canvasRef.current.height / 2 + (location[1] * nexWorld.unitHeight));
    nexWorld.drawMap({
      context: context,
      zoom: zoomRef.current,
      path: path,
      //transform: newTransform || context.getTransform(),
      transform: zoomTransform(canvasRef.current),
    });

    context.restore();

    //setTransform({ ...newTransform });
  }, [location]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    console.log("center");
    const newTransform = { x: 1, y: 2, k: 1 };

    // create a new CustomEvent for the zoom event with the new transform values
    //zoomRef.current.scaleTo(select(canvasRef.current), 0.5);
    zoomRef.current.translateTo(
      select(canvasRef.current),
      center[0] * nexWorld.unitWidth,
      center[1] * nexWorld.unitHeight
    );
  }, [center]);

  useEffect(() => {
    window.ctx = context;
  }, [context]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        background: "rgba(20, 60, 135, 0.93)",
        position: "absolute",
        //position: "relative",
        left: "50%",
        top: "50%",
        //width: "960",
        //height: "500",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

export default WorldMapCanvas;
