import { z } from "zod";

export const characterIdSchema = z.enum([
  "tangseng",
  "wukong",
  "bajie",
  "shaseng",
  "bailongma",
  "guanyin",
  "erlang",
  "nezha",
  "yudi",
  "rulai",
  "puti",
  "taishang",
  "zhenyuanzi",
  "niuwang",
  "tieshan",
  "honghaier",
  "baigujing",
  "liuer",
  "huangmei",
  "kuimulang",
  "milefo",
  "wenshu",
  "puxian",
  "dapeng",
]);

export type CharacterId = z.infer<typeof characterIdSchema>;

const scoresRecordSchema = z.record(characterIdSchema, z.number().int().min(0));

export const optionSchema = z.object({
  id: z.string(),
  label: z.string(),
  scores: scoresRecordSchema,
});

export const questionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  options: z.array(optionSchema).length(4),
});

export const traitSchema = z.object({
  word: z.string(),
  explanation: z.string(),
});

export const characterSchema = z.object({
  id: characterIdSchema,
  name: z.string(),
  subtitle: z.string(),
  heroImage: z.string(),
  summary: z.string(),
  traits: z.array(traitSchema).min(3),
});

export const questionsFileSchema = z.array(questionSchema).length(24);
export const charactersFileSchema = z.array(characterSchema).length(24);
