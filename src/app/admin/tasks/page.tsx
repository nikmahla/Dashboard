"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  Circle,
  Loader2,
  AlertCircle,
  Search,
  X,
} from "lucide-react";

import Tooltip from "@/components/Tooltip";
import { useToast } from "@/components/ToastContext";
import { useApiError } from "@/hooks/useApiError";
import  useDebounce  from "@/hooks/useDebounce"; 
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  Task,
  Priority,
} from "@/hooks/useTasks";



export default function TasksPage() {
  const { notify } = useToast();
  const onApiError = useApiError();

  // React Query
  const tasksQuery = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const tasks = tasksQuery.data ?? [];
  const loading = tasksQuery.isLoading;

  // UI state
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [prioritySort, setPrioritySort] = useState<"none" | "asc" | "desc">("none");

 
  const debouncedSearch = (typeof useDebounce === "function")
    ? useDebounce(search, 250)
    : search;

  // -----------------------------
  // CREATE TASK
  // -----------------------------
  const addTask = async () => {
    const title = input.trim();
    if (!title) return;

    try {
      await createTask.mutateAsync({ title, priority: "medium" });
      notify({ type: "success", message: "Task added" });
      setInput("");
    } catch (err) {
      onApiError(err, "Failed to add task");
    }
  };

  // -----------------------------
  // UPDATE TASK
  // -----------------------------
  const updateTaskFn = async (patch: Partial<Task> & { id: number }) => {
    try {
      await updateTask.mutateAsync(patch);
      notify({ type: "success", message: "Task updated" });
    } catch (err) {
      onApiError(err, "Failed to update task");
    }
  };

  const toggleTask = (task: Task) => {
    updateTaskFn({ id: task.id, completed: !task.completed });
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditingValue(task.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const saveEdit = (id: number) => {
    const v = editingValue.trim();
    if (!v) {
      cancelEdit();
      return;
    }
    updateTaskFn({ id, title: v });
    cancelEdit();
  };

  const changePriority = (task: Task, priority: Priority) => {
    updateTaskFn({ id: task.id, priority });
  };

  // -----------------------------
  // DELETE TASK
  // -----------------------------
  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask.mutateAsync(taskToDelete.id);
      notify({ type: "success", message: "Task deleted" });
    } catch (err) {
      onApiError(err, "Failed to delete task");
    }

    setTaskToDelete(null);
  };

  // -----------------------------
  // FILTER + SEARCH + SORT
  // -----------------------------
  const sorted = useMemo(() => {
    const filtered = tasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(String(debouncedSearch).toLowerCase());
      const matchesPriority = priorityFilter === "all" ? true : t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });

    const order = { high: 3, medium: 2, low: 1 };

    return [...filtered].sort((a, b) => {
      if (prioritySort === "none") return 0;
      return prioritySort === "asc"
        ? order[a.priority] - order[b.priority]
        : order[b.priority] - order[a.priority];
    });
  }, [tasks, debouncedSearch, priorityFilter, prioritySort]);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  // -----------------------------
  // UI
  // -----------------------------
  return (
<div className="w-full space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold">Tasks</h2>

      {/* Search */}
      <div className="flex items-center gap-2 bg-[color:var(--card-bg)] border border-[color:var(--glass-border)] rounded-xl px-3 py-2">
        <Search size={16} className="text-[color:var(--muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="flex-1 bg-transparent outline-none text-sm text-[color:var(--foreground)]"
        />
      </div>

      {/* Add Task */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          placeholder="New task..."
          className="
            flex-1 px-4 py-2 rounded-xl
            bg-[color:var(--card-bg)]
            border border-[color:var(--glass-border)]
            text-[color:var(--foreground)]
            outline-none shadow-sm
          "
        />
        <button
          onClick={addTask}
          className="rounded-xl btn-primary px-4 text-white shadow-md disabled:opacity-60"
          title="Add"
          aria-label="Add"
          disabled={createTask.isPending}
        >
          {createTask.isPending ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as "all" | Priority)}
          className="
            bg-[color:var(--card-bg)]
            border border-[color:var(--glass-border)]
            rounded-xl px-3 py-2 text-sm
            text-[color:var(--foreground)]
          "
        >
          <option value="all">All priorities</option>
          <option value="high">High only</option>
          <option value="medium">Medium only</option>
          <option value="low">Low only</option>
        </select>

        <select
          value={prioritySort}
          onChange={(e) => setPrioritySort(e.target.value as "none" | "asc" | "desc")}
          className="
            bg-[color:var(--card-bg)]
            border border-[color:var(--glass-border)]
            rounded-xl px-3 py-2 text-sm
            text-[color:var(--foreground)]
          "
        >
          <option value="none">No sort</option>
          <option value="desc">High → Low</option>
          <option value="asc">Low → High</option>
        </select>
      </div>

      {/* Task List */}
      <div className="glass-soft rounded-2xl overflow-hidden shadow-lg divide-y divide-white/10">
        {loading ? (
          <div className="p-12 text-center text-[color:var(--muted)]">
            <Loader2 className="animate-spin mx-auto mb-2" />
            Loading...
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-10 text-center text-[color:var(--muted)]">No tasks found.</div>
        ) : (
          sorted.map((task) => {
            const isEditing = editingId === task.id;
            const isMutating = updateTask.isPending || deleteTask.isPending;

            return (
              <div
                key={task.id}
                className={`
                  grid grid-cols-1 sm:grid-cols-[1fr_auto]
                  gap-4 sm:gap-2
                  px-4 py-4 transition-colors duration-200
                  hover:bg-white/5 
                  ${isEditing ? "bg-white/5 animate-in fade-in duration-150" : ""}
                `}
              >
                {/* Left */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task)}
                    disabled={isMutating}
                    className={`
                      mt-0.5 transition-all
                      ${task.completed ? "text-[color:var(--primary)] scale-110" : "text-[color:var(--muted)]"}
                      disabled:opacity-60
                    `}
                    title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.completed ? <Check size={22} /> : <Circle size={22} />}
                  </button>

                  <div className="flex flex-col flex-1 gap-1">
                    {/* Title */}
                    <div className="min-h-[34px] flex items-center">
                      {isEditing ? (
                        <input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(task.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          autoFocus
                          className="
                            w-full text-sm font-medium
                            bg-transparent
                            text-[color:var(--foreground)]
                            outline-none focus:outline-none focus:ring-0
                            focus:bg-slate-100 dark:focus:bg-white/10
                            px-0 py-0
                          "
                        />
                      ) : (
                        <span
                          className={`
                            text-sm font-medium
                            ${task.completed ? "line-through text-[color:var(--muted)]" : "text-[color:var(--foreground)]"}
                          `}
                        >
                          {task.title}
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <span className="text-xs text-[color:var(--muted)]">
                      Created: {formatDate(task.createdAt)} • Updated: {formatDate(task.updatedAt)}
                    </span>

                    {/* Priority */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                      <span
                        className={`
                          text-xs px-2 py-0.5 rounded-full w-fit
                          ${task.priority === "high"
                            ? "bg-red-500/20 text-red-400"
                            : task.priority === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"}
                        `}
                      >
                        {task.priority.toUpperCase()}
                      </span>

                      <select
                        value={task.priority}
                        onChange={(e) => changePriority(task, e.target.value as Priority)}
                        disabled={isMutating}
                        className="
                          text-xs bg-transparent border border-[color:var(--glass-border)]
                          rounded-lg px-2 py-0.5 text-[color:var(--foreground)]
                          disabled:opacity-60
                        "
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    {isEditing && (
                      <span className="text-xs text-[color:var(--muted)] mt-1">
                        Press <span className="font-semibold">Enter</span> to save •{" "}
                        <span className="font-semibold">Esc</span> to cancel
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 justify-end">
                  {isEditing ? (
                    <>
                      <Tooltip label="Save" side="top">
                        <button
                          onClick={() => saveEdit(task.id)}
                          disabled={isMutating}
                          className="
                            h-9 w-9 inline-flex items-center justify-center rounded-lg
                            hover:bg-black/5 dark:hover:bg-white/10 transition
                            text-[color:var(--teal)]
                            disabled:opacity-60
                          "
                          aria-label="Save"
                          title="Save"
                        >
                          <Check size={18} />
                        </button>
                      </Tooltip>

                      <Tooltip label="Cancel" side="top">
                        <button
                          onClick={cancelEdit}
                          className="
                            h-9 w-9 inline-flex items-center justify-center rounded-lg
                            hover:bg-black/5 dark:hover:bg-white/10 transition
                            text-[color:var(--muted)]
                          "
                          aria-label="Cancel"
                          title="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip label="Edit" side="top">
                      <button
                        onClick={() => startEdit(task)}
                        disabled={isMutating}
                        className="
                          h-9 w-9 inline-flex items-center justify-center rounded-lg
                          hover:bg-black/5 dark:hover:bg-white/10 transition
                          text-[color:var(--muted)] hover:text-[color:var(--primary)]
                          disabled:opacity-60
                        "
                        aria-label="Edit"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                    </Tooltip>
                  )}

                  <Tooltip label="Delete" side="top">
                    <button
                      onClick={() => setTaskToDelete(task)}
                      disabled={isMutating}
                      className="
                        h-9 w-9 inline-flex items-center justify-center rounded-lg
                        hover:bg-black/5 dark:hover:bg-white/10 transition
                        text-[color:var(--muted)] hover:text-[color:var(--danger)]
                        disabled:opacity-60
                      "
                      aria-label="Delete"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setTaskToDelete(null)}
          />

          <div
            className="
              relative w-full max-w-sm p-6 rounded-2xl
              bg-[color:var(--card-bg)]
              border border-[color:var(--glass-border)]
              shadow-2xl
              animate-in zoom-in-95 slide-in-from-bottom-4 duration-300
            "
          >
            <div className="flex items-center gap-3 text-[color:var(--danger)] mb-4">
              <div className="p-2 bg-[var(--danger)]/10 rounded-full">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-[color:var(--foreground)]">Delete Task?</h3>
            </div>

            <p className="text-sm text-[color:var(--muted)] mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[color:var(--foreground)]">
                “{taskToDelete.title}”
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setTaskToDelete(null)}
                className="
                  flex-1 px-4 py-2 text-sm font-medium
                  text-[color:var(--foreground)] bg-transparent rounded-xl
                  border border-[color:var(--glass-border)]
                  hover:bg-black/5 dark:hover:bg-white/10 transition
                "
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleteTask.isPending}
                className="
                  flex-1 px-4 py-2 text-sm font-medium text-white rounded-xl
                  shadow-lg hover:opacity-95 transition disabled:opacity-60
                "
                style={{ background: "var(--danger)" }}
              >
                {deleteTask.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}