// evals/run-test.js
// Прогон тестового датасета промтов через заглушку ИИ (ESM-версия).
// Читает evals/prompts.json, эмулирует ответ ИИ (задержка 100 мс),
// формирует отчёт evals/report.md в виде Markdown-таблицы.
//
// Запуск:  node evals/run-test.js
// Требования: Node.js v18+ (проверено на v24), внешних зависимостей нет.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// __dirname в ESM нет — восстанавливаем от import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EVALS_DIR = __dirname;
const PROMPTS_PATH = path.join(EVALS_DIR, "prompts.json");
const REPORT_PATH = path.join(EVALS_DIR, "report.md");

const DELAY_MS = 100; // эмуляция задержки ответа ИИ

// -------- Заглушка ИИ -------------------------------------------------
function fakeAiResponse(prompt) {
  if (prompt === null || prompt === undefined || String(prompt).trim() === "") {
    return "[stub] Пустой запрос: пожалуйста, уточните, что нужно сделать.";
  }
  const p = String(prompt);
  const preview = p.length > 120 ? p.slice(0, 120) + "…" : p;
  return `[stub] Ответ-заглушка на запрос: «${preview}»`;
}

// -------- Задержка ----------------------------------------------------
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// -------- Экранирование для Markdown-таблицы --------------------------
function escapeCell(value) {
  const s = value === null || value === undefined ? "" : String(value);
  return s
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
    .trim();
}

// -------- Основной прогон ---------------------------------------------
async function main() {
  if (!fs.existsSync(PROMPTS_PATH)) {
    console.error(`❌ Не найден файл: ${PROMPTS_PATH}`);
    process.exit(1);
  }

  let raw;
  try {
    raw = fs.readFileSync(PROMPTS_PATH, "utf8");
  } catch (e) {
    console.error(`❌ Не удалось прочитать ${PROMPTS_PATH}: ${e.message}`);
    process.exit(1);
  }

  let prompts;
  try {
    prompts = JSON.parse(raw);
  } catch (e) {
    console.error(`❌ prompts.json содержит невалидный JSON: ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(prompts)) {
    console.error("❌ prompts.json должен содержать массив объектов.");
    process.exit(1);
  }

  console.log(`📋 Загружено промтов: ${prompts.length}. Прогон...`);

  const rows = [];
  let passed = 0;

  for (const item of prompts) {
    const id = item.id ?? "—";
    const category = item.category ?? "—";
    const prompt = item.prompt ?? "";
    const isEdge = Boolean(item.is_edge_case);

    await sleep(DELAY_MS);
    const answer = fakeAiResponse(prompt);

    const status = answer && answer.trim() !== "" ? "OK" : "FAIL";
    if (status === "OK") passed++;

    rows.push({ id, category, prompt, answer, status, isEdge });
  }

  const generatedAt = new Date().toISOString();

  const lines = [];
  lines.push("# Отчёт прогона evals");
  lines.push("");
  lines.push(`- Дата генерации: ${generatedAt}`);
  lines.push(`- Всего промтов: ${rows.length}`);
  lines.push(`- Успешно (OK): ${passed}`);
  lines.push(`- Провалено (FAIL): ${rows.length - passed}`);
  lines.push(
    `- Качество: ${rows.length ? ((passed / rows.length) * 100).toFixed(1) : "0.0"}%`
  );
  lines.push("");
  lines.push(
    "> ⚠️ Сейчас используется функция-заглушка (эмуляция ИИ с задержкой 100 мс). " +
      "Статус OK означает, что промт дошёл до обработчика и вернул непустой ответ. " +
      "После подключения реального ИИ проверка будет вестись по полю expected_criteria."
  );
  lines.push("");
  lines.push("| ID | Категория | Вопрос | Ответ | Статус |");
  lines.push("|----|-----------|--------|-------|--------|");

  for (const r of rows) {
    const idCell = escapeCell(r.id) + (r.isEdge ? " (edge)" : "");
    lines.push(
      `| ${idCell} | ${escapeCell(r.category)} | ${escapeCell(r.prompt)} | ${escapeCell(
        r.answer
      )} | ${escapeCell(r.status)} |`
    );
  }

  lines.push("");

  try {
    fs.writeFileSync(REPORT_PATH, lines.join("\n"), "utf8");
  } catch (e) {
    console.error(`❌ Не удалось записать ${REPORT_PATH}: ${e.message}`);
    process.exit(1);
  }

  console.log(`✅ Готово. Отчёт: ${REPORT_PATH}`);
  console.log(`   OK: ${passed}/${rows.length}`);
}

main().catch((e) => {
  console.error("❌ Неожиданная ошибка:", e);
  process.exit(1);
});