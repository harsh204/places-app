import { useRef, useEffect } from "react";
import styles from "./Map.module.css";
import image from "../../../locationMarker.webp";

const Map = (props) => {
  const mapRef = useRef();

  const { center, zoom } = props;

  useEffect(() => {
    const iconFeature = new window.ol.Feature({
      geometry: new window.ol.geom.Point(
        window.ol.proj.fromLonLat([center.lng, center.lat])
      ),
      name: "Location",
    });

    new window.ol.Map({
      target: "map",
      layers: [
        new window.ol.layer.Tile({
          source: new window.ol.source.OSM(),
        }),
        new window.ol.layer.Vector({
          source: new window.ol.source.Vector({
            features: [iconFeature],
          }),
          style: new window.ol.style.Style({
            image: new window.ol.style.Icon({
              anchor: [0.5, 370],
              anchorXUnits: "fraction",
              anchorYUnits: "pixels",
              scale: 0.1,
              src: image,
            }),
          }),
        }),
      ],
      view: new window.ol.View({
        center: window.ol.proj.fromLonLat([center.lng, center.lat]),
        zoom: zoom,
      }),
    });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`${styles.map} ${props.className}`}
      style={props.style}
      id="map"
    ></div>
  );
};

export default Map;
