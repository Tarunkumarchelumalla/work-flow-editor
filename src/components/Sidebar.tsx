import { Box, Card, Divider, Grid, Typography } from "@mui/material";
import CustomInput from "../ui/CustomInput";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(nodeType));
    event.dataTransfer.effectAllowed = "move";
  };

  const [searchText, setSearchText] = useState("");

  const handleSearchTextChange = (event) => {
    const { value } = event.target;
    setSearchText(() => value);
    console.log(searchText);
  };

  return (
    <>
      <div className="w-full gap-2 h-[37px] bg-transparent flex flex-row justify-between items-center text-[#D4D4D8] px-4 cursor-pointer">
        <SearchIcon />
        <input  
          type="text"
          className="bg-transparent text-[#D4D4D8] placeholder:text-[#D4D4D8] text-sm"
          placeholder="Search Actions"
        />
      </div>
      <Divider sx={{ borderColor: "#FFFFFF1A" }} />
      <Box className="py-[12px] px-[8px] font-medium text-sm text-[#D4D4D8]">
        {/* <CustomInput icon={<SearchIcon/>} onChange={handleSearchTextChange} type="text" value={searchText} placeholder="Search Actions"  /> */}

        <Grid container sx={{ background: "#18181B", color: "#D4D4D8" }}>
          <Grid container spacing={2}>
            <Grid item xs={6} className="flex flex-row items-center justify-center w-full h-full border-1 border-['#FFFFFF1A] p-2 ">
              <img  onDragStart={(event) => onDragStart(event, {type:'actionNode',url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/2062095_application_chat_communication_logo_whatsapp_icon.svg/1200px-2062095_application_chat_communication_logo_whatsapp_icon.svg.png'})}
                draggable src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/2062095_application_chat_communication_logo_whatsapp_icon.svg/1200px-2062095_application_chat_communication_logo_whatsapp_icon.svg.png" width={44} height={44} className="rounded-2xl"/>
            </Grid>
            {/* <Grid item xs={6}>
              <Card
                onDragStart={(event) => onDragStart(event, "actionNode")}
                draggable
                sx={{
                  display: "flex",
                  alignItems: "center",
                  background: "#0E0E0E",
                  p: 3,
                  color: "#D4D4D8",
                  border: "1px solid #FFFFFF1A",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              >
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>Action Node</Box>
              </Card>
            </Grid> */}
          </Grid>
        </Grid>
        {/* <Grid item xs={6}>
            <Card
              className="bg-[#18181B]"
              onDragStart={(event) => onDragStart(event, "actionType2")}
              draggable
              sx={{ display: "flex", alignItems: "center", p: 3 }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>Action Node - 2</Box>
            </Card>
          </Grid> */}
        {/* <Grid item xs={6}>
            <Card
              className="bg-[#18181B]"
              onDragStart={(event) => onDragStart(event, "actionType3")}
              draggable
              sx={{ display: "flex", alignItems: "center", p: 3 }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>Action Node - 3</Box>
            </Card>
          </Grid> */}
      </Box>
    </>
  );
};

export default Sidebar;
