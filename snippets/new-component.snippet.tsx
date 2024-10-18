import React, { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface MyComponentProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  children?: ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({
  className,
  children,
  ...restProps
}) => {
  return (
    <>
      <div {...restProps} className={cn("TailwindClasses", className)}>
        {children}
      </div>
    </>
  );
};

export default MyComponent;
