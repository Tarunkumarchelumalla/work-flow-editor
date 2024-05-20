import React, { memo, ChangeEvent } from 'react';
import { Handle, useStore, Position, useReactFlow } from 'reactflow';

const dimensionAttrs = ['width', 'height'] as const;

interface TextNodeProps {
  id: string;
}


const TextNode = memo(({ id }: TextNodeProps) => {
  const { setNodes } = useReactFlow();
  const dimensions = useStore((s) => {
    const node = s.nodeInternals.get('2-3');

    if (
      !node ||
      !node.width ||
      !node.height ||
      !s.edges.some((edge) => edge.target === id)
    ) {
      return null;
    }

    return {
      width: node.width,
      height: node.height,
    };
  });

  const updateDimension = (attr: typeof dimensionAttrs[number]) => (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === '2-3') {
          return {
            ...n,
            style: {
              ...n.style,
              [attr]: parseInt(event.target.value),
            },
          };
        }

        return n;
      }),
    );
  };

  return (
    <>
      <div className="wrapper gradient">
        <div className="inner">
          {dimensionAttrs.map((attr) => (
            <React.Fragment key={attr}>
              <label>node {attr}</label>
              <input
                type="number"
                value={dimensions ? parseInt(dimensions[attr].toString()) : 0}
                onChange={updateDimension(attr)}
                className="nodrag"
                disabled={!dimensions}
              />
            </React.Fragment>
          ))}
          {!dimensions && 'no node connected'}
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
    </>
  );
});

export default TextNode;
