/**
 * 从每题选项的「基础 8 维」分数推导 16 个扩展角色分数，并写回 questions.json。
 * 扩展分 capped 为 2，避免在「极端偏向某一基础角色」时反超该角色总分。
 * 运行：node scripts/derive-24-scores.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const questionsPath = path.join(root, "src", "data", "questions.json");

const BASE_IDS = [
  "tangseng",
  "wukong",
  "bajie",
  "shaseng",
  "bailongma",
  "guanyin",
  "erlang",
  "nezha",
];

/** @type {Record<string, [string, string]>} */
const EXTRA_PARENTS = {
  yudi: ["erlang", "guanyin"],
  rulai: ["tangseng", "guanyin"],
  puti: ["wukong", "guanyin"],
  taishang: ["erlang", "guanyin"],
  zhenyuanzi: ["tangseng", "shaseng"],
  niuwang: ["wukong", "nezha"],
  tieshan: ["bajie", "guanyin"],
  honghaier: ["nezha", "wukong"],
  baigujing: ["nezha", "bajie"],
  liuer: ["wukong", "nezha"],
  huangmei: ["erlang", "tangseng"],
  kuimulang: ["bailongma", "erlang"],
  milefo: ["bajie", "guanyin"],
  wenshu: ["tangseng", "guanyin"],
  puxian: ["shaseng", "guanyin"],
  dapeng: ["wukong", "erlang"],
};

function deriveExtra(s, a, b) {
  const sa = s[a] ?? 0;
  const sb = s[b] ?? 0;
  let v = Math.min(2, Math.round((sa + sb) / 2));
  if (v === 0 && (sa >= 2 || sb >= 2)) v = 1;
  return v;
}

const raw = fs.readFileSync(questionsPath, "utf8");
const questions = JSON.parse(raw);

for (const q of questions) {
  for (const opt of q.options) {
    const base = {};
    for (const id of BASE_IDS) {
      base[id] = opt.scores[id] ?? 0;
    }
    const s = { ...base };
    for (const [id, [p1, p2]] of Object.entries(EXTRA_PARENTS)) {
      s[id] = deriveExtra(s, p1, p2);
    }
    opt.scores = s;
  }
}

fs.writeFileSync(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, "utf8");
console.log("updated", questionsPath);
