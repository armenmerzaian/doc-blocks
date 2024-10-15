import React, { ReactNode, HTMLAttributes } from 'react';

interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    children?: ReactNode;
}

const Editor: React.FC<MyComponentProps> = (
    {
        title,
        subtitle = 'Default Subtitle',
        children,
        ...restProps
    }): React.ReactElement => {


    return (
        <div {...restProps}>
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
            <div>{children ? children : "No children"}</div>
        </div>
    );
};

export default Editor;