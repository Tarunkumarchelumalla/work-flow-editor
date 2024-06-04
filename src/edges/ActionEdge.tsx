/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from "react";
import {
  EdgeProps,
  EdgeLabelRenderer,
  BaseEdge,
  getBezierPath,
  useReactFlow,
} from "reactflow";

const ActionEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  sourcePosition,
  targetPosition,
  label,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { setEdges } = useReactFlow();
  const [inputValue, setInputValue] = useState<any>(label);
  const [isEdit, setIsEdit] = useState(false);

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id ? { ...edge, label: value } : edge
      )
    );
    setIsEdit(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer key={id}>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: 'rgb(30,30,39)',
            padding: 15,
            borderRadius: "40px",
            minWidth: '100px',
            fontSize: 12,
            display: "flex",
            flexDirection: 'row',
            justifyContent: 'center',
            cursor: 'pointer',
            wordWrap: "break-word",
            flexWrap: "wrap",
            fontWeight: 700,
            maxWidth: '200px',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            color: "#fff",
            pointerEvents: "all"
          }}
          className="nodrag nopan"
          onDoubleClick={() => setIsEdit(true)}
        >
          {!isEdit &&
            <div>
              {inputValue}
              <div></div>
            </div>
          }
          {
            isEdit && <textarea rows={3} value={inputValue} className="custom-textarea" onChange={handleChange} placeholder="Enter Text Here" onBlur={handleBlur} />
          }
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default ActionEdge;
