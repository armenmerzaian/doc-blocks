"use client";

import React, { useEffect, useState } from 'react'
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import { useSupabaseSubscription } from '@/hooks/useSupabaseSubscription';
import { getRowFromDB, updateRowInDB } from '@/lib/database/actions';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEventStore } from '@/stores/event-store'; // Add this import

export const EditItemForm = () => {
    const { user } = useUser() as { user: UserResource };
    const [currentItem, setCurrentItem] = useState<{ id: string; label: string }>();
    const { subscribeToChanges } = useSupabaseSubscription("item");
    const { on, off } = useEventStore(); // Add this line
    const form = useForm({
      defaultValues: {
        label: currentItem?.label || "",
        id: currentItem?.id || "",
      },
    });

    const fetchItem = async (id: any) => {
      try {
        const fetchedItem = await getRowFromDB(id, "item");
        setCurrentItem({
          id: fetchedItem.id,
          label: fetchedItem.name,
        });
      } catch (error) {
        console.error("Error fetching items:", error);
        throw new Error("Error deleting item.");
      }
    };

    useEffect(() => {
        if (!user) return;

        const handleSelectClick = ({
            eventData,
            elemId,
          }: {
            eventData: React.MouseEvent<HTMLButtonElement>;
            elemId: string;
          }) => {
            console.log("select click received", elemId);
            console.log(eventData);
            
            if(!currentItem || currentItem.id !== elemId){
                fetchItem(elemId);
            }
          };

        on("selectClick", handleSelectClick); // Replace Emitter.on with this

        if (currentItem) {
          form.reset({
            label: currentItem.label,
            id: currentItem.id,
          });
        }

        const unsubscribe = subscribeToChanges({
          onInsert: (payload) => {
            console.info("Insert Payload: ", payload);
          },
          onUpdate: (payload) => {
            console.info("Update Payload: ", payload);
            //@ts-expect-error Type is not fully defined in the payload
            if (payload.new.id === currentItem?.id) {
              setCurrentItem({
                //@ts-expect-error Type is not fully defined in the payload
                id: payload.new.id,
                //@ts-expect-error Type is not fully defined in the payload
                label: payload.new.name,
              });
            }
          },
          onDelete: (payload) => {
            console.info("Delete Payload: ", payload);
            //@ts-expect-error Type is not fully defined in the payload
            if (payload.old.id === currentItem?.id) {
              setCurrentItem(undefined);
              form.reset({
                label: "",
                id: "",
              });
            }
          },
        });

        return () => {
            unsubscribe();
            off("selectClick", handleSelectClick); // Replace Emitter.off with this
        };

    }, [user, currentItem, form, subscribeToChanges, on, off]); // Add on and off to the dependency array

    const onSubmitUpdate = async (data: any) => {
        console.log(data);
        
        try{
          await updateRowInDB(data.id, data.label, "item");
        }catch(error){
          console.error("Error updating item:", error);
          alert("Error updating item.");
        }
    };
    

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitUpdate)}
          className="space-y-8 p-5 w-full max-w-[400px] border rounded-md shadow"
        >
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input placeholder="Enter label" {...field} />
                </FormControl>
                <FormDescription>
                  This is the label for the item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ID" {...field} disabled />
                </FormControl>
                <FormDescription>
                  This is the unique identifier for the item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!currentItem}>Update Item</Button>
        </form>
      </Form>
    </div>
  );
}
