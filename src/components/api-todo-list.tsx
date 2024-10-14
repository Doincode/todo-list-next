import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit2, Loader2 } from "lucide-react";
import { useToast } from "./ToastProvider";

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

const API_URL = "https://todo-list-api-2hsk.onrender.com/tasks";

export function ApiTodoList() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);


  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: newTask}),
        });
        if (!response.ok) throw new Error("Failed to add task");
        const addedTask = await response.json();
        setTasks([...tasks, addedTask]);
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
        toast({
          title: "Error",
          description: "Failed to add task. Please try again."
        });
      }
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const taskToToggle = tasks.find((task) => task.id === id);
      const completeTask = taskToToggle?.completed ? "uncomplete" : "complete";
      if (!taskToToggle) return;

      const response = await fetch(`${API_URL}/${id}/${completeTask}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error("Failed to update task");

      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error("Error toggling task:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again."
      });
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again."
      });
    }
  };

  const startEditing = (id: number, description: string) => {
    setEditingTask(id);
    setEditedDescription(description);
  };

  const saveEdit = async () => {
    if (editingTask !== null) {
      try {
        const response = await fetch(`${API_URL}/${editingTask}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: editedDescription }),
        });
        if (!response.ok) throw new Error("Failed to update task");

        setTasks(
          tasks.map((task) =>
            task.id === editingTask
              ? { ...task, description: editedDescription }
              : task
          )
        );
        setEditingTask(null);
      } catch (error) {
        console.error("Error updating task:", error);
        toast({
          title: "Error",
          description: "Failed to update task. Please try again."
        });
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto bg-gray-100 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Todo List</h1>
        
        {/* Task Input */}
        <div className="mb-4">
          <Label htmlFor="new-task" className="sr-only">New Task</Label>
          <div className="flex">
            <Input
              id="new-task"
              type="text"
              placeholder="Add a new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-grow mr-2 bg-white border-gray-300 text-black placeholder-gray-400"
            />
            <Button onClick={addTask} className="bg-blue-600 hover:bg-blue-700 text-white">Add</Button>
          </div>
        </div>

        {/* Filter Options */}
        <div className="mb-4">
          {/* Desktop View */}
          <div className="hidden sm:flex justify-center space-x-2">
            <Button
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "default" : "outline"}
            className={`bg-blue-600 text-white hover:bg-blue-700 transition transform ${
                filter === "all" ? "border-2 border-blue-900 scale-105" : "border-transparent"
              }`}
            >
              All
            </Button>
            <Button
              onClick={() => setFilter("completed")}
              variant={filter === "completed" ? "default" : "outline"}
            className={`bg-blue-600 text-white hover:bg-blue-700 transition transform ${
                filter === "completed" ? "border-2 border-blue-900 scale-105" : "border-transparent"
              }`}
            >
              Completed
            </Button>
            <Button
              onClick={() => setFilter("pending")}
              variant={filter === "pending" ? "default" : "outline"}
            className={`bg-blue-600 text-white hover:bg-blue-700 transition transform ${
                filter === "pending" ? "border-2 border-blue-900 scale-105" : "border-transparent"
              }`}
            >
              Pending
            </Button>
          </div>
          
          {/* Mobile View */}
          <div className="sm:hidden">
            <Select onValueChange={setFilter} value={filter}>
              <SelectTrigger className="w-full bg-white border-gray-300 text-black">
                <SelectValue placeholder="Filter tasks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredTasks.map((task) => (
              <li key={task.id} className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mr-2 border-gray-400"
                />
                {editingTask === task.id ? (
                  <Input
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="flex-grow mr-2 bg-white border-gray-300 text-black"
                  />
                ) : (
                  <Label
                    htmlFor={`task-${task.id}`}
                    className={`flex-grow ${task.completed ? 'line-through text-gray-500' : 'text-black'}`}
                  >
                    {task.description}
                  </Label>
                )}
                <div className="flex space-x-2">
                  {editingTask === task.id ? (
                    <Button
                      onClick={saveEdit}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      onClick={() => startEditing(task.id, task.description)}
                      size="icon"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteTask(task.id)}
                    size="icon"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}