import React, { useState } from 'react';
import { Handle, Position, NodeToolbar } from 'reactflow';

interface ToolbarNodeProps {
  data: {
    label: string;
  };
}


const labelStyle: React.CSSProperties = {
  position: 'absolute',
  color: '#555',
  bottom: -15,
  fontSize: 8,
};

const ToolbarNode: React.FC<ToolbarNodeProps> = ({ data }) => {
  const [emoji, setEmoji] = useState<string>('🚀');

  return (
    <>
      <NodeToolbar isVisible>
        <button onClick={() => setEmoji('🚀')}>🚀</button>
        <button onClick={() => setEmoji('🔥')}>🔥</button>
        <button onClick={() => setEmoji('✨')}>✨</button>
      </NodeToolbar>
      <div style={{ padding: '10px 20px' }}>
        <div>{emoji}</div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div style={labelStyle}>{data.label}</div>
    </>
  );
};

export default ToolbarNode;
