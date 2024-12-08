"use client";
import React, { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Plus, X, Check, Timer, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "focus-task-tracker";
const INACTIVE_TASK_LIMIT = 3;

interface Task {
  id: number;
  title: string;
  createdAt: string;
  completedAt?: string;
  focusTime?: number;
  breakTime?: number;
}

interface TaskState {
  active: Task | null;
  inactive: Task[];
  completed: Task[];
}

interface TimerState {
  time: number;
  isRunning: boolean;
  mode: "focus" | "break";
  breakTime: number;
}

function TaskTracker() {
  const [activeTab, setActiveTab] = useState<"focus" | "tasks">("focus");
  const [tasks, setTasks] = useState<TaskState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : { active: null, inactive: [], completed: [] };
  });
  const [timer, setTimer] = useState<TimerState>({
    time: 0,
    isRunning: false,
    mode: "focus",
    breakTime: 0,
  });
  const [newTaskInput, setNewTaskInput] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    let interval: number | undefined;
    if (timer.isRunning) {
      interval = window.setInterval(() => {
        if (timer.mode === "focus") {
          setTimer((prev) => ({ ...prev, time: prev.time + 1 }));
        } else {
          setTimer((prev) => ({ ...prev, breakTime: prev.breakTime + 1 }));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.mode]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartFocus = () => {
    setTimer((prev) => ({ ...prev, isRunning: true, mode: "focus" }));
  };

  const handlePause = () => {
    setTimer((prev) => ({ ...prev, isRunning: false }));
  };

  const handleBreak = () => {
    setTimer((prev) => ({ ...prev, mode: "break", isRunning: true }));
  };

  const handleResume = () => {
    setTimer((prev) => ({ ...prev, mode: "focus", isRunning: true }));
  };

  const handleComplete = () => {
    if (tasks.active) {
      const completedTask: Task = {
        ...tasks.active,
        completedAt: new Date().toISOString(),
        focusTime: timer.time,
        breakTime: timer.breakTime,
      };

      setTasks((prev) => ({
        ...prev,
        active: null,
        completed: [completedTask, ...prev.completed],
      }));

      setTimer({
        time: 0,
        isRunning: false,
        mode: "focus",
        breakTime: 0,
      });
    }
  };

  const handleAddTask = () => {
    if (!newTaskInput.trim()) return;
    if (tasks.inactive.length >= INACTIVE_TASK_LIMIT) return;

    const newTask: Task = {
      id: Date.now(),
      title: newTaskInput,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => ({
      ...prev,
      inactive: [...prev.inactive, newTask],
    }));
    setNewTaskInput("");
  };

  const handleActivateTask = (task: Task) => {
    setTasks((prev) => ({
      ...prev,
      active: task,
      inactive: prev.inactive.filter((t) => t.id !== task.id),
    }));
    setActiveTab("focus");
  };

  const handleRemoveTask = (taskId: number) => {
    setTasks((prev) => ({
      ...prev,
      inactive: prev.inactive.filter((t) => t.id !== taskId),
    }));
  };

  return (
    <Card className="container border-none sm:border max-w-md mx-auto overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[0] sm:rounded-[2rem] p-0">
      <CardHeader className="p-6 text-primary">
        <CardTitle className="text-2xl font-bold">Aktivitas</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "focus" | "tasks")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="focus">Fokus</TabsTrigger>
            <TabsTrigger value="tasks">Tugas</TabsTrigger>
          </TabsList>

          <TabsContent value="focus" className="space-y-4">
            {tasks.active ? (
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">{tasks.active.title}</h3>
                <div className="text-4xl font-mono">
                  {timer.mode === "focus"
                    ? formatTime(timer.time)
                    : formatTime(timer.breakTime)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {timer.mode === "focus" ? "Waktu Fokus" : "Waktu Istirahat"}
                </p>
                <div className="flex justify-center gap-2">
                  {!timer.isRunning && timer.mode === "focus" && (
                    <Button onClick={handleStartFocus}>
                      <Play className="w-4 h-4 mr-2" />
                      Fokus
                    </Button>
                  )}
                  {timer.isRunning && (
                    <Button onClick={handlePause} variant="outline">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {!timer.isRunning && timer.time > 0 && (
                    <Button onClick={handleComplete} variant="destructive">
                      <Check className="w-4 h-4 mr-2" />
                      Selesai
                    </Button>
                  )}
                  {timer.mode === "focus" && timer.time > 0 && (
                    <Button onClick={handleBreak} variant="secondary">
                      <Coffee className="w-4 h-4 mr-2" />
                      Istirahat
                    </Button>
                  )}
                  {timer.mode === "break" && (
                    <Button onClick={handleResume} variant="secondary">
                      <Timer className="w-4 h-4 mr-2" />
                      Lanjut Fokus
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Alert>
                <AlertTitle>Tidak Ada Tugas Aktif</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Pergi ke tab Tugas untuk mengaktifkan tugas
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex gap-2 pt-2">
              <Input
                placeholder="Tambah tugas baru..."
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
              />
              <Button
                onClick={handleAddTask}
                disabled={tasks.inactive.length >= INACTIVE_TASK_LIMIT}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah
              </Button>
            </div>

            {tasks.inactive.length >= INACTIVE_TASK_LIMIT && (
              <Alert className="bg-destructive/15">
                <AlertTitle>Batas Tugas Tercapai</AlertTitle>
                <AlertDescription>
                  Selesaikan beberapa tugas sebelum menambahkan yang baru
                </AlertDescription>
              </Alert>
            )}

            {tasks.inactive.length === 0 && tasks.completed.length === 0 && (
              <Alert className="bg-success/15">
                <AlertTitle>Tidak Ada Tugas Aktif</AlertTitle>
                <AlertDescription>
                  Masukkan tugas baru atau ketikkan "Enter" untuk menambahkan
                  tugas
                </AlertDescription>
              </Alert>
            )}

            {tasks.inactive.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Tugas Tertunda</h3>
                {tasks.inactive.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <span>{task.title}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleActivateTask(task)}
                          variant="outline"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveTask(task.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {tasks.completed.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Tugas Selesai</h3>
                {tasks.completed
                  .filter((_, i) => i < 5) // limit 5
                  .map((task) => (
                    <Card key={task.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span
                              className="font-medium truncate flex-1 mr-2"
                              title={task.title}
                            >
                              {task.title}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(task.completedAt!).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>
                              Dibuat:{" "}
                              {new Date(task.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                            <span>
                              Fokus: {formatTime(task.focusTime ?? 0)} |
                              Istirahat: {formatTime(task.breakTime ?? 0)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default TaskTracker;
