/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useState } from "react";
import {
  Handle,
  Position,
  NodeToolbar,
  useNodeId,
  useReactFlow,
} from "reactflow";
import ClearIcon from "@mui/icons-material/Clear";
import { Toolbar } from "../components/Toolbar";

const phaseNode = ({ data, selected,isConnectable }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [inputValue, setInputValue] = useState(data.label);
  const currentNodeId = useNodeId();
  const { setNodes, setEdges } = useReactFlow();
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleDblClick = () => {
    setIsEdit(true);
  };

  const handleBlur = (event) => {
    const { value } = event.target;
    data.label = value;
    setIsEdit(false);
  };

  const handleActionChange = (event, index) => {
    const { value } = event.target;
    const newArray = [...actionArray];
    newArray[index] = {
      ...newArray[index],
      label: value,
    };
    setActionArray(newArray);
  };

  const onAddAction = () => {
    const actionObject = {
      label: "Enter Text Here",
      isEdit: false,
    };
    setActionArray((prev) => [...prev, actionObject]);
  };

  const handleLabel = (index) => {
    const newArray = [...actionArray];
    newArray[index] = {
      ...newArray[index],
      isEdit: true,
    };
    setActionArray(newArray);
  };

  const handleBlurActions = () => {
    const tempArray = [...actionArray];
    tempArray.forEach((el) => {
      el.isEdit = false;
    });

    setActionArray((prev) => [...tempArray]);
    console.log(actionArray);
  };

  const handleRemoveAction = (index) => {
    const newArray = [...actionArray];
    newArray.splice(index, 1);
    setActionArray(newArray);
  };

  const onDeleteNode = () => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.filter(
        (node) => node.id !== currentNodeId
      );

      setEdges((prevEdges) => {
        const removableEdgeIds = prevEdges
          .filter(
            (edge) =>
              edge.source === currentNodeId || edge.target === currentNodeId
          )
          .map((edge) => edge.id);

        const updatedEdges = prevEdges.filter(
          (edge) => !removableEdgeIds.includes(edge.id)
        );
        return updatedEdges;
      });

      return updatedNodes;
    });
  };

  const handleMouseHover = () => {
    console.log(currentNodeId);
  };

  const [actionArray, setActionArray] = useState([]);

  return (
    <>
      {/* <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      /> */}
      <NodeToolbar
        isVisible={selected}
        style={{
          pointerEvents: "all",
        }}
      >
        <Toolbar
          onAdd={onAddAction}
          onDelete={onDeleteNode}
          onMore={(e) => console.log(e)}
        />
      </NodeToolbar>
      <div className="handles targets">
        {data?.targetHandles?.length ? data.targetHandles.map((handle) => (
          <Handle
            key={handle.id}
            id={handle.id}
            type="target"
            position={Position.Left}
          />
        )) : (<Handle
          type="target"
          position={Position.Left}
          style={{  background: "#555" }}
          isConnectable={isConnectable}
        />)

        }
      </div>
      <div
        style={{
          padding: 10,
          maxWidth: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "4px",
          flexWrap: "wrap",
        }}
        onMouseEnter={handleMouseHover}
        onDoubleClick={handleDblClick}
      >
        {!isEdit && data.label}
        {isEdit && (
          <textarea
            rows={3}
            draggable={false}
            className="custom-textarea"
            value={inputValue}
            placeholder="Enter Text here"
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
      </div>
      {actionArray.length > 0 && (
        <div className="action-label-container">
          {actionArray.map((el: any, index: number) => (
            <div key={index} onBlur={handleBlurActions}>
              {!el.isEdit ? (
                <>
                  <div
                    className="label-content"
                    style={{ pointerEvents: "all", cursor: "pointer" }}
                    onDoubleClick={() => handleLabel(index)}
                  >
                    <span> {el.label}</span>{" "}
                    <ClearIcon
                      style={{ fontSize: "12px" }}
                      onClick={() => handleRemoveAction(index)}
                    />
                  </div>
                </>
              ) : (
                <div className="label-content">
                  <input
                    value={el.label}
                    className="custom-textarea"
                    onChange={(event) => handleActionChange(event, index)}
                    placeholder="Enter Action Here"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
          <div className="handles sources">
        {data?.sourceHandles?.length ? data.sourceHandles.map((handle) => (
          <Handle
            key={handle.id}
            id={handle.id}
            type="source"
            position={Position.Right}
          />
        )) : (<Handle
          type="source"
          position={Position.Right}
          style={{ background: "#555" }}
          isConnectable={isConnectable}
        />)

        }
      </div>
    </>
  );
};

export default memo(phaseNode);
