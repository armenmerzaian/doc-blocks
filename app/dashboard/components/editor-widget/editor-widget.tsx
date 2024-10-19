"use client"

import React, { ReactNode, HTMLAttributes } from "react";
import {
  usePlateEditor,
  Plate,
  PlateEditor,
} from "@udecode/plate-common/react";
import { Editor } from "@/components/plate-ui/editor";
import { cn } from "@/lib/utils";
interface EditorWidgetProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  defaultValue?: any; //JSONContent
  children?: ReactNode;
}

const defVal = [
  {
    children: [
      {
        text: "This is editable plain text with react and history plugins, just like a <textarea>!",
      },
    ],
    type: "p",
  },
];



 const localValue =
   typeof window !== "undefined" && localStorage.getItem("editorContent");

const EditorWidget: React.FC<EditorWidgetProps> = ({
  className,
  defaultValue,
  children,
  ...restProps
}) => {

  const editor: PlateEditor = usePlateEditor({
    value: localValue ? JSON.parse(localValue) : defVal,
  });

  return (
    <div className={cn("mt-[72px] p-10", className)}>
      <Plate
        editor={editor}
        onChange={({ value }) => {
          localStorage.setItem("editorContent", JSON.stringify(value));
        }}
      >
        <Editor placeholder="Type your message here." />
      </Plate>
    </div>
  );
};

export default EditorWidget;
