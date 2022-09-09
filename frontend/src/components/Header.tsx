import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Typography } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h3" component="div">
          Hacker News Analyzer
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
