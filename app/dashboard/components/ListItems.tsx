"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { deleteRowFromDB, getAllRowsFromDB } from "@/app/lib/database/actions";
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import { useSupabaseSubscription } from "@/app/hooks/useSupabaseSubscription";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import ListItem from "@/app/components/ListItem";
import EventEmitter from "reactjs-eventemitter";

export const ListItems: React.FC = () => {
  const { user } = useUser() as { user: UserResource };
  const [items, setItems] = useState<Array<{ id: string; label: string }>>([]);
  const { subscribeToChanges } = useSupabaseSubscription("item");

  useEffect(() => {
    if (!user) return;

    EventEmitter.subscribe(
      "buttonClick",
      ({
        eventData,
        elemId,
      }: {
        eventData: React.MouseEvent<HTMLButtonElement>;
        elemId: string;
      }) => {
        alert("Clicked" + elemId);
        deleteItem(elemId);
      }
    );

    const deleteItem = async (id: string) => {
      try {
        await deleteRowFromDB(id, "item");
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    };

    const fetchItems = async () => {
      try {
        const fetchedItems = await getAllRowsFromDB("item");
        console.log("Fetched items: ", fetchedItems);
        setItems(
          fetchedItems.map((item) => {
            return {
              id: item.id,
              label: item.name,
            };
          })
        );
        console.log("Items: ", items);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();

    const handlers = {
      onInsert: (
        payload: RealtimePostgresChangesPayload<{ [key: string]: any }>
      ) => {
        console.log("Insert Payload: ", payload);
        //@ts-expect-error Type is not fully defined in the payload
        setItems((prevItems) => [...prevItems, {id: payload.new.id, label: payload.new.name}]);
      },
      onUpdate: (
        payload: RealtimePostgresChangesPayload<{ [key: string]: any }>
      ) => {
        console.log("Update Payload: ", payload);
        setItems((prevItems) =>
          prevItems.map((item) =>
            //@ts-expect-error Type is not fully defined in the payload
            item === payload.old.name ? payload.new.name : item
          )
        );
      },
      onDelete: (
        payload: RealtimePostgresChangesPayload<{ [key: string]: any }>
      ) => {
        console.log("Delete Payload: ", payload);
        setItems((prevItems) =>
          //@ts-expect-error Type is not fully defined in the payload
          prevItems.filter((item) => item !== payload.old.name)
        );
      },
    };

    const unsubscribe = subscribeToChanges(handlers);

    return () => {
      unsubscribe();
    };
  }, [user, subscribeToChanges]);

  if (!items || items.length === 0) {
    return <div>No items found.</div>;
  }

  return (
    <ScrollArea className="h-[200px] w-full md:max-w-[400px] rounded-md border p-4">
      <div className="p-4">
        {items.map(({ id, label }: { id: string; label: string }) => (
          <div key={id}>
            <ListItem id={id} label={label} className="text-sm" />
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
