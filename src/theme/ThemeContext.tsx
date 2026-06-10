import { createContext, useContext } from "react";

export type Theme = "immersive" | "bright";

export const ThemeContext = createContext<Theme>("immersive");

export const useTheme = () => useContext(ThemeContext);

export const isBright = (t: Theme) => t === "bright";
