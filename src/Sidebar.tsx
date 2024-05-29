import { Box, Card, Grid, Typography } from "@mui/material";

const Sidebar = () => {
    const onDragStart = (event, nodeType) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    };
  
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" textAlign={"center"} sx={{ mb: 3 }}>
          Nodes
        </Typography>
        <Grid container>
          <Grid item xs={12}>
            <Card
              onDragStart={(event) =>{ onDragStart(event, "resizableNodeSelected")}}
              draggable
              sx={{ display: "flex", alignItems: "center", p: 3 }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>Phases</Box>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card
              onDragStart={(event) => onDragStart(event, "default")}
              draggable
              sx={{ display: "flex", alignItems: "center", p: 3 }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>Default Node</Box>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card
              onDragStart={(event) => onDragStart(event, "actionNode")}
              draggable
              sx={{ display: "flex", alignItems: "center", p: 3 }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>Action Node</Box>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card
              onDragStart={(event) => onDragStart(event, "actionType2")}
              draggable
              sx={{ display: "flex", alignItems: "center", p: 3 }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>Action Node - 2</Box>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card
              onDragStart={(event) => onDragStart(event, "actionType3")}
              draggable
              sx={{ display: "flex", alignItems: "center", p: 3 }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>Action Node - 3</Box>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card
              onDragStart={(event) => onDragStart(event, "group")}
              draggable
              sx={{ display: "flex", alignItems: "center", p: 3 }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>Group Node</Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  export default Sidebar