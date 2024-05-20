import { memo } from 'react';

interface AnnotationData {
  level: number;
  label: string;
  arrowStyle?: React.CSSProperties;
}

interface AnnotationNodeProps {
  data: AnnotationData;
}

function AnnotationNode({ data }: AnnotationNodeProps) {
  return (
    <>
      <div style={{ padding: 10, display: 'flex' }}>
        <div style={{ marginRight: 4 }}>{data.level}.</div>
        <div>{data.label}</div>
      </div>
      {data.arrowStyle && (
        <div className="arrow" style={data.arrowStyle}>
          ⤹
        </div>
      )}
    </>
  );
}

export default memo(AnnotationNode);
