"use server";

import { createClerkSupabaseClientSsr } from "./createClerkSupabaseClientSsr";

const client = createClerkSupabaseClientSsr();

export async function addRowToDB(name: string, table: string) { 
  const response = await client.from(table).insert({
      name,
  });

  if (response.error) throw response.error;

  console.info("Item successfully added!", response.data);
  return response.data;
}

export async function getAllRowsFromDB(table: string){
  const response = await client.from(table).select();

  if (response.error) throw response.error;

  console.info("Retrieved items: ", response.data)
  return response.data;
}

export async function getRowFromDB(id: string, table: string){
  const response = await client.from(table).select().eq("id", id);

  if (response.error) throw response.error;

  console.info("Retrieved item: ", response.data);
  return response.data[0];
}


export async function deleteRowFromDB(id: string, table: string) {
  const response = await client.from(table).delete().eq("id", id);

  if (response.error) throw response.error;

  console.info("Item successfully deleted!", response.data);
  return response.data;
}

export async function updateRowInDB(id: string, name: string, table: string) {
  const response = await client.from(table).update({ name }).eq("id", id);

  if (response.error) throw response.error;

  console.info("Item successfully updated!", response.data);
  return response.data;
}