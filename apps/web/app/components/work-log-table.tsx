"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { PencilIcon, Trash2Icon, ClipboardListIcon } from "lucide-react";
import { type WorkEntry } from "../lib/api";

interface Props {
  entries: WorkEntry[];
  onEdit: (entry: WorkEntry) => void;
  onDelete: (id: number) => void;
}

export function WorkLogTable({ entries, onEdit, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <ClipboardListIcon className="size-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground mb-1">Нет записей</p>
        <p className="text-sm text-muted-foreground">
          Нажмите «+ Добавить запись», чтобы внести первую запись в журнал.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Дата</TableHead>
            <TableHead>Вид работ</TableHead>
            <TableHead className="w-[120px]">Объём</TableHead>
            <TableHead>Исполнитель</TableHead>
            <TableHead className="w-[90px] text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, i) => (
            <TableRow
              key={entry.id}
              className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}
            >
              <TableCell className="font-medium">{entry.date}</TableCell>
              <TableCell>{entry.workTypeName}</TableCell>
              <TableCell>
                {entry.volume} {entry.unit}
              </TableCell>
              <TableCell>{entry.executorName}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(entry)}
                    title="Редактировать"
                  >
                    <PencilIcon className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(entry.id)}
                    title="Удалить"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2Icon className="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
