"use client";
import React, { useState } from "react";
import { addItem } from "../services/databaseActions";
import { useRouter } from "next/navigation";

function AddTaskForm() {
  const [taskName, setTaskName] = useState("");
  const router = useRouter();

  async function onSubmit() {
    await addItem(taskName);
    setTaskName("");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="border rounded-md drop-shadow-md p-4">
      <div className="flex flex-col">
          <input
            autoFocus
            type="text"
            name="name"
            placeholder="Enter new task"
            onChange={(e) => setTaskName(e.target.value)}
            value={taskName}
          />
          <button type="submit">Add</button>
      </div>
    </form>
  );
}
export default AddTaskForm;
