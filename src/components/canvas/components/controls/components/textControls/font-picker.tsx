import * as React from "react";
import type { ListRowRenderer } from "react-virtualized";
import { List } from "react-virtualized";
import type { IEditorBlockText } from "@/components/canvas/editor-types";
import type { EditorContextType } from "@/components/canvas/use-editor";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import ControllerRow from "../controller-row";
import { fontsList, fontWeights } from "./fonts";
import "react-virtualized/styles.css";

interface FontControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
  className?: string;
}

const DEFAULT_WEIGHTS = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];

const findFont = (family?: string) =>
  family ? fontsList.find((font) => font.family === family) : undefined;

function FontControl({ editor, id, block, className }: FontControlProps) {
  if (!block) {
    return null;
  }

  const [open, setOpen] = React.useState(false);
  const [weights, setWeights] = React.useState<string[]>(DEFAULT_WEIGHTS);

  const selectedFontFamily = block?.font.family;
  const selectedFont = findFont(selectedFontFamily);

  const applyFontWeights = React.useCallback(
    (family: string, fontWeightsList: string[], desiredWeight: string) => {
      if (!block) {
        return;
      }
      setWeights(fontWeightsList);
      const nextWeight = fontWeightsList.includes(desiredWeight)
        ? desiredWeight
        : fontWeightsList.includes("400")
        ? "400"
        : fontWeightsList[0] ?? desiredWeight;

      editor.updateBlockValues(id, {
        font: {
          ...block.font,
          family,
          weight: nextWeight,
        },
      });
    },
    [block, editor, id]
  );

  const handleUpdateFontFamily = React.useCallback(
    (family: string) => {
      const font = findFont(family);
      if (!font) {
        return;
      }
      font.load().then((loadedFont) => {
        const info = loadedFont.getInfo();
        const availableWeights = Object.keys(info?.fonts?.normal || {});
        applyFontWeights(family, availableWeights.length ? availableWeights : DEFAULT_WEIGHTS, block.font.weight);

        loadedFont.loadFont(undefined, {
          weights: [block.font.weight],
        });
      });
      setOpen(false);
    },
    [applyFontWeights, block]
  );

  const handleWeightChange = React.useCallback(
    (family: string, weight: string) => {
      const font = findFont(family);
      if (!font) {
        return;
      }
      font.load().then((loadedFont) => {
        loadedFont.loadFont(undefined, {
          weights: [weight],
        });
      });
    },
    []
  );

  React.useEffect(() => {
    if (!block.font.family) {
      return;
    }
    const font = findFont(block.font.family);
    if (!font) {
      return;
    }
    font.load().then((loadedFont) => {
      const info = loadedFont.getInfo();
      const availableWeights = Object.keys(info?.fonts?.normal || {});
      if (availableWeights.length) {
        setWeights(availableWeights);
        if (!availableWeights.includes(block.font.weight)) {
          const fallbackWeight = availableWeights.includes("400")
            ? "400"
            : availableWeights[0];
          editor.updateBlockValues(id, {
            font: {
              ...block.font,
              weight: fallbackWeight,
            },
          });
        }
      }
    });
  }, [block?.font.family, block?.font.weight, editor, id]);

  const rowRenderer: ListRowRenderer = React.useCallback(
    ({ index, key, style }) => {
      const font = fontsList[index];
      return (
        <button
          type="button"
          key={key}
          style={style}
          className={cn(
            "flex h-[25px] w-full items-center rounded-md px-2 text-left text-sm transition hover:bg-accent",
            {
              "bg-muted": font.family === selectedFontFamily,
            }
          )}
          onClick={() => handleUpdateFontFamily(font.family)}
        >
          <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {font.family}
          </span>
        </button>
      );
    },
    [handleUpdateFontFamily, selectedFontFamily]
  );

  return (
    <>
      <ControllerRow
        label="Font"
        className={className}
        contentClassName="justify-between"
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex h-7 w-full items-center justify-between rounded-md border border-border bg-muted px-2 text-xs transition hover:border-primary"
            >
              <span className="max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedFont?.family ?? block?.font.family ?? "Select"}
              </span>
              <CaretDownIcon className="h-3 w-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="center" side="left" className="w-[240px]">
            <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
              <p className="text-xs font-semibold">Fonts</p>
              <button
                type="button"
                className="rounded p-1 text-foreground/60 hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                <Cross2Icon className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="max-h-72 overflow-auto">
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
      <ControllerRow label="Weight" contentClassName="justify-between">
        <select
          name="fontWeight"
          id="fontWeight"
          value={block?.font?.weight}
          onChange={(event) => {
            if (!block) {
              return;
            }
            const nextWeight = event.target.value || "400";
            editor.updateBlockValues(id, {
              font: {
                ...block.font,
                weight: nextWeight,
              },
            });
            handleWeightChange(block.font.family, nextWeight);
          }}
          disabled={(weights ?? []).length < 2}
          className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs"
        >
          {weights.map((weight) => (
            <option key={weight} value={weight}>
              {fontWeights.find((item) => item.value === weight)?.label || weight}
            </option>
          ))}
        </select>
      </ControllerRow>
    </>
  );
}

export default FontControl;
