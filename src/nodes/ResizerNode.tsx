import { memo } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';



function ResizerNode({ data }: any) {
  return (
    <>
      <NodeResizer minWidth={50} minHeight={50} />
      <Handle itemID='1' type="target" position={Position.Left} />
      <Handle itemID='2' type="source" position={Position.Right} />
      <Handle itemID='3' type="target" position={Position.Top} />
      <Handle itemID='4' type="source" position={Position.Bottom} />
      <div style={{ padding: 10 }}>{data.data.label}</div>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          justifyContent: 'space-evenly',
          left: 0,
        }}
      >
      </div>
    </>
  );
}

export default memo(ResizerNode);
