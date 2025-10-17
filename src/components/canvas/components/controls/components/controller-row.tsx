import React from "react";

function ControllerRow({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2.5 pl-2">
      <p className="text-xs text-foreground/70 min-w-[60px]">{label}</p>
      {children}
    </div>
  );
}

export default ControllerRow;
