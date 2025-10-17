import { IEditorBlockText, ITextAlign } from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
} from "@radix-ui/react-icons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ControllerRow from "../controller-row";

function TextAlignControl({
  editor,
  id,
  block,
}: {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
}) {
  return (
    <ControllerRow label="Align">
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
