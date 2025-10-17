import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface ControllerBoxProps {
  label: string;
  children: React.ReactNode;
  borderTop?: boolean;
}

function ControllerBox(props: ControllerBoxProps) {
  const { label, children, borderTop = true } = props;
  return (
    <Accordion className="px-4" type="single" defaultValue="item-1" collapsible>
      <AccordionItem
        className={cn({
          "border-t": borderTop,
        })}
        value="item-1"
      >
        <AccordionTrigger>{label}</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2.5">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default ControllerBox;
