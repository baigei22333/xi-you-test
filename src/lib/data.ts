import charactersJson from "@/data/characters.json";
import questionsJson from "@/data/questions.json";
import {
  charactersFileSchema,
  questionsFileSchema,
  type CharacterId,
} from "@/lib/schema";

export const QUESTIONS = questionsFileSchema.parse(questionsJson);
export const CHARACTERS = charactersFileSchema.parse(charactersJson);

export const CHARACTER_IDS: CharacterId[] = [
  "tangseng",
  "wukong",
  "bajie",
  "shaseng",
  "bailongma",
  "guanyin",
  "erlang",
  "nezha",
];

const characterMap = new Map(CHARACTERS.map((c) => [c.id, c]));

export function getCharacterById(id: CharacterId) {
  return characterMap.get(id);
}

export function getQuestionById(id: string) {
  return QUESTIONS.find((q) => q.id === id);
}
