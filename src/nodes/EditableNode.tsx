import { useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';


function EditableNode({ data, isConnectable }) {
    const { setNodes, getNodes } = useReactFlow();
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    const handleNodeDoubleClick = () => {
        console.log(getNodes())
        debugger
        const selectedNode = getNodes().find((node) => node.id === data.id)
        console.log(selectedNode)
        selectedNode.type = 'resizer'

        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    node.data = {
                        ...selectedNode

                    };
                }
                return node;
            })
        );
    }




    return (
        <>
            <div onDoubleClick={handleNodeDoubleClick}>

                <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
                <div className="text-updater-node">
                    <div className='text-box-container'>
                        <input id="text" name="text" value={data?.label} onChange={onChange} className="nodrag" />
                    </div>

                </div>
                <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
            </div>
        </>
    );
}

export default EditableNode;
