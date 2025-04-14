import { createTheme } from "@mui/material/styles";
import { createContext, useState, useMemo } from "react";

// Simplified tokens with one color per key
export const tokens = (mode) => {
  return mode === "dark"
    ? {
        // Dark mode colors
        primary: "#233044",
        secondary: "#1C2635",
        grey: "#7E9096",
        blue: "#61AFEF",
        light_blue: "#56B6C2",
        text: "#FFFFFF",
        green: "#98C379",
        yellow: "#E5C07B",
        red: "#E06C75",
        purple: "#C678DD",
      }
    : {
        // Light mode colors
        primary: "#FFFFFF",
        secondary: "#F6F9FC",
        grey: "#7E9096",
        blue: "#61AFEF",
        light_blue: "#56B6C2",
        text: "#21252B",
        green: "#98C379",
        yellow: "#E5C07B",
        red: "#E06C75",
        purple: "#C678DD",
      };
};

// Updated MUI theme settings using the simplified tokens
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary, // using the single color value
            },
            secondary: {
              main: colors.secondary,
            },
            neutral: {
              dark: colors.blue,
              main: colors.blue,
              light: colors.light_blue,
            },
            background: {
              default: colors.secondary,
              alt: colors.blue,
            },
          }
        : {
            primary: {
              main: colors.primary,
            },
            secondary: {
              main: colors.secondary,
            },
            neutral: {
              dark: colors.blue,
              main: colors.blue,
              light: colors.light_blue,
            },
            background: {
              default: colors.secondary,
              alt: colors.blue,
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans 3", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// Context to toggle color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

// Hook to use the color mode with the theme
export const useMode = () => {
  const [mode, setMode] = useState("dark");
  const colorMode = useMemo(
    () => ({
      setMode: (mode) => setMode(mode),
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
