import React from "react";
import AddItemForm from "./components/AddItemForm";
import { ListItems } from "./components/ListItems";
import { EditItemForm } from "./components/EditItemForm";
import { NAV_BAR_HEIGHT } from "../lib/constants/constants";
import Editor from "@/app/dashboard/components/Editor";

const DashboardPage = () => {

  return (
    <main className="p-8 flex justify-center items-start" style={{height: `calc(100vh - ${NAV_BAR_HEIGHT})`}}>
      <div id="widgets" className="w-full max-w-[1200px] lg:flex gap-4 items-start justify-center">
        <ListItems />
        <div className="space-y-4">
          <AddItemForm />
          <EditItemForm />
        </div>
          <Editor />
      </div>
    </main>
  );
};

export default DashboardPage;


