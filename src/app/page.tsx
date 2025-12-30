"use client";

import * as React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { demoTemplate1 } from "../data/template-1";
import Canvas from "../components/canvas";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function Page() {
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      return "You have unsaved changes. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <ThemeProvider>
      <Tooltip.Provider>
        <Canvas />
      </Tooltip.Provider>
    </ThemeProvider>
  );
}
