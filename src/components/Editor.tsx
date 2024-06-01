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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import dagre from "dagre";
import { Padding } from "@mui/icons-material";
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
    let node = event.dataTransfer.getData("application/reactflow");
    // check if the dropped element is valid
    node = JSON.parse(node);
    if (typeof node === "undefined" || !node) {
      return;
    }

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const id = Math.random().toFixed(3);
    const newNode = {
      id,
      type: node.type,
      position,
      data: { label: `${node.type} ${id}`, url: node.url },
    };
    setNodes((es) => es.concat(newNode));
  };

  // const onLayout = useCallback(
  //   (direction) => {
  //     const { nodes: layoutedNodes, edges: layoutedEdges } =
  //       getLayoutedElements(nodes, edges, direction);

  //     setNodes([...layoutedNodes]);
  //     setEdges([...layoutedEdges]);
  //   },
  //   [nodes, edges]
  // );

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const nodeWidth = 200;
  const nodeHeight = 200;

  const getLayoutedElements = (nodes, edges, direction = "LR") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight,paddingY:800 });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
    dagre.layout(dagreGraph);
    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      console.log(nodeWithPosition)
      node.targetPosition = isHorizontal ? "left" : "top";
      node.sourcePosition = isHorizontal ? "right" : "bottom";
      console.log(nodeWithPosition.padding)
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2 ,
      };

      return node;
    });

    return { nodes, edges };
  };

  // const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  //   initialNodes,
  //   initialEdges
  // );

  const handleUpload = (event) => {
    const nodeStyle={
      background: "#18181B",
      border: "1px solid #FFFFFF33",
      boxShadow: "0px 0px 6.8px 0px #FFFFFF33 inset",
      fontSize: "12px",
      fontWeight: "700",
      lineHeight: " 12px",
      textAlign: "left",
    }
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      fetch(fileUrl)
        .then((response) => response.json())
        .then((jsonData) => {
          console.log(jsonData);
          const { states } = jsonData;
          const edges = [];
          const nodes = states.map((el: any) => {
            el.id = el.name;
            el.data = {
              label: el.name,
            };
            el.type = "resizableNodeSelected";
            el.style=nodeStyle;
            return el;
          });
          states.forEach((el) => {
            el.actions.forEach((action) => {
              const obj = {
                id: action.name,
                type: "actionNode",
                data: {
                  label: action.name,
                },
              };
              nodes.push(obj);
              const nodeActionEdge = {
                type: "smoothstep",
                source: el.name,
                target: action.name,
                
                data: {
                  label: action.name,
                },
                id: `reactflow__edge-${el.name}-${action.name}${Math.random().toFixed(4)}`,
                markerEnd: {
                  type: "arrowclosed" as MarkerType,
                },
              };

              edges.push(nodeActionEdge);

              const keys = Object.keys(action.on);
              keys.forEach((key) => {
                const edgeObj = {
                  type: "editableEdge",
                  source: action.name,
                  target: action.on[key],
                  label: key,
                  id: `reactflow__edge-${action.name}-${action.on[key]}${Math.random().toFixed(4)}`,
                  markerEnd: {
                    type: "arrowclosed" as MarkerType,
                  },
                };

                edges.push(edgeObj);
              });
            });
          });

          console.log(nodes, edges);

          const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(nodes, edges, "LR");

          console.log(layoutedNodes, layoutedEdges);
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
        })
        .catch((error) => {
          console.error("Error fetching JSON:", error);
        });
    }
  };

  return (
    <div className="w-100 h-screen" ref={reactFlowInstance}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onInit={setReactFlowInstance}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onConnect={onConnect}
        onPaneClick={onPanelClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
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

        <div
          className="absolute w-[50px] h-[50px] rounded-3xl z-10 pointer-events-auto cursor-pointer border-[1px] border-[#ffffff1A] p-[4px] bg-[#fff] top-10 right-5 flex flex-row justify-center items-center"
          onClick={() => {
            document.getElementById("uploadImage").click();
          }}
        >
          <CloudUploadIcon sx={{ fontSize: "24px", color: "#000" }} />
        </div>
        <input
          className="invisible"
          type="file"
          id="uploadImage"
          onChange={handleUpload}
        />
      </ReactFlow>
    </div>
  );
}
