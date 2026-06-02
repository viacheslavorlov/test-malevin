import { db } from "./index";
import { workTypes } from "./schema";

const defaultTypes = [
  "Кладка перегородок",
  "Монтаж опалубки",
  "Бетонирование",
  "Армирование",
  "Штукатурные работы",
  "Малярные работы",
  "Кровельные работы",
  "Электромонтаж",
  "Сантехнические работы",
  "Укладка плитки",
  "Монтаж гипсокартона",
  "Сварочные работы",
  "Земляные работы",
  "Отделочные работы",
  "Фасадные работы",
];

export async function seedWorkTypes() {
  const existing = await db.select().from(workTypes).limit(1);
  if (existing.length > 0) return;

  await db.insert(workTypes).values(defaultTypes.map((name) => ({ name })));
  console.log("Seeded work types");
}
