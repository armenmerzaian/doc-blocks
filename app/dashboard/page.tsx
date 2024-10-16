import React from "react";
import AddItemForm from "./components/add-item-form/add-item-form";
import { ListItems } from "./components/list-items/list-items";
import { EditItemForm } from "./components/edit-item-form/edit-item-form";
import { NAV_BAR_HEIGHT } from "../lib/constants/constants";
import DashboardEditor from "./components/dashboard-editor/dashboard-editor";

const DashboardPage = () => {

  return (
    <main
      className="p-8 flex justify-center items-start"
      style={{ height: `calc(100vh - ${NAV_BAR_HEIGHT})` }}
    >
      <div
        id="widgets"
        className="w-full max-w-[1200px] lg:flex gap-4 items-start justify-center"
      >
        <ListItems />
        <div className="space-y-4">
          <AddItemForm />
          <EditItemForm />
          <DashboardEditor />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;


