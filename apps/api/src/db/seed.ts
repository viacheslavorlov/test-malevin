import { db } from "./index";
import { workTypes } from "./schema";

const defaultTypes: { name: string; defaultUnit: string }[] = [
  { name: "Кладка перегородок", defaultUnit: "м²" },
  { name: "Монтаж опалубки", defaultUnit: "м²" },
  { name: "Бетонирование", defaultUnit: "м³" },
  { name: "Армирование", defaultUnit: "шт" },
  { name: "Штукатурные работы", defaultUnit: "м²" },
  { name: "Малярные работы", defaultUnit: "м²" },
  { name: "Кровельные работы", defaultUnit: "м²" },
  { name: "Электромонтаж", defaultUnit: "шт" },
  { name: "Сантехнические работы", defaultUnit: "шт" },
  { name: "Укладка плитки", defaultUnit: "м²" },
  { name: "Монтаж гипсокартона", defaultUnit: "м²" },
  { name: "Сварочные работы", defaultUnit: "м" },
  { name: "Земляные работы", defaultUnit: "м³" },
  { name: "Отделочные работы", defaultUnit: "м²" },
  { name: "Фасадные работы", defaultUnit: "м²" },
];

export async function seedWorkTypes() {
  const existing = await db.select().from(workTypes).limit(1);
  if (existing.length > 0) return;

  await db.insert(workTypes).values(
    defaultTypes.map(({ name, defaultUnit }) => ({ name, defaultUnit }))
  );
  console.log("Seeded work types");
}
