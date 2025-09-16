import React from "react";
import type { LineConfig } from "konva/lib/shapes/Line";
import { Layer, Line } from "react-konva";

interface PlayerProps {
  points: LineConfig["points"];
  stroke: string;
  children?: React.ReactNode;
}

export default function Player(props: PlayerProps) {
  const d: LineConfig = {
    points: props.points,
    stroke: props.stroke,
    strokeWidth: 1,
    tension: 0,
  };

  return (
    <Layer>
      <Line {...d} />
    </Layer>
  );
}
