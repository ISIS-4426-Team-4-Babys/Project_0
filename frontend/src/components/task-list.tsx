"use client";

import type { Task } from "@/lib/types";
import { TaskCard } from "./task-card";
import { ClipboardList } from 'lucide-react';
import { useState } from "react";
import { Select, SelectValue } from "./ui/select";
import { FormControl } from "./ui/form";
import { SelectContent, SelectItem, SelectTrigger } from "@radix-ui/react-select";

interface TaskListProps {
  tasks: Task[];
  categories: any;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedTask: Task) => void;
}

export function TaskList({ tasks, categories, onDelete, onUpdate }: TaskListProps) {
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4 border-b-2 border-primary/20 ">
        <h2 className="text-2xl font-semibold pb-2 text-card-foreground">Tasks</h2>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-64 rounded-lg px-4 py-2 text-[#1e3a8a] shadow bg-white mb-2 text-base"
          >
            <option value="All Statuses">All Status</option>
            <option value="Sin Empezar">Sin Empezar</option>
            <option value="Empezada">Empezada</option>
            <option value="Finalizada">Finalizada</option>
          </select>

          <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="w-64 rounded-lg px-4 py-2 text-[#1e3a8a] shadow bg-white mb-2 text-base"
          >
        <option value="All Categories">All Categories</option>
        {categories.map((cat: { id: string; name: string }) => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
          </select>
        </div>
      </div>
      {tasks.length > 0 ? (
        <div className="space-y-4 h-[65vh] overflow-y-auto">
          {tasks
            .filter(task =>
              (statusFilter === "" || statusFilter === "All Statuses" || task.status === statusFilter) &&
              (categoryFilter === "" || categoryFilter === "All Categories" || task.category.name === categoryFilter)
            )
            .slice()
            .sort((a, b) => {
              const aIsDone = ['Done'].includes(a.status);
              const bIsDone = ['Done'].includes(b.status);
              if (aIsDone && !bIsDone) return 1;
              if (!aIsDone && bIsDone) return -1;
              return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
            })
            .map((task) => (
              <TaskCard key={task.id} task={task} onDelete={onDelete} onUpdate={onUpdate} categories={categories} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            No tasks available.
          </p>
          <p className="text-sm text-muted-foreground">
            Add a task to get started!
          </p>
        </div>
      )}
    </div>
  );
}
