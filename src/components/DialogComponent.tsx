import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface DialogComponentProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
  onClose: (event) => void;
}

const DialogComponent: React.FC<DialogComponentProps> = ({ isOpen, title, content, actions, onClose }) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose("");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {actions}
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
