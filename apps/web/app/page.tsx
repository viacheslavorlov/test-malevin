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
      <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Журнал работ</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.username}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Выйти
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap items-end gap-3 mb-6 p-4 rounded-lg border bg-card">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Дата с</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Дата по</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Сортировка</label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Сначала новые</SelectItem>
                <SelectItem value="asc">Сначала старые</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={loadEntries}
          >
            Применить
          </Button>
          <Button className="h-9 ml-auto" onClick={() => { setEditing(null); setShowForm(true); }}>
            + Добавить запись
          </Button>
        </div>

        <div className="rounded-lg border">
          <WorkLogTable entries={entries} onEdit={handleEdit} onDelete={(id) => setDeleting(id)} />
        </div>

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
