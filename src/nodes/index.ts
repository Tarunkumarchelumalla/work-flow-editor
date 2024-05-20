import type { Node, NodeTypes } from "reactflow";
import { PositionLoggerNode } from "./PositionLoggerNode";

export const initialNodes = [

] satisfies Node[];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
} satisfies NodeTypes;
