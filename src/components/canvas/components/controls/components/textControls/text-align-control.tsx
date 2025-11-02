import type { IEditorBlockText, ITextAlign } from "@/lib/schema";
import type { EditorContextType } from "@/components/canvas/use-editor";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
} from "@radix-ui/react-icons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ControllerRow from "../controller-row";

interface TextAlignControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
  className?: string;
}

function TextAlignControl({
  editor,
  id,
  block,
  className,
}: TextAlignControlProps) {
  return (
    <ControllerRow label="Align" className={className} contentClassName="justify-between">
      <Tabs
        value={block?.textAlign}
        className="w-full"
        onValueChange={(e) => {
          if (block) {
            editor.updateBlockValues(id, {
              textAlign: e as ITextAlign,
            });
          }
        }}
      >
        <TabsList>
          <TabsTrigger value="left">
            <TextAlignLeftIcon className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="center">
            <TextAlignCenterIcon className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="right">
            <TextAlignRightIcon className="h-3 w-3" />
          </TabsTrigger>
          <TabsTrigger value="justify">
            <TextAlignJustifyIcon className="h-3 w-3" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </ControllerRow>
  );
}

export default TextAlignControl;
