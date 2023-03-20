import React, { useRef, useEffect, useState } from "react";
import { select } from "d3-selection";
import { geoPath } from "d3-geo";
import { zoom, zoomTransform } from "d3-zoom";
import * as d3 from "d3";

const WorldMapCanvas = ({ nexWorld, setCoords, width, height }) => {
  const [location, setLocation] = useState([0, 0]);
  const [center, setCenter] = useState([0, 0]);
  const [context, setContext] = useState();
  const [zoomState, setZoomState] = useState();
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
    console.log("render");
    const canvas = select(canvasRef.current);
    const context = canvasRef.current.getContext("2d" /*, { alpha: false }*/);
    const path = geoPath().context(context);
    pathRef.current = path;

    setContext(context);

    canvas.attr("width", width).attr("height", height);

    zoomRef.current = zoom()
      .scaleExtent([1 / 27, 85])
      .translateExtent([
        [-10000, -10000], // set your desired min x and min y values
        [width + 10000, height + 10000], // set your desired max x and max y values
      ])
      .on("zoom", ({ transform }) => {
        context.save();
        context.clearRect(0, 0, width, height);
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);
        nexWorld.drawMap({
          context: context,
          zoom: zoomRef.current,
          path: path,
          width: width,
          height: height,
          transform: transform,
        });
        context.restore();
        console.log("zoom event");
        console.log([width, height]);
        console.log(transform);
        setZoomState(transform);
      })
      .on("end", () => {
        console.log("end");
      });

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
    nexWorld.drawMap({
      context: context,
      zoom: zoomRef.current,
      path: path,
      width: width,
      height: height,
      transform: zoomTransform(canvasRef.current),
    });

    // Set initial starting coordinate view [0, 0]
    zoomRef.current.translateTo(
      select(canvasRef.current),
      location[0],
      location[1]
    );
    // Set initial zoom scale
    zoomRef.current.scaleTo(select(canvasRef.current), 2);

    context.restore();

    window.cc1 = canvas;
    window.zr = zoomRef.current;
    window.zt = zoomTransform(canvasRef.current);
  }, [width, height]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    console.log("location");
    //console.log(zoomRef.current.transform());
    const zt = zoomTransform(canvasRef.current);
    nexWorld.drawMap({
      context: context,
      zoom: zoomRef.current,
      path: pathRef.current,
      width: width,
      height: height,
      transform: zt,
    });

    zoomRef.current.translateTo(
      select(canvasRef.current),
      zt.x / 10,
      zt.y / 10
    );
    // Set initial zoom scale
    zoomRef.current.transform(select(canvasRef.current), zoomState);
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
        //position: "absolute",
      }}
    />
  );
};

export default WorldMapCanvas;
