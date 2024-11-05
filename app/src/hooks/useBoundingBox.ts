import { useEffect, useState } from "react";

export const useBoundingBox = <T extends {x: number; y: number}>(nodes: T[]) => {
    const [minY, setMinY] = useState<number>(0);
    const [maxY, setMaxY] = useState<number>(0);
    const [minX, setMinX] = useState<number>(0);
    const [maxX, setMaxX] = useState<number>(0);

    useEffect(() => {
        setMinY(Math.min(...nodes.map((node) => node.y)));
        setMaxY(Math.max(...nodes.map((node) => node.y)));
        setMinX(Math.min(...nodes.map((node) => node.x)));
        setMaxX(Math.max(...nodes.map((node) => node.x)));
    }, [nodes]);

    return {minY, maxY, minX, maxX};
}