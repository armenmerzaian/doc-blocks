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
import Emitter from "@/app/lib/emitter";

export const ListItems: React.FC = () => {
  const { user } = useUser() as { user: UserResource };
  const [items, setItems] = useState<Array<{ id: string; label: string }>>([]);
  const { subscribeToChanges } = useSupabaseSubscription("item");

  useEffect(() => {
    if (!user) return;

    Emitter.on(
      "deleteClick",
      ({
        eventData,
        elemId,
      }: {
        eventData: React.MouseEvent<HTMLButtonElement>;
        elemId: string;
      }) => {
        console.log("delete click received", elemId);
        console.log(eventData);
        deleteItem(elemId);
      }
    );

    const deleteItem = async (id: string) => {
      try {
        await deleteRowFromDB(id, "item");
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting item:", error);
        throw new Error("Error deleting item.")
      }
    };

    const fetchItems = async () => {
      try {
        const fetchedItems = await getAllRowsFromDB("item");
        setItems(
          fetchedItems.map((item) => {
            return {
              id: item.id,
              label: item.name,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching items:", error);
        throw new Error("Error deleting item.")
      }
    };

    fetchItems();

    const handlers = {
      onInsert: (
        payload: RealtimePostgresChangesPayload<{ [key: string]: any }>
      ) => {
        console.info("Insert Payload: ", payload);
        //@ts-expect-error Type is not fully defined in the payload
        setItems((prevItems) => [...prevItems, {id: payload.new.id, label: payload.new.name}]);
      },
      onUpdate: (
        payload: RealtimePostgresChangesPayload<{ [key: string]: any }>
      ) => {
        console.info("Update Payload: ", payload);
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
        console.info("Delete Payload: ", payload);
        setItems((prevItems) =>
          //@ts-expect-error Type is not fully defined in the payload
          prevItems.filter((item) => item !== payload.old.name)
        );
      },
    };

    const unsubscribeRealtime = subscribeToChanges(handlers);

    return () => {
      unsubscribeRealtime();
      Emitter.off("deleteClick", ()=>{});
    };
  }, [user, subscribeToChanges]);

  if (!items || items.length === 0) {
    return <div>No items found.</div>;
  }

  return (
    <ScrollArea className="h-[500px] w-full max-w-[400px] border rounded-md shadow p-4">
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
