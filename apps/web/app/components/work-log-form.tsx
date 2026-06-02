"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { api, type WorkEntry, type WorkType } from "../lib/api";

interface Props {
  entry?: WorkEntry | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function WorkLogForm({ entry, onSaved, onCancel }: Props) {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [date, setDate] = useState(entry?.date ?? "");
  const [workTypeId, setWorkTypeId] = useState(String(entry?.workTypeId ?? ""));
  const [volume, setVolume] = useState(String(entry?.volume ?? ""));
  const [unit, setUnit] = useState(entry?.unit ?? "");
  const [executorName, setExecutorName] = useState(entry?.executorName ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api().workTypes.list().then((res) => setWorkTypes(res.workTypes));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        date,
        workTypeId: Number(workTypeId),
        volume: Number(volume),
        unit,
        executorName,
      };

      if (entry) {
        await api().workEntries.update(entry.id, data);
      } else {
        await api().workEntries.create(data);
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Дата выполнения</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="workType">Вид работ</Label>
        <Select value={workTypeId} onValueChange={setWorkTypeId} required>
          <SelectTrigger>
            <SelectValue placeholder="Выберите вид работ" />
          </SelectTrigger>
          <SelectContent>
            {workTypes.map((wt) => (
              <SelectItem key={wt.id} value={String(wt.id)}>
                {wt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="volume">Объём</Label>
          <Input
            id="volume"
            type="number"
            step="any"
            min="0"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Ед. изм.</Label>
          <Input
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="м³, м², шт..."
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="executorName">ФИО исполнителя</Label>
        <Input
          id="executorName"
          value={executorName}
          onChange={(e) => setExecutorName(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Сохранение..." : entry ? "Сохранить" : "Добавить"}
        </Button>
      </div>
    </form>
  );
}
