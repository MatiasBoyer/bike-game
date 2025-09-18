import React, { useEffect, useState } from "react";
import type { LineConfig } from "konva/lib/shapes/Line";
import { Layer, Line, Rect } from "react-konva";

interface PlayerProps {
  points: LineConfig["points"];
  stroke: string;
  width: number;
  isAlive: boolean;
  children?: React.ReactNode;
}

const rect_size = 2.5;

export default function Player(props: PlayerProps) {
  const d: LineConfig = {
    points: props.points,
    stroke: props.stroke,
    strokeWidth: props.width,
    tension: 0,
  };

  const fill = ["transparent", props.stroke];
  const [currentFill, setCurrentFill] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentFill((prev) => {
        if (prev === 1) return 0;
        return 1;
      });
    }, 20);

    return () => clearInterval(iv);
  }, []);

  return (
    <Layer>
      {d.points && d.points.length >= 4 && props.isAlive === true && (
        <Rect
          x={d.points[d.points.length - 2] - rect_size / 2}
          y={d.points[d.points.length - 1] - rect_size / 2}
          width={rect_size}
          height={rect_size}
          fill={fill[currentFill]}
        />
      )}
      <Line {...d} />
    </Layer>
  );
}
