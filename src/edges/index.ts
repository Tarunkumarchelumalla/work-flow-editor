import { MarkerType, type Edge, type EdgeTypes } from "reactflow";


export const initialEdges = [
  { id: "a->c", source: "a", target: "c", type:'smoothstep',    markerEnd: {
    type: MarkerType.ArrowClosed,
  }, },
  { id: "b->d", source: "b", target: "d",type:'smoothstep',    markerEnd: {
    type: MarkerType.ArrowClosed,
  }, },
  { id: "c->d", source: "c", target: "d",type:'smoothstep',    markerEnd: {
    type: MarkerType.ArrowClosed,
  }, },
] satisfies Edge[];

export const edgeTypes = {
  // Add your custom edge types here!

} satisfies EdgeTypes;
