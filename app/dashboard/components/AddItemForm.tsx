"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addRowToDB } from "@/app/lib/database/actions";

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

const formSchema = z.object({
  itemName: z.string().min(2).max(50),
});

function AddItemForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    try {
      await addRowToDB(values.itemName, "item");
      form.reset();
    } catch (error) {
      alert(error)
    }
  }

  return (
    <div className="w-fit mx-auto space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-5 w-full md:max-w-[400px] border rounded-md shadow"
        >
          <FormField
            control={form.control}
            name="itemName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input Field</FormLabel>
                <FormControl>
                  <Input placeholder="Write something to save" {...field} />
                </FormControl>
                <FormDescription>
                  Selecting an Item from the List Will Override this value.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddItemForm;
