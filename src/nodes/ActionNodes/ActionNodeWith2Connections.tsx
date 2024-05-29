import { useState } from "react";
import {
  NodeToolbar,
  Handle,
  Position,
  useReactFlow,
  useNodeId,
} from "reactflow";
import ClearIcon from "@mui/icons-material/Clear";

const ActionNodeWidthTwoEdges = ({ data, selected, isConnectable }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [inputValue, setInputValue] = useState(data.label);
  const { setNodes, setEdges } = useReactFlow();
  const currentNodeId = useNodeId();
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

    setActionArray(() => [...tempArray]);
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
        <button onClick={onAddAction}>Action</button>
        <button onClick={onDeleteNode}>Delete</button>
        <button>more</button>
      </NodeToolbar>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
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
                    className="action-label-content"
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
                <div className="action-label-content">
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
      <Handle
        type="source"
        position={Position.Right}
        id="2-a"
        style={{ top: "40%", background: "#555" }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="2-b"
        style={{ top: "80%", background: "#555" }}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default ActionNodeWidthTwoEdges;
