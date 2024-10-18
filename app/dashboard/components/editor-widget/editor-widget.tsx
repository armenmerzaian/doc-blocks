"use client"

import React, { ReactNode, HTMLAttributes } from "react";
import {
  usePlateEditor,
  Plate,
} from "@udecode/plate-common/react";
import { Editor } from "@/components/plate-ui/editor";
import { cn } from "@/lib/utils";

interface EditorWidgetProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  defaultValue?: any; //JSONContent
  children?: ReactNode;
}

const value = [
  {
    type: "p",
    children: [
      {
        text: "This is editable plain text with react and history plugins, just like a <textarea>!",
      },
    ],
  },
];

const EditorWidget: React.FC<EditorWidgetProps> = ({
  className,
  defaultValue,
  children,
  ...restProps
}) => {

  const editor = usePlateEditor({
    value,
  });

  return (
      <div className={cn(className,"mt-[72px] p-10")}>
        <Plate editor={editor}>
          <Editor placeholder="Type your message here." />
        </Plate>
      </div>
  );
};

export default EditorWidget;
