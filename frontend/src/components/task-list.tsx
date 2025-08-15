"use client";

import type { Task } from "@/lib/types";
import { TaskCard } from "./task-card";
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  categories: any;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedTask: Task) => void;
}

export function TaskList({ tasks, categories, onDelete, onUpdate }: TaskListProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-primary/20 text-card-foreground">Tasks</h2>
      {tasks.length > 0 ? (
        <div className="space-y-4 h-[65vh] overflow-y-auto">
          {tasks
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
