"use client";

import { useEffect, useState } from "react";
import SignForm from "@/components/sign";
import type { Task, Category } from "@/lib/types";
import { TaskForm } from "@/components/task-form";
import { TaskList } from "@/components/task-list";
import { Navbar } from "@/components/navbar";
import { set } from "date-fns";


export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const handleAddTask = (task: any) => {
    
    const category = categories.find((cat) => String(cat.id) === String(task.category));
    if (!category) {
      return;
    }

    const newTask = {
      text: task.description,
      end_date: task.dueDate,
      id_category: category.id,
    };

    

    const createTask = async () => {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(newTask),
        });
        const data = await response.json();

        if (!response.ok) {
                throw new Error(data.error);
            }

        console.log("Task created:", data);
        setTasks((prevTasks) => [...prevTasks, data.task]);
      } catch (error) {
        alert(error ? error : "An error occurred during task creation.");
      }
    };

    createTask();
  };

  const ac = new AbortController();

  const fetchTasks = async () => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/tasks/user', {
        method: 'GET',
        headers,
        // Include this if your auth/session uses cookies (safe even if you don't)
        credentials: 'include',
        signal: ac.signal,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setTasks(data);
    } catch (error) {
      alert(error ? error : "An error occurred during task fetching.");
      setTasks([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/categories/user', {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      console.log("Fetched categories:", data);
      setCategories(data);
    } catch (error) {
      alert(error ? error : "An error occurred during sign in.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchCategories();
    }
    return () => {
      ac.abort();
    };
  }, [token]);

const onUpdate = async (id: string, updatedTask: Task) => {
  console.log("Updating task:", id, updatedTask);
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers,
      credentials: 'include',
      body: JSON.stringify(updatedTask),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }

    console.log("Task updated:", data);
    setTasks((prevTasks) =>
      prevTasks.map((task) => (String(task.id) === String(id) ? data.task : task))
    );
  } catch (error) {
    alert(error ? error : "An error occurred during task update.");
  }
};

const onDelete = async (id: string) => {
      try {
  
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
          };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
  
        const response = await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
          headers,
          credentials: 'include',
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error);
        }
      } catch (error) {
        alert(error ? error : "An error occurred during task deletion.");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => String(task.id) !== id));
    };

  const addCategory = async (e: React.FormEvent, newCategoryName: string, newCategoryDescription: string) => {
    try {
      e.preventDefault();
      const newCategory = {
        name: newCategoryName,
        description: newCategoryDescription,
      };

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch("/api/categories", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      // After adding, fetch updated categories from backend
      const updatedResponse = await fetch("/api/categories/user", {
        method: "GET",
        headers,
        credentials: "include",
      });
      if (!updatedResponse.ok) {
        const data = await updatedResponse.json();
        throw new Error(data.error);
      }
      const updatedCategories = await updatedResponse.json();
      setCategories(updatedCategories);
    } catch (error) {
      alert(error ? error : "An error occurred during category addition.");
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );

      setTasks((prevTasks) =>
        prevTasks.filter((task) => String(task.id_category) !== String(id))
      );
    } catch (error) {
      alert(error ? error : "An error occurred during category deletion.");
    }
  };

  const updateCategory = async (id: number, newName: string, newDescription: string) => {
    try {
      const updatedCategory = {
        name: newName,
        description: newDescription,
      };

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const updatedResponse = await fetch("/api/categories/user", {
        method: "GET",
        headers,
        credentials: "include",
      });
      if (!updatedResponse.ok) {
        const data = await updatedResponse.json();
        throw new Error(data.error);
      }
      const updatedCategories = await updatedResponse.json();
      setCategories(updatedCategories);
    } catch (error) {
      alert(error ? error : "An error occurred during category update.");
    }
  }

  if (!token) {
    return <SignForm token={token} setToken={setToken} setUser={setUser}/>;
  }
  return (
    <div className="min-h-screen w-full bg-background font-body">
      <Navbar user={user} setToken={setToken} />
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <aside className="lg:col-span-1">
            <div className="rounded-xl border bg-card p-6 shadow-md" >
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Add New Task</h2>
              <TaskForm addTask={handleAddTask} categories={categories ?? []} addCategory={addCategory} deleteCategory={deleteCategory} updateCategory={updateCategory} />
            </div>
          </aside>
          <div className="lg:col-span-2">
            <TaskList tasks={tasks} categories={categories} onDelete={onDelete} onUpdate={onUpdate} />
          </div>
        </div>
      </main>
    </div>
  );
}
