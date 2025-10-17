import { IEditorBlockText } from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import { Cross2Icon, CaretDownIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { List, ListRowRenderer } from "react-virtualized";
import "react-virtualized/styles.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ControllerRow from "../controller-row";
import { fontsList, fontWeights } from "./fonts";

function FontControl({
  editor,
  id,
  block,
}: {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [weights, setWeights] = useState([
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ]);

  const handleUpdateFontFamily = (key: string) => {
    if (block) {
      fontsList
        .find((e) => e.family === key)
        ?.load()
        .then((e) => {
          const info = e.getInfo();
          const newWeights = Object.keys(info?.fonts?.normal || {});
          let newWeight = block.font.weight;
          setWeights(newWeights);
          if (!newWeights.includes(block.font.weight)) {
            if (newWeights.includes("400")) {
              newWeight = "400";
            } else {
              newWeight = newWeights?.[0] || "400";
            }
          }
          editor.updateBlockValues(id, {
            font: {
              ...block.font,
              family: key,
              weight: newWeight,
            },
          });
          e.loadFont(undefined, {
            weights: [newWeight],
          });
        });
    }
  };

  const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
    return (
      <div
        key={key}
        style={style}
        className={cn(
          "text-sm flex items-center cursor-pointer rounded-md px-2 hover:bg-accent",
          {
            "bg-muted": fontsList[index].family === block?.font?.family,
          }
        )}
        onClick={() => handleUpdateFontFamily(fontsList[index].family)}
        role="presentation"
      >
        <span className="block m-w-[200px] text-ellipsis overflow-hidden whitespace-nowrap">
          {fontsList[index].family}
        </span>
      </div>
    );
  };

  const onWeightChange = (family: string, weight: string) => {
    const font = fontsList.find((e) => e.family === family);
    if (font) {
      font.load().then((e) => {
        e.loadFont(undefined, {
          weights: [weight],
        });
      });
    }
  };

  useEffect(() => {
    // update font weights when font family changes
    if (block?.font?.family) {
      const font = fontsList.find((e) => e.family === block.font.family);
      if (font) {
        font.load().then((e) => {
          const info = e.getInfo();
          const newWeights = Object.keys(info?.fonts?.normal || {});
          setWeights(newWeights);
          if (!newWeights.includes(block.font.weight)) {
            if (newWeights.includes("400")) {
              editor.updateBlockValues(id, {
                font: {
                  ...block.font,
                  weight: "400",
                },
              });
            }
          }
        });
      }
    }
  }, [block?.font.family]);

  return (
    <>
      <ControllerRow label="Font">
        <Popover open={open} onOpenChange={(e) => setOpen(e)}>
          <PopoverTrigger asChild>
            <div
              role="presentation"
              className="h-7 rounded-md bg-gray w-full border border-border flex items-center justify-between px-1 cursor-pointer"
            >
              <span className="text-ellipsis overflow-hidden text-nowrap text-xs max-w-[120px]">
                {fontsList.find((e) => e.family === block?.font?.family)
                  ?.family || block?.font?.family}
              </span>
              <CaretDownIcon />
            </div>
          </PopoverTrigger>
          <PopoverContent align="center" side="left">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
              <p className="text-xs font-semibold">Fonts</p>
              <div
                role="presentation"
                className="p-1 -mr-1 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <Cross2Icon className="h-3.5 w-3.5 opacity-50" />
              </div>
            </div>
            <div className="overflow-auto">
              <List
                width={219}
                height={300}
                rowHeight={25}
                rowCount={fontsList.length}
                rowRenderer={rowRenderer}
              />
            </div>
          </PopoverContent>
        </Popover>
      </ControllerRow>
      <ControllerRow label="Weight">
        <select
          name="fontWeight"
          id="fontWeight"
          value={block?.font?.weight}
          onChange={(e) => {
            if (block) {
              editor.updateBlockValues(id, {
                font: {
                  ...block.font,
                  weight: e.target.value || "400",
                },
              });
              onWeightChange(block.font.family, e.target.value || "400");
            }
          }}
          disabled={weights.length < 2}
        >
          {weights.map((e) => (
            <option key={e} value={e}>
              {fontWeights.find((i) => i.value === e)?.label || e}
            </option>
          ))}
        </select>
      </ControllerRow>
    </>
  );
}

export default FontControl;
