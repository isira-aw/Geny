import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { Bell } from "lucide-react"; // Bell icon
import Alert from "@mui/material/Alert";

export default function NotificationDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          width: {
            xs: "60vw", // mobile (xs = extra-small)
            sm: "60vw", // small
            md: "20vw", // medium and up (desktop)
          },
        }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <br />
        <Alert
          className="p-2 gap-6  ml-4 mr-5 mt-2"
          variant="outlined"
          severity="success"
        >
          This is an outlined success Alert.
        </Alert>
        <Alert
          className="p-2 gap-6  ml-4 mr-5 mt-2"
          variant="outlined"
          severity="info"
        >
          This is an outlined info Alert.
        </Alert>
      </Box>
    </Drawer>
  );

  return (
    <>
      <IconButton color="inherit" onClick={toggleDrawer(true)}>
        <Bell />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
}
