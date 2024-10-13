import React, { ReactNode } from 'react';
import EventEmitter from "reactjs-eventemitter";

interface ListItemProps {
  id: string;
  label?: string;
  className?: string;
  children?: ReactNode;
  onButtonClick?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  id,
  label,
  className,
  children,
}) => {
  
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    EventEmitter.emit("buttonClick", {eventData: event, elemId: id});
  };

  return (
    <div id={id} className={className}>
      {children ? children : <p>{label}</p>}
      <button onClick={handleButtonClick}>X</button>
    </div>
  );
};

export default ListItem;
