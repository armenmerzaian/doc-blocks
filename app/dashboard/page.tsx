import React from "react";
import AddItemForm from "@/app/dashboard/components/add-item-form/add-item-form";
import { ListItems } from "@/app/dashboard/components/list-items/list-items";
import { EditItemForm } from "@/app/dashboard/components/edit-item-form/edit-item-form";
import { NAV_BAR_HEIGHT } from "@/lib/constants/constants";
import EditorWidget from "@/app/dashboard/components/editor-widget/editor-widget";

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
          <EditorWidget />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;


