import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

export default function Header({ right }: { right?: React.ReactNode }) {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid", borderColor: "divider", backdropFilter: "blur(6px)" }}
    >
      <Toolbar sx={{ minHeight: 72 }}>
        <Box sx={{ fontWeight: 900, fontSize: 22, letterSpacing: 0.3, flexGrow: 1 }}>Travila</Box>
        {right}
      </Toolbar>
    </AppBar>
  );
}
