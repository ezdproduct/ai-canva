'use client';

import { ThemeProvider } from "../components/theme-provider";
import { demoTemplate1 } from "../data/template-1";
import Canvas from "../components/canvas";

export default function Page() {
  return (
    <ThemeProvider>
      <Canvas template={demoTemplate1} />
    </ThemeProvider>
  );
}
