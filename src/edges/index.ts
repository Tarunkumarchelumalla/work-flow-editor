import { MarkerType, type Edge, type EdgeTypes } from "reactflow";

export const initialEdges = [
  {
    source: "0.5283029098328751",
    sourceHandle: null,
    target: "0.953",
    targetHandle: null,
    type: "smoothstep",
    markerEnd: {
      type: "arrowclosed" as MarkerType,
    },
    style: {},
    id: "reactflow__edge-0.5283029098328751-0.953",
  },
] satisfies Edge[];

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes;
