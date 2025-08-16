import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react"; // This is the icon
import { Calendar } from "@/components/ui/calendar"; // This should be your date picker component
import { Tag, Circle, CircleCheck, CircleDashed, Trash2, Pencil, CalendarDays } from "lucide-react";
import type { Task } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, task: Task) => void;
  categories: any[];
}

function getDueLabel(dueISO: string): string {
  // Start-of-day helper in local time
  const startOfLocalDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const now = new Date();
  const today = startOfLocalDay(now);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

  // Parse incoming ISO (with or without 'Z') and extract *UTC* Y/M/D
  const parsed = new Date(dueISO);
  const dueLocal = new Date(
    parsed.getUTCFullYear(),
    parsed.getUTCMonth(),
    parsed.getUTCDate()
  ); // local midnight for that calendar date

  const t = dueLocal.getTime();
  if (t === today.getTime()) return "Today";
  if (t === tomorrow.getTime()) return "Tomorrow";
  if (t === yesterday.getTime()) return "Yesterday";

  return format(dueLocal, "MMM d, yyyy");
}

const statusConfig = {
  "Sin Empezar": {
    icon: <CircleDashed className="h-4 w-4" />,
    badgeVariant: "secondary" as const,
    className: ""
  },
  "Empezada": {
    icon: <Circle className="h-4 w-4" />,
    badgeVariant: "default" as const,
    className: ""
  },
  "Finalizada": {
    icon: <CircleCheck className="h-4 w-4" />,
    badgeVariant: "outline" as const,
    className: "text-accent-foreground border-accent bg-accent/20"
  }
};

export function TaskCard({ task, onDelete, onUpdate, categories }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTask, setEditTask] = useState(task);
  const [data, setData] = useState(task);

  const { icon, badgeVariant, className } = statusConfig[task.status];
  // Overdue if not finished and due date is before end of today
  const isOverdue =
    !['Finalizada'].includes(task.status) &&
    new Date(task.end_date) < new Date(new Date().setHours(0, 0, 0, 0));

  const handleEditChange = (field: keyof Task, value: any) => {
    setEditTask({ ...editTask, [field]: value });
  };

  const handleSave = () => {
    setEditMode(false);
    if (onUpdate) onUpdate(String(task.id), data);
  };

  const form = useForm({
    defaultValues: {
      text: task.text,
      status: task.status,
      category: task.category.name,
      end_date: new Date(task.end_date),
    },
  });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  // Move editMode logic to dialog
  const openEditDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
    setEditMode(true);
  };

  const closeEditDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    form.reset();
  };

  function onSubmit(data: any) {
    setData(data);
  }



  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md cursor-pointer",
        isOverdue && "border-destructive/50 bg-destructive/5"
      )}
      onClick={() => { if (!editMode) setExpanded(!expanded); }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              {editMode ? (
                <FormField
                  name="text"
                  render={({ field }) => (
                    <FormItem className="w-full pr-4">
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder={task.text}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <CardTitle className="text-md font-medium leading-tight pr-4">{task.text}</CardTitle>
              )}
              <Badge
                variant={badgeVariant}
                className={cn("flex-shrink-0 cursor-pointer", className)}
                onClick={e => {
                  e.stopPropagation();
                  // Cycle through statuses: "Sin Empezar" -> "Empezada" -> "Finalizada" -> "Sin Empezar"
                  const statuses = ["Sin Empezar", "Empezada", "Finalizada"];
                  const currentIndex = statuses.indexOf(editMode ? editTask.status : task.status);
                  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                  if (editMode) {
                    setEditTask({ ...editTask, status: nextStatus as Task["status"] });
                  }
                }}
              >
                {icon}
                <span className="ml-2">{task.status}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center">
                <>
                  <Tag className="h-4 w-4" />
                  <span className="w-full block">{task.category.name}</span>
                </>
              </div>
              <div className={cn("flex items-center", isOverdue && "text-destructive font-medium")}>

                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{getDueLabel(task.end_date)}</span>
                </div>
              </div>
            </div>
            {expanded && !editMode && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div><strong>ID:</strong> {task.id}</div>
                <div><strong>Created:</strong> {getDueLabel(task.creation_date)}</div>
              </div>

            )}
            {expanded && (
              <div className="mt-4 flex gap-2">
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={e => {
                      e.stopPropagation();
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={e => {
                      e.stopPropagation();
                      if (onDelete) onDelete(String(task.id));
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </>
              </div>
            )}
          </CardContent>
        </form>
      </Form>
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeEditDialog}>
          <div
            className="bg-white rounded-lg shadow-lg p-6 min-w-[350px] max-w-[90vw]"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(data => {
                  setEditMode(false);
                  setDialogOpen(false);
                  if (onUpdate) {
                    onUpdate(String(task.id), {
                      ...task,
                      text: data.text,
                      status: data.status,
                      category: categories.find(c => c.name === data.category) || task.category,
                      end_date: data.end_date instanceof Date ? data.end_date.toISOString() : data.end_date,
                    });
                  }
                })}
                className="space-y-4"
              >
                <FormField
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full gap-4">

                  <FormField
                    name="status"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Status</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Sin Empezar">Sin Empezar</SelectItem>
                            <SelectItem value="Empezada">Empezada</SelectItem>
                            <SelectItem value="Finalizada">Finalizada</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="end_date"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className="w-full text-left font-normal">
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={date => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>

                    )}
                  />
                </div>

                <div className="flex gap-2 justify-end mt-4">
                  <Button type="submit" variant="default">
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      closeEditDialog();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </Card>
  );
}
