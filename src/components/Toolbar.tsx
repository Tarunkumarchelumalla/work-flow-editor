import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface ToolbarProps {
    onAdd: (event) => void;
    onDelete: (event) => void;
    onMore: (event) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onAdd, onDelete, onMore }) => {
    return (
        <div className="flex flex-row w-full gap-[2px] h-[32px] bg-[#18181B] border-[1px] rounded border-[#FFFFFF1A] p-[8px]">
            <AddIcon sx={{ color: '#fff', fontSize: '16px', cursor: 'pointer' }} onClick={onAdd} />
            <div className='bg-[#FFFFFF1A] w-[1px] cursor-pointer'></div>
            <DeleteOutlineIcon sx={{ color: '#fff', fontSize: '16px', cursor: 'pointer' }} onClick={onDelete} />
            <div className='bg-[#FFFFFF1A] w-[1px]'></div>
            <MoreVertIcon sx={{ color: '#fff', fontSize: '16px', cursor: 'pointer' }} onClick={onMore} />
        </div>
    );
};
