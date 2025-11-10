"use client";

import { ThemeProvider } from "../components/theme-provider";
import { demoTemplate1 } from "../data/template-1";
import Canvas from "../components/canvas";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function Page() {
  return (
    <ThemeProvider>
      <Tooltip.Provider>
        <Canvas template={demoTemplate1} />
      </Tooltip.Provider>
    </ThemeProvider>
  );
}
