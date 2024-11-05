import { useEffect, useRef } from "react";
import { forceSimulation, forceX, forceY, forceCollide } from "d3";

export const useForceSimulation = <T extends { x: number; y: number }>(
  nodes: T[],
  radius: number
) => {
  const positions = useRef(nodes);

  useEffect(() => {
    const simulation = forceSimulation(positions.current)
      .force("x", forceX((d) => d.x ?? 0).strength(0.1))
      .force("y", forceY((d) => d.y ?? 0).strength(0.1))
      .force("collide", forceCollide().radius(1).iterations(10));

    simulation.alphaDecay(0.02).alphaMin(0.1);

    return () => {
      simulation.stop();
    };
  }, [radius]);

  return positions;
};
