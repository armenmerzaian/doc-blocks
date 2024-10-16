"use client";

import Editor from "@/app/components/editor/advanced-editor";
import { defaultValue } from "@/app/components/editor/default-value";
import { JSONContent } from "novel";
import React, { ReactNode, HTMLAttributes, useState } from "react";

interface DashboardEditorProps extends HTMLAttributes<HTMLDivElement> {
  //props
    children?: ReactNode;
}

const DashboardEditor: React.FC<DashboardEditorProps> = (
{
  children,
  ...restProps
}) => {

  const [value, setValue] = useState<JSONContent>(defaultValue);

  
  return (
  <Editor initialValue={value} onChange={setValue} />
);
};

export default DashboardEditor;
