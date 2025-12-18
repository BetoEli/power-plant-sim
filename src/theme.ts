import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#BFD7EA", // Light Blue
    },
    secondary: {
      main: "#E0FF4F", // Yellow-Green
    },
    error: {
      main: "#FF6663", // Red
    },
    warning: {
      main: "#ffa500", // Orange
    },
    success: {
      main: "#E0FF4F", // Yellow-Green
    },
    background: {
      default: "#1a1a1a",
      paper: "#0b3954",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "bold",
        },
      },
    },
  },
});
