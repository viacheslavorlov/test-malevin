"use client";

import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "./lib/protected-route";
import { useAuth } from "./lib/auth-context";
import { api, type WorkEntry } from "./lib/api";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { WorkLogTable } from "./components/work-log-table";
import { WorkLogForm } from "./components/work-log-form";
import {
  ClipboardListIcon,
  PlusIcon,
  LogOutIcon,
  SearchIcon,
  ArrowUpDownIcon,
  FilterXIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const { user, logout } = useAuth();
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState("desc");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<WorkEntry | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadEntries = useCallback(async () => {
    const res = await api().workEntries.list({
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sort,
    });
    setEntries(res.entries);
  }, [dateFrom, dateTo, sort]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  function clearFilters() {
    setDateFrom("");
    setDateTo("");
    setSort("desc");
  }

  const hasFilters = dateFrom || dateTo;

  async function handleDelete(id: number) {
    try {
      await api().workEntries.delete(id);
      toast.success("Запись удалена");
      loadEntries();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ошибка удаления";
      toast.error(message);
    }
    setDeleting(null);
  }

  function handleEdit(entry: WorkEntry) {
    setEditing(entry);
    setShowForm(true);
  }

  function handleFormSaved() {
    setShowForm(false);
    setEditing(null);
    loadEntries();
    toast.success(editing ? "Запись обновлена" : "Запись добавлена");
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <ClipboardListIcon className="size-4" />
              </div>
              <h1 className="font-bold text-base">Журнал работ</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.username}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOutIcon className="size-4" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-wrap items-end gap-3 mb-6 p-3 rounded-xl border bg-card">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Дата с
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 w-[150px]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Дата по
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 w-[150px]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                <ArrowUpDownIcon className="size-3 inline mr-1" />
                Сортировка
              </label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-9 w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Сначала новые</SelectItem>
                  <SelectItem value="asc">Сначала старые</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-end pb-[1px]">
              <Button
                variant="default"
                size="sm"
                className="h-9"
                onClick={loadEntries}
              >
                <SearchIcon className="size-4" />
                Поиск
              </Button>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9"
                  onClick={clearFilters}
                >
                  <FilterXIcon className="size-4" />
                </Button>
              )}
              <Button
                className="h-9 ml-2"
                size="sm"
                onClick={() => { setEditing(null); setShowForm(true); }}
              >
                <PlusIcon className="size-4" />
                Добавить запись
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-card overflow-hidden">
            <WorkLogTable entries={entries} onEdit={handleEdit} onDelete={(id) => setDeleting(id)} />
          </div>
        </main>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Редактировать запись" : "Новая запись"}</DialogTitle>
            </DialogHeader>
            <WorkLogForm
              entry={editing}
              onSaved={handleFormSaved}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={!!deleting} onOpenChange={(open) => { if (!open) setDeleting(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Удалить запись?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground mb-4">
              Это действие нельзя отменить.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleting(null)}>
                Отмена
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleting && handleDelete(deleting)}
              >
                Удалить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
