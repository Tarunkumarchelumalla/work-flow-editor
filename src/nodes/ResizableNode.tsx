import { memo, useState } from "react";
import { Handle, Position, NodeToolbar } from "reactflow";

const ResizableNodeSelected = ({ data, selected}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [inputValue, setInputValue] = useState(data.label);
  const [inputActionValue, setActionInputValue] = useState('');
  const [emoji, setEmoji] = useState(() => "🚀");
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
      label: 'Enter Text Here',
      isEdit: false,
    };
    setActionArray((prev) => [...prev, actionObject]);
  };
  

 const [actionArray,setActionArray]=useState([])

  return (
    <>
      {/* <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      /> */}
      <NodeToolbar isVisible={selected} style={{
        pointerEvents:'all'
      }} >
        <button onClick={onAddAction} >Action</button>
        <button >Delete</button>
        <button >✨</button>
      </NodeToolbar>
      <Handle type="target" position={Position.Top} />
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
      {actionArray.length > 0 && actionArray.map((el:any,index:number)=>(
        <div key={index}>
          {!el.isEdit? (<div style={{pointerEvents:'all'}} onDoubleClick={()=>el.isEdit=true}>{el.label}</div>):(
            <input value={el.label} className='custom-textarea' onChange={(event)=>handleActionChange(event,index)} placeholder="Enter Action Here" onBlur={()=>el.isEdit = false} />
          )
            }
          </div>
      ))

      }
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(ResizableNodeSelected);
