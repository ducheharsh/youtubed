"use client";

import { defaultExtensions } from "@/lib/extensions";
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
  type JSONContent,
} from "novel";
import React, { useReducer, useRef, useState } from "react";
import { slashCommand, suggestionItems } from "@/lib/slash-command";
import { NodeSelector } from "@/lib/selector/node-selector";
import { LinkSelector } from "@/lib/selector/link-selector";
import { TextButtons } from "@/lib/selector/text-buttons";
import { ColorSelector } from "@/lib/selector/color-selector";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { uploadFn } from "@/lib/image-upload";
import { Separator } from "../ui/separator";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { defaultValue } from "@/app/dashboard/default-value";

interface EditorProp {
  initialValue?: JSONContent;
  onChange?: (value: JSONContent) => void;
  saveNote?: () => void;
  id?: string;
  bool: boolean;
  time?: string;
  ref?: React.MutableRefObject<EditorInstance | null>;
}

const NovelEditor = ({
  initialValue = defaultValue,
  id,
  onChange,
  bool = true,
  saveNote,
}: EditorProp) => {
  const extensions = [...defaultExtensions, slashCommand];
  const editorRef = useRef<EditorInstance | null>(null);

  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openColor, setOpenColor] = useState(false);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  return (
    <EditorRoot>
      <div id={id}>
        <EditorContent
          onCreate={({ editor }) => {
            editorRef.current = editor;
            editor.setEditable(bool);
            console.log("created ✌️🚀");
            forceUpdate();
          }}
          className="border p-4 rounded-xl"
          extensions={extensions}
          onUpdate={({ editor }) => {
            if (bool == false) {
              editor.commands.setContent(initialValue);
            }

            if (onChange) {
              onChange(editor.getJSON());
            }
            console.log("updated ✌️🚀");
          }}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble
            tippyOptions={{
              placement: "top",
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
          >
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorBubble>
        </EditorContent>
      </div>
      <button
        onClick={() => {
          bool = !bool;
          if (editorRef.current) {
            editorRef.current.setEditable(bool);
            onChange && onChange(editorRef.current.getJSON());
          }
        }}
      ></button>
    </EditorRoot>
  );
};

export default NovelEditor;
