"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { deleteRowFromDB, getAllRowsFromDB } from "@/lib/database/actions";
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import { useSupabaseSubscription } from "@/hooks/useSupabaseSubscription";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import ListItem from "@/components/ui/list-item";
import { useEventStore } from '@/stores/event-store';

export const ListItems: React.FC = () => {
  const { user } = useUser() as { user: UserResource };
  const [items, setItems] = useState<Array<{ id: string; label: string }>>([]);
  const { subscribeToChanges } = useSupabaseSubscription("item");
  const { on, off } = useEventStore();

  useEffect(() => {
    if (!user) return;

    const handleDeleteClick = async ({ elemId }: { elemId: string }) => {
      console.log("delete click received", elemId);
      try {
        await deleteRowFromDB(elemId, "item");
        // The actual removal of the item from the state will be handled by the onDelete handler
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Error deleting item.");
      }
    };

    on("deleteClick", handleDeleteClick);

    const fetchItems = async () => {
      try {
        const fetchedItems = await getAllRowsFromDB("item");
        setItems(
          fetchedItems.map((item) => ({
            id: item.id,
            label: item.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching items:", error);
        alert("Error fetching items.");
      }
    };

    fetchItems();

    const unsubscribe = subscribeToChanges({
      onInsert: (
        payload: RealtimePostgresChangesPayload<{ [key: string]: any }>
      ) => {
        console.info("Insert Payload: ", payload);
        setItems((prevItems) => [
          ...prevItems,
          //@ts-expect-error Type is not fully defined in the payload
          { id: payload.new.id, label: payload.new.name },
        ]);
      },
      onUpdate: (
        payload: RealtimePostgresChangesPayload<{ [key: string]: any }>
      ) => {
        console.info("Update Payload: ", payload);
        setItems((prevItems) =>
          prevItems.map((item) =>
            //@ts-expect-error Type is not fully defined in the payload
            item.id === payload.new.id
              ? //@ts-expect-error Type is not fully defined in the payload
                { ...item, label: payload.new.name }
              : item
          )
        );
      },
      onDelete: (
        payload: RealtimePostgresChangesPayload<{ [key: string]: any }>
      ) => {
        console.info("Delete Payload: ", payload);
        setItems((prevItems) =>
          //@ts-expect-error Type is not fully defined in the payload
          prevItems.filter((item) => item.id !== payload.old.id)
        );
      },
    });

    return () => {
      unsubscribe();
      off("deleteClick", handleDeleteClick);
    };
  }, [user, subscribeToChanges, on, off]);

  if (!items || items.length === 0) {
    return (
        <div className="h-[500px] w-full max-w-[400px] flex items-center justify-center border rounded-md shadow p-4">
          <p className="">Loading...</p>
        </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] w-full max-w-[400px] border rounded-md shadow p-4">
      <div className="p-4">
        {items.map(({ id, label }) => (
          <div key={id}>
            <ListItem id={id} label={label} className="text-sm" />
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
