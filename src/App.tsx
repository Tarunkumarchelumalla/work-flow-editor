import type { OnConnect } from "reactflow";

import { useCallback, useRef, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  useViewport,
  MarkerType,
  updateEdge,
  useNodes,
} from "reactflow";

import "reactflow/dist/style.css";

import AnnotationNode from "./nodes/AnnotationNode";
import ButtonEdge from "./nodes/ButtonEdge";
import ResizerNode from "./nodes/ResizerNode";
import TextNode from "./nodes/TextNode";
import ToolbarNode from "./nodes/ToolbarNode";
import { initialNodes } from "./nodes";
import { initialEdges } from "./edges";
import ActionEdge from "./edges/ActionEdge";
import EditableNode from "./nodes/EditableNode";
import ResizableNode from "./nodes/ResizableNode";
import Sidebar from "./Sidebar";
import ActionNode from "./nodes/ActionNodes/ActionNode";
import ActionNodeWidthTwoEdges from "./nodes/ActionNodes/ActionNodeWith2Connections";
import ActionNodeWidthThreeEdges from "./nodes/ActionNodes/ActionNodeWith3Connection";
import FloatingEdge from "./edges/FloatingEdge";

const nodeTypes = {
  annotation: AnnotationNode,
  tools: ToolbarNode,
  resizer: ResizerNode,
  textinput: TextNode,
  editableNode: EditableNode,
  resizableNodeSelected: ResizableNode,
  actionNode: ActionNode,
  actionType2:ActionNodeWidthTwoEdges,
  actionType3:ActionNodeWidthThreeEdges
};

const edgeTypes = {
  button: ButtonEdge,
  editableEdge: ActionEdge,
  floatingEdge:FloatingEdge
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const edgeUpdateSuccessful = useRef(true);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { x, y, zoom } = useViewport();

  const onConnect: OnConnect = 
    (connection) =>
       setEdges((edges) => {
        if(!checkNodeIsValid(connection)) return edges
        connection["type"] = "floatingEdge";
        // connection["label"] = "🚀🚀🚀";
        connection["markerEnd"] = {
          type: MarkerType.ArrowClosed,
        };
        connection["style"] = {};
        return addEdge(connection, edges);
      })
  const checkNodeIsValid=(connection)=>{
    const targetNode = nodes.find((node)=>node.id === connection.target)
    const sourceNode = nodes.find((node)=>node.id === connection.source)
    return targetNode.type === sourceNode.type ? false : true

  }


  const onLoad = (_reactFlowInstance) =>{
    setReactFlowInstance(()=>_reactFlowInstance);
  }
  const onAddNode = () => {
    const id = `${Math.random()}`;
    const newNode = {
      id: id,
      position: {
        x: x / 2,
        y: y / 2,
      },
      data: { label: `Node ${Math.random().toFixed(2)}`, id: id },
      origin: [0.5, 0.0],
      type: "resizableNodeSelected",
      style: {
        background: "#4D4F5F",
        borderRadius: "10px",
        minWidth: "100px",
        fontSize: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        justifyContent: "center",
        wordWrap: "break-word",
        fontWeight: 700,
        border: "1px solid rgba(255, 255, 255, 0.16)",
        color: "#fff",
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  const onPanelClick = () => {
    console.log(nodes)
    console.log(edges)
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");
    console.log(reactFlowInstance)
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };
    const id = Math.random().toFixed(3)
    const newNode = {
      id,
      type,
      position,
      data: { label: `${type} ${id}` },
    };
    setNodes((es) => es.concat(newNode));
  };

  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div
          style={{ width: "calc(100% - 80px)", height: "100vh" }}
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            edgeTypes={edgeTypes}
            onEdgesChange={onEdgesChange}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            onConnect={onConnect}
            onPaneClick={onPanelClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onLoad={onLoad}
            fitView
          >
            <Background style={{ background: "#15151D" }} />
            <MiniMap />
            <Controls />
            <div className="toolbar-container">
              <div className="add-node" onClick={onAddNode}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="#000"
                >
                  <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                </svg>
              </div>
            </div>
          </ReactFlow>
        </div>
      </div>
    </>
  );
}
