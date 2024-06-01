import type { Node, NodeTypes } from "reactflow";
import { PositionLoggerNode } from "./PositionLoggerNode";

export const initialNodes = [
  {
    id: "0.5283029098328751",
    position: {
      x: -183,
      y: -70.5,
    },
    data: {
      label: "Node 0.07",
      id: "0.5283029098328751",
    },
    type: "resizableNodeSelected",
    style: {
      background: "#18181B",
      border: "1px solid #FFFFFF33",
      boxShadow: "0px 0px 6.8px 0px #FFFFFF33 inset",
      fontSize: "12px",
      fontWeight: "700",
      lineHeight: " 12px",
      textAlign: "left",
    },
    width: 100,
    height: 34,
    selected: true,
    positionAbsolute: {
      x: -183,
      y: -70.5,
    },
    dragging: false,
  },
  {
    id: "0.953",
    type: "actionNode",
    position: {
      x: 69.25,
      y: -53.75,
    },
    data: {
      label: "actionNode 0.953",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/2062095_application_chat_communication_logo_whatsapp_icon.svg/1200px-2062095_application_chat_communication_logo_whatsapp_icon.svg.png",
    },
    width: 200,
    height: 90,
  },
] satisfies Node[];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
} satisfies NodeTypes;
