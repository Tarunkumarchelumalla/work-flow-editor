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
  useReactFlow,
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
import ClearIcon from "@mui/icons-material/Clear";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import ELK from "elkjs/lib/elk.bundled.js";
import { Button, Tooltip } from "@mui/material";
import DialogComponent from "./DialogComponent";
import CustomInput from "../ui/CustomInput";
const nodeTypes = {
  annotation: AnnotationNode,
  tools: ToolbarNode,
  resizer: ResizerNode,
  textinput: TextNode,
  editableNode: EditableNode,
  phaseNode: ResizableNode,
  actionNode: ActionNode,
  actionType2: ActionNodeWidthTwoEdges,
  actionType3: ActionNodeWidthThreeEdges,
};

const edgeTypes = {
  button: ButtonEdge,
  editableEdge: ActionEdge,
  floatingEdge: FloatingEdge,
};

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": 50, // space in x direction node spacing
  "elk.layered.spacing.edgeNodeBetweenLayers": 40, // edge length in x direction
  "elk.separateConnectedComponents": false,
  "elk.layered.spacing.edgeEdge": 50, // no effect
  "elk.spacing.nodeNode": 50,
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",

      // Hardcode a width and height for elk to use when layouting.
      width: 500,
      height: 500,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const edgeUpdateSuccessful = useRef(true);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { fitView } = useReactFlow();
  const [dialogOpen,setDialog]= useState(false)
  const { x, y, zoom } = useViewport();
  const [fileName,setFileName] = useState('')


  const onConnect: OnConnect = (connection) =>
    setEdges((edges) => {
      if (!checkNodeIsValid(connection)) return edges;

      console.log(connection);

      const sourceNode = nodes.find(
        (node: any) => node.id === connection.source
      );
      const isPhaseNode = sourceNode.type === "phaseNode";

      connection["type"] = isPhaseNode ? null : "editableEdge";
      connection["markerEnd"] = {
        type: MarkerType.ArrowClosed,
      };
      connection["label"] = "";
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
      type: "phaseNode",
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
    window.requestAnimationFrame(() => fitView());
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

  // const dagreGraph = new dagre.graphlib.Graph();
  // dagreGraph.setDefaultEdgeLabel(() => ({}));
  // const nodeWidth = 200;
  // const nodeHeight = 200;

  // const getLayoutedElements = (nodes, edges, direction = "LR") => {
  //   const isHorizontal = direction === "LR";
  //   dagreGraph.setGraph({ rankdir: direction });

  //   nodes.forEach((node) => {
  //     dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight,paddingY:800 });
  //   });

  //   edges.forEach((edge) => {
  //     dagreGraph.setEdge(edge.source, edge.target);
  //   });
  //   dagre.layout(dagreGraph);
  //   nodes.forEach((node) => {
  //     const nodeWithPosition = dagreGraph.node(node.id);
  //     console.log(nodeWithPosition)
  //     node.targetPosition = isHorizontal ? "left" : "top";
  //     node.sourcePosition = isHorizontal ? "right" : "bottom";
  //     console.log(nodeWithPosition.padding)
  //     // We are shifting the dagre node position (anchor=center center) to the top left
  //     // so it matches the React Flow node anchor point (top left).
  //     node.position = {
  //       x: nodeWithPosition.x - nodeWidth / 2,
  //       y: nodeWithPosition.y - nodeHeight / 2 ,
  //     };

  //     return node;
  //   });

  //   return { nodes, edges };
  // };

  // const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  //   initialNodes,
  //   initialEdges
  // );

  const handleUpload = (event) => {
    const nodeStyle = {
      background: "#18181B",
      border: "1px solid #FFFFFF33",
      boxShadow: "0px 0px 6.8px 0px #FFFFFF33 inset",
      fontSize: "12px",
      fontWeight: "700",
      lineHeight: " 12px",
      textAlign: "left",
    };
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);

      fetch(fileUrl)
        .then((response) => response.json())
        .then((jsonData) => {
          const { states } = jsonData;
          const modifiedEdges = [];
          const modifiedNodes = states.map((el: any) => {
            el.id = el.name;
            el.data = {
              label: el.name,
              sourceHandles: el.actions.map((action) => {
                const nodeEdgeObj: any = {};
                nodeEdgeObj.id = `${el.name}-${action.name}`;
                nodeEdgeObj.isConnected = false;
                return nodeEdgeObj;
              }),
            };
            el.type = "phaseNode";
            el.style = nodeStyle;
            return el;
          });

          states.forEach((node) => {
            node.actions.forEach((action) => {
              const actionOnKeys = Object.keys(action.on);
              const sourceHandles = actionOnKeys.map((key) => {
                const temp: any = {};
                temp.id = `${action.name}-${key}`;
                temp.isConnected = false;
                return temp;
              });
              const obj = {
                id: action.name,
                type: "actionNode",
                data: {
                  label: action.name,
                  sourceHandles: sourceHandles,
                },
              };
              modifiedNodes.push(obj);
              const nodeActionEdge = {
                source: node.name,
                target: action.name,

                data: {
                  label: action.name,
                  url: action.type, // actionNode url
                },
                id: `reactflow__edge-${node.name}-${
                  action.name
                }${Math.random().toFixed(4)}`,
                markerEnd: {
                  type: "arrowclosed" as MarkerType,
                },
              };

              modifiedEdges.push(nodeActionEdge);

              const keys = Object.keys(action.on);
              keys.forEach((key, index) => {
                const edgeObj = {
                  type: "editableEdge",
                  source: action.name,
                  sourceHandle: `${action.name}-${key}`,
                  target: action.on[key],
                  label: key,
                  id: `reactflow__edge-${action.name}-${
                    action.on[key]
                  }${Math.random().toFixed(4)}`,
                  markerEnd: {
                    type: "arrowclosed" as MarkerType,
                  },
                };

                modifiedEdges.push(edgeObj);
              });
            });
          });

          modifiedNodes.map((node) => {
            const targetedNodes = modifiedEdges.filter(
              (edge) => edge.target === node.id
            );
            node.data["targetHandles"] = targetedNodes.map(
              (targetedEdge, index) => {
                const targetedNode = modifiedNodes.find(
                  (node) => node.id === targetedEdge.source
                );
                if (targetedNode?.data.sourceHandles.length) {
                  const notConnectedSourceHandle =
                    targetedNode?.data.sourceHandles.find(
                      (hl) => hl.isConnected === false
                    );
                  notConnectedSourceHandle.isConnected = true;
                  targetedEdge.sourceHandle = notConnectedSourceHandle.id;
                  return {
                    id: notConnectedSourceHandle.id,
                    isConnected: false,
                  };
                } else {
                  return {
                    id: targetedNode.id,
                  };
                }
              }
            );
          });
          console.log(modifiedEdges, modifiedNodes);
          modifiedEdges.forEach((edge) => {
            const targetedNode: any = modifiedNodes.find(
              (node) => edge.target === node.id
            );
            if (!targetedNode?.data?.targetHandles?.length) return;
            const targetHandle = targetedNode.data.targetHandles.find(
              (el) => !el.isConnected
            );
            targetHandle.isConnected = true;
            edge.targetHandle = targetHandle.id;
          });

          console.log(modifiedNodes, modifiedEdges);

          const opts = { "elk.direction": "RIGHT", ...elkOptions };
          const ns = modifiedNodes;
          const es = modifiedEdges;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          getLayoutedElements(ns, es, opts).then((res: any) => {
            console.log(res.nodes, res.edges);

            setNodes(res.nodes);
            setEdges(res.edges);

            window.requestAnimationFrame(() => fitView());
          });
          // ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          //   setNodes(layoutedNodes);
          //   setEdges(layoutedEdges);

          //   window.requestAnimationFrame(() => fitView());
          // }
        })
        .catch((error) => {
          console.error("Error fetching JSON:", error);
        });
    }
    const element = document.querySelector("#uploadImage");
    element.nodeValue = "";
  };

  const handleExportJson = () => {
    console.log(nodes, edges);
    let phaseNodes = nodes.filter((node) => node.type === "phaseNode");
    const obj: any = {
      name: fileName,
      states: [],
    };

    obj.states = phaseNodes.map((node) => {
      const nodeObj: any = {};
      nodeObj.name = node.data.label;
      const phaseActionNodes = edges
        .filter((edge) => edge.source === node.id)
        .map((el) => el.target);
      nodeObj.actions = nodes
        .filter(
          (actionNode: any) =>
            actionNode.type === "actionNode" &&
            phaseActionNodes.includes(actionNode.id)
        )
        .map((action) => {
          const actionObj: any = {};
          actionObj.name = action.data.label;
          actionObj.type = action.data.url;
          actionObj.on = {};
          edges.forEach((actionEdge: any) => {
            if (actionEdge.source === action.id) {
              const targetNode = nodes.find(
                (node) => actionEdge.target === node.id
              );
              if (targetNode) {
                actionObj.on[actionEdge.label] = targetNode.data.label;
              }
            }
          });
          return actionObj;
        });
      return nodeObj;
    });

    console.log(obj);

    const jsonString = JSON.stringify(obj, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = obj.name;
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCloseDialog=()=>{
    setDialog(false)
    handleExportJson()
  }

  return (
    <div className="w-100 h-screen">
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
        <Tooltip title="Upload Json">
          <div
            className="absolute w-[36px] h-[36px] rounded-3xl z-10 pointer-events-auto cursor-pointer border-[1px] border-[#ffffff1A] p-[4px] bg-[#fff] top-5 right-5 flex flex-row justify-center items-center"
            onClick={() => {
              document.getElementById("uploadImage").click();
            }}
          >
            <CloudUploadIcon sx={{ fontSize: "24px", color: "#000" }} />
          </div>
        </Tooltip>
        <Tooltip title="Reset">
          <div
            className="absolute w-[36px] h-[36px] rounded-3xl z-10 pointer-events-auto cursor-pointer border-[1px] border-[#ffffff1A] p-[4px] bg-[#fff] top-5 right-[120px] flex flex-row justify-center items-center"
            onClick={() => {
              setNodes([]);
              setEdges([]);
            }}
          >
            <ClearIcon sx={{ fontSize: "24px", color: "#000" }} />
          </div>
        </Tooltip>
        <Tooltip title="Export Json">
          <div
            className="absolute w-[36px] h-[36px] rounded-3xl z-10 pointer-events-auto cursor-pointer border-[1px] border-[#ffffff1A] p-[4px] bg-[#fff] top-5 right-[70px] flex flex-row justify-center items-center"
            onClick={()=> setDialog(true)}
          >
            <CloudDownloadIcon sx={{ fontSize: "24px", color: "#000" }} />
          </div>
        </Tooltip>
        <input
          className="invisible"
          type="file"
          id="uploadImage"
          onChange={handleUpload}
        />
      </ReactFlow>

      <DialogComponent
        isOpen={dialogOpen}
        title="Name Your Flow"
        content={
          <>
          <CustomInput type="text" name="input" placeholder="Enter Flow Name" value={fileName} onChange={(e)=>{
            setFileName(e.target.value)
          }}/>
          </>
        }
        onClose={handleCloseDialog}
      />
    </div>
  );
}
