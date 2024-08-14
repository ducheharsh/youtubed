import { cn } from "@/lib/utils";
import { EditorBubbleItem, useEditor } from "novel";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
} from "lucide-react";
import type { SelectorItem } from "./node-selector";
import { Button } from "@/components/ui/button";

export const TextButtons = () => {
  const { editor } = useEditor();
  if (!editor) return null;
  const items: SelectorItem[] = [
    {
      name: "bold",
      isActive: (editor: any) => editor.isActive("bold"),
      command: (editor: any) => editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: (editor: any) => editor.isActive("italic"),
      command: (editor: any) => editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: (editor: any) => editor.isActive("underline"),
      command: (editor: any) => editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: (editor: any) => editor.isActive("strike"),
      command: (editor: any) => editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      isActive: (editor: any) => editor.isActive("code"),
      command: (editor: any) => editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];
  return (
    <div className="flex">
      {items.map((item, index) => (
        <EditorBubbleItem
          key={index}
          onSelect={(editor) => {
            item.command(editor);
          }}
        >
          <Button size="icon" className="rounded-none" variant="ghost">
            <item.icon
              className={cn("h-4 w-4", {
                "text-blue-500": item.isActive(editor),
              })}
            />
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  );
};
