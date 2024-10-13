"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { getAllRowsFromDB } from "@/app/lib/database/actions";
import { useUser } from "@clerk/nextjs";
import { useSupabaseSubscription } from "@/app/hooks/useSupabaseSubscription";
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export const ListItems: React.FC = () => {
  const { user } = useUser();
  const [items, setItems] = useState<string[]>([]);
  const { subscribeToChanges } = useSupabaseSubscription("item");

  useEffect(() => {
    if (!user) return;

    const fetchItems = async () => {
      try {
        const fetchedItems = await getAllRowsFromDB("item");
        setItems(fetchedItems.map((item) => item.name));
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();

    const handlers = {
      onInsert: (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
        console.log("Insert Payload: ", payload);
        setItems((prevItems) => [...prevItems, payload.new.name]);
      },
      onUpdate: (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
        console.log("Update Payload: ", payload);
        setItems((prevItems) =>
          prevItems.map((item) => (item === payload.old.name ? payload.new.name : item))
        );
      },
      onDelete: (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
        console.log("Delete Payload: ", payload);
        setItems((prevItems) => prevItems.filter((item) => item !== payload.old.name));
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
        {items.map((item: any, index: number) => (
          <div key={index}>
            <div className="text-sm">{item}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
