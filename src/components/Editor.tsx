import { useRef, useState, useCallback } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  useViewport,
  OnConnect,
  MarkerType,
  addEdge,
  updateEdge,
  ReactFlowProvider,
  Background,
  MiniMap,
  Controls,
} from "reactflow";
import { initialEdges } from "../edges";
import ActionEdge from "../edges/ActionEdge";
import FloatingEdge from "../edges/FloatingEdge";
import { initialNodes } from "../nodes";
import ActionNode from "../nodes/ActionNodes/ActionNode";
import ActionNodeWidthTwoEdges from "../nodes/ActionNodes/ActionNodeWith2Connections";
import ActionNodeWidthThreeEdges from "../nodes/ActionNodes/ActionNodeWith3Connection";
import AnnotationNode from "../nodes/AnnotationNode";
import ButtonEdge from "../nodes/ButtonEdge";
import EditableNode from "../nodes/EditableNode";
import ResizableNode from "../nodes/ResizableNode";
import ResizerNode from "../nodes/ResizerNode";
import TextNode from "../nodes/TextNode";
import ToolbarNode from "../nodes/ToolbarNode";

const nodeTypes = {
  annotation: AnnotationNode,
  tools: ToolbarNode,
  resizer: ResizerNode,
  textinput: TextNode,
  editableNode: EditableNode,
  resizableNodeSelected: ResizableNode,
  actionNode: ActionNode,
  actionType2: ActionNodeWidthTwoEdges,
  actionType3: ActionNodeWidthThreeEdges,
};

const edgeTypes = {
  button: ButtonEdge,
  editableEdge: ActionEdge,
  floatingEdge: FloatingEdge,
};

export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const edgeUpdateSuccessful = useRef(true);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { x, y, zoom } = useViewport();

  const onConnect: OnConnect = (connection) =>
    setEdges((edges) => {
      if (!checkNodeIsValid(connection)) return edges;
      connection["type"] = "smoothstep";
      // connection["label"] = "🚀🚀🚀";
      connection["markerEnd"] = {
        type: MarkerType.ArrowClosed,
      };
      connection["style"] = {};
      return addEdge(connection, edges);
    });

  const checkNodeIsValid = (connection) => {
    const targetNode = nodes.find((node) => node.id === connection.target);
    const sourceNode = nodes.find((node) => node.id === connection.source);
    return targetNode.type === sourceNode.type ? false : true;
  };

  const onLoad = (_reactFlowInstance) => {
    setReactFlowInstance(() => _reactFlowInstance);
  };

  const onAddNode = () => {
    console.log(x, y, zoom);
    const id = `${Math.random()}`;
    const newNode = {
      id: id,
      position: {
        x: 0,
        y: 0,
      },
      data: { label: `Node ${Math.random().toFixed(2)}`, id: id },
      origin: [0.5, 0.0],
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
    console.log(nodes);
    console.log(edges);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    let node = event.dataTransfer.getData("application/reactflow");
    // check if the dropped element is valid
    node = JSON.parse(node);
    if (typeof node === "undefined" || !node) {
      return;
    }
    console.log(reactFlowBounds);
    const position = {
      x: 0,
      y: 0,
    };
    const id = Math.random().toFixed(3);
    const newNode = {
      id,
      type: node.type,
      position,
      data: { label: `${node.type} ${id}`, url: node.url },
    };
    setNodes((es) => es.concat(newNode));
  };

  return (
    <div className="w-100 h-screen" ref={reactFlowWrapper}>
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
        <Background style={{ background: "#070707" }} />
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
  );
}
