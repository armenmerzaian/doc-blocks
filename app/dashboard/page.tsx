import React from "react";
import AddItemForm from "./components/AddItemForm";
import { ListItems } from "./components/ListItems";
import { ListItemTwo } from "./components/ListItemsTwo";

const DashboardPage = () => {
  return (
    <main className="p-8">
      Dashboard
      <ListItems />
      <AddItemForm />
    </main>
  );
};

export default DashboardPage;
