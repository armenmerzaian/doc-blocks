import React from 'react';
import { createClerkSupabaseClientSsr } from "../client";
import { PostgrestError } from '@supabase/supabase-js';
import AddTaskForm from './components/AddTaskForm';

const DashboardPage = async () => {

    const client = createClerkSupabaseClientSsr();

    const { data, error }: { data: any, error: PostgrestError | null} = await client.from("item").select();
    if (error) {
      throw error;
    }
    const itemsList: any = data;

  return (
    <main className="p-8">
      Dashboard
      
      
      <div>
        {itemsList?.map((item: any, key: any) => (
          <p id={key}>{item.name}</p>
        ))}
      </div>

       <AddTaskForm />
    </main>
  );
};
export default DashboardPage;
