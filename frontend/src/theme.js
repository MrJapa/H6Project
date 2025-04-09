import { createTheme } from "@mui/material/styles";
import { createContext, useState, useMemo } from "react";

// color design
export const tokens = (mode) => ({
    ...(mode === "dark"
        ? {
            primary: {
                400: "#495162", // Add a valid color for primary[400] in dark mode
            },
            black_dark: {
                100: "#cfd1d4",
                200: "#9ea4aa",
                300: "#6e767f",
                400: "#3d4955",
                500: "#0d1b2a",
                600: "#0a1622",
                700: "#081019",
                800: "#050b11",
                900: "#030508"
            },
            black: {
                100: "#d1d4d8",
                200: "#a4a8b1",
                300: "#767d89",
                400: "#495162",
                500: "#1b263b",
                600: "#161e2f",
                700: "#101723",
                800: "#0b0f18",
                900: "#05080c"
            },
            blue_dark: {
                100: "#d9dee4",
                200: "#b3bdc9",
                300: "#8d9cad",
                400: "#677b92",
                500: "#415a77",
                600: "#34485f",
                700: "#273647",
                800: "#1a2430",
                900: "#0d1218"
            },
            blue: {
                100: "#e4e8ee",
                200: "#c9d1dd",
                300: "#adbbcb",
                400: "#92a4ba",
                500: "#778da9",
                600: "#5f7187",
                700: "#475565",
                800: "#303844",
                900: "#181c22"
            },
            white: {
                100: "#f9f9f8",
                200: "#f3f3f1",
                300: "#ecedeb",
                400: "#e6e7e4",
                500: "#e0e1dd",
                600: "#b3b4b1",
                700: "#868785",
                800: "#5a5a58",
                900: "#2d2d2c"
            },
            green: {
                100: "#e9f2e2",
                200: "#d3e5c5",
                300: "#bcd8a7",
                400: "#a6cb8a",
                500: "#90be6d",
                600: "#739857",
                700: "#567241",
                800: "#3a4c2c",
                900: "#1d2616"
            },
            yellow: {
                100: "#fef4dc",
                200: "#fde9b9",
                300: "#fbdd95",
                400: "#fad272",
                500: "#f9c74f",
                600: "#c79f3f",
                700: "#95772f",
                800: "#645020",
                900: "#322810"
            },
            red: {
                100: "#fee6db",
                200: "#fdceb7",
                300: "#fbb592",
                400: "#fa9d6e",
                500: "#f9844a",
                600: "#c76a3b",
                700: "#954f2c",
                800: "#64351e",
                900: "#321a0f"
            },
        }
    :   {
        primary: {
            400: "#92a4ba", // Add a valid color for primary[400] in light mode
        },
        black_light: {
            100: "#030508",
            200: "#050b11",
            300: "#081019",
            400: "#0a1622",
            500: "#0d1b2a",
            600: "#3d4955",
            700: "#6e767f",
            800: "#9ea4aa",
            900: "#cfd1d4"
        },
        black: {
            100: "#05080c",
            200: "#0b0f18",
            300: "#101723",
            400: "#161e2f",
            500: "#1b263b",
            600: "#495162",
            700: "#767d89",
            800: "#a4a8b1",
            900: "#d1d4d8"
        },
        blue_light: {
            100: "#0d1218",
            200: "#1a2430",
            300: "#273647",
            400: "#34485f",
            500: "#415a77",
            600: "#677b92",
            700: "#8d9cad",
            800: "#b3bdc9",
            900: "#d9dee4"
        },
        blue: {
            100: "#181c22",
            200: "#303844",
            300: "#475565",
            400: "#5f7187",
            500: "#778da9",
            600: "#92a4ba",
            700: "#adbbcb",
            800: "#c9d1dd",
            900: "#e4e8ee"
        },
        white: {
            100: "#2d2d2c",
            200: "#5a5a58",
            300: "#868785",
            400: "#b3b4b1",
            500: "#e0e1dd",
            600: "#e6e7e4",
            700: "#ecedeb",
            800: "#f3f3f1",
            900: "#f9f9f8"
        },
        green: {
            100: "#1d2616",
            200: "#3a4c2c",
            300: "#567241",
            400: "#739857",
            500: "#90be6d",
            600: "#a6cb8a",
            700: "#bcd8a7",
            800: "#d3e5c5",
            900: "#e9f2e2"
        },
        yellow: {
            100: "#322810",
            200: "#645020",
            300: "#95772f",
            400: "#c79f3f",
            500: "#f9c74f",
            600: "#fad272",
            700: "#fbdd95",
            800: "#fde9b9",
            900: "#fef4dc"
        },
        red: {
            100: "#321a0f",
            200: "#64351e",
            300: "#954f2c",
            400: "#c76a3b",
            500: "#f9844a",
            600: "#fa9d6e",
            700: "#fbb592",
            800: "#fdceb7",
            900: "#fee6db"
        },
    }),

});

// mui theme
export const themeSettings = (mode) => {
    const colors = tokens(mode);
    return {
        palette: {
            mode: mode,
            ...(mode === 'dark'
                ? {
                    primary: {
                        main: colors.black[500],
                    },
                    secondary: {
                        main: colors.black_dark[500],
                    },
                    neutral: {
                        dark: colors.black[700],
                        main: colors.black[500],
                        light: colors.black[100],
                    },
                    background: {
                        default: colors.black[500],
                        alt: colors.black_dark[500],
                    }
                } : {
                    primary: {
                        main: colors.blue[500],
                    },
                    secondary: {
                        main: colors.blue_light[500],
                    },
                    neutral: {
                        dark: colors.black[700],
                        main: colors.black[500],
                        light: colors.black[100],
                    },
                    background: {
                        default: colors.white[500],
                        alt: colors.white[100],
                    },
                }
            ),
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

        }
    };
};

// context for color mode
export const ColorModeContext = createContext({
    toggleColorMode: () => { },
});

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