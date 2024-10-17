import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';
import { useEventStore } from '@/stores/event-store';
import { HiXCircle } from "react-icons/hi";

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
  const emit = useEventStore(state => state.emit);
  
  const handleDeleteButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    emit("deleteClick", {eventData: event, elemId: id});
  };

  const handleSelectButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("select button clicked");
    emit("selectClick", {eventData: event, elemId: id});
  };

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <button id={id} className="flex-grow text-left" onClick={handleSelectButtonClick}>
        {children ? children : <p>{label}</p>}
      </button>
      <button onClick={handleDeleteButtonClick} className="flex-grow-0">
        <HiXCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ListItem;
