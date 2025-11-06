import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const RotatingEarth = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Create root element
    const root = am5.Root.new(chartRef.current);

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the map chart
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
      })
    );

    // Create main polygon series for countries
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
      })
    );

    // Style polygons
    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x4da6ff),
      fillOpacity: 0.8,
      strokeWidth: 0.5,
      stroke: am5.color(0x66b3ff),
    });

    // Add hover effect
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x66b3ff),
      fillOpacity: 1,
    });

    // Create background series for graticules (grid lines)
    const backgroundSeries = chart.series.unshift(
      am5map.MapPolygonSeries.new(root, {})
    );

    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color(0x1a2b3d),
      fillOpacity: 0.3,
      strokeOpacity: 0,
    });

    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    });

    // Add graticule series for grid lines
    const graticuleSeries = chart.series.push(
      am5map.GraticuleSeries.new(root, {})
    );

    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0x4da6ff),
      strokeOpacity: 0.15,
    });

    // Enable rotation animation
    chart.animate({
      key: "rotationX",
      from: 0,
      to: 360,
      duration: 60000,
      loops: Infinity,
    });

    // Make stuff animate on load
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        ref={chartRef}
        className="w-full h-full min-h-[500px]"
        style={{ maxWidth: "600px", maxHeight: "600px" }}
      />
    </div>
  );
};

export default RotatingEarth;
