import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import ButtonsGroup from "@/components/ui/buttons-group";

function ZoomHandler({
  zoomIn,
  zoomOut,
  resetZoom,
}: {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}) {
  return (
    <div className="absolute bottom-4 right-4 bg-background">
      <ButtonsGroup
        buttons={[
          {
            children: <MinusIcon />,
            onClick: zoomOut,
            label: "Zoom Out",
          },
          {
            children: <PlusIcon />,
            onClick: zoomIn,
            label: "Zoom In",
          },
          {
            children: <span className="text-sm px-2">Reset</span>,
            onClick: resetZoom,
            label: "Reset Zoom",
          },
        ]}
      />
    </div>
  );
}

export default ZoomHandler;
