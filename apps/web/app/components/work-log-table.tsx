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
import { type WorkEntry } from "../lib/api";

interface Props {
  entries: WorkEntry[];
  onEdit: (entry: WorkEntry) => void;
  onDelete: (id: number) => void;
}

export function WorkLogTable({ entries, onEdit, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Нет записей. Добавьте первую запись.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Дата</TableHead>
          <TableHead>Вид работ</TableHead>
          <TableHead>Объём</TableHead>
          <TableHead>Исполнитель</TableHead>
          <TableHead className="w-[100px]">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{entry.date}</TableCell>
            <TableCell>{entry.workTypeName}</TableCell>
            <TableCell>
              {entry.volume} {entry.unit}
            </TableCell>
            <TableCell>{entry.executorName}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => onEdit(entry)}>
                  ✎
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(entry.id)}
                >
                  ✕
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
