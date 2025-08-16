"use client";

import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle, Tag, Layers, CalendarDays, Trash2, Pencil } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";


export function TaskForm({ addTask, categories, addCategory, deleteCategory, updateCategory }: { addTask: (task: Task) => void; categories: any[]; addCategory: (e: React.FormEvent, newCategoryName: string, newCategoryDescription: string) => void; deleteCategory: (id: number) => void; updateCategory: (id: number, newName: string, newDescription: string) => void }) {
  const form = useForm({
    defaultValues: {
      description: "",
      status: "",
      category: "",
      dueDate: new Date(new Date().setHours(0, 0, 0, 0)),
    },
  });
  const [open, setOpen] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  function onSubmit(data: any) {
    addTask(data);
    form.reset({
      description: "",
      status: "",
      category: "",
      dueDate: new Date(new Date().setHours(0, 0, 0, 0)),
    });
  }

  function onSaveCat(e: React.FormEvent) {
    if (editingCategory) {
      updateCategory(editingCategory, newCategoryName, newCategoryDescription);
      setEditingCategory(null);
    } else {
      addCategory(e, newCategoryName, newCategoryDescription);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Buy milk and eggs" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 mb-2">
                <FormLabel className="flex items-center gap-2"><Tag className="h-4 w-4" />Category</FormLabel>
                <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-2"
                aria-label="Manage categories"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Layers className="h-4 w-4" />
              </Button>
              </div>
                <Select
                    value={field.value}
                    onValueChange={field.onChange}
                >
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="No categories available" disabled>
                          No categories available
                        </SelectItem>
                      )}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
              )}
            />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                    }}
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate()-1))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={
            !form.watch("description") ||
            !form.watch("category") ||
            !form.watch("dueDate")
          }
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Task
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Manage Categories</DialogTitle>
            </DialogHeader>
            <div>
              <div className="flex items-center justify-between">
                <p>Here you can add or delete categories.</p>
                <Button
                  size="sm"
                  onClick={() => setShowAddRow(true)}
                >
                  Add Category
                </Button>
              </div>
              <div className="mt-6">
              {showAddRow && (
                <form
                  className="flex flex-col gap-2 mt-4"
                  onSubmit={(e) => {
                    onSaveCat(e);
                    setShowAddRow(false);
                    setNewCategoryName("");
                    setNewCategoryDescription("");
                  }}
                >
                  <Input
                    className="shadow-md"
                    placeholder="Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                  />
                  <Input
                    className="shadow-md"
                    placeholder="Category Description"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        onSaveCat(e);
                        setShowAddRow(false);
                        setNewCategoryName("");
                        setNewCategoryDescription("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
              </div>
              <ul className="mt-4 space-y-2">
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between border rounded px-3 py-2">
                  <span>{category.name}</span>
                    <span className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit category"
                        onClick={() => {
                          setShowAddRow(true);
                          setNewCategoryName(category.name);
                          setNewCategoryDescription(category.description || "");
                          setEditingCategory(category.id);
                        }}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete category"
                        onClick={() => {
                          deleteCategory(category.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </span>
                </li>
                ))
              ) : (
                <li className="text-muted-foreground">No categories available.</li>
              )}
              </ul>
              {/* Add Category Button and Row */}
              
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
