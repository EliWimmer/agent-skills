#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(REPO_ROOT, "skills");
const MANIFEST_PATH = path.join(REPO_ROOT, "manifest.json");

const DESTINATION_DIRS = [
  ".agents/skills",
  ".cursor/skills",
  ".claude/skills",
  ".gemini/skills",
];

const FORBIDDEN_DEST = ".cursor/skills-cursor";

const NAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

function destinationPaths(home = os.homedir()) {
  return DESTINATION_DIRS.map((dir) => path.join(home, dir));
}

function fail(message) {
  const err = new Error(message);
  err.isCliError = true;
  throw err;
}

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function hasSkillMd(dir) {
  return pathExists(path.join(dir, "SKILL.md"));
}

async function childDirsWithSkillMd(parentDir) {
  const entries = await fs.readdir(parentDir, { withFileTypes: true });
  const matches = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const childPath = path.join(parentDir, entry.name);
    if (await hasSkillMd(childPath)) matches.push(entry.name);
  }
  return matches;
}

/**
 * @returns {Promise<Array<{ name: string, sourcePath: string, category: string | null }>>}
 */
export async function discoverSkills() {
  if (!(await pathExists(SKILLS_DIR))) {
    fail(`Missing skills directory: ${SKILLS_DIR}`);
  }

  const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  const skills = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      fail(`Invalid entry in skills/: ${entry.name} (expected a directory)`);
    }

    const entryPath = path.join(SKILLS_DIR, entry.name);

    if (await hasSkillMd(entryPath)) {
      const nested = await childDirsWithSkillMd(entryPath);
      if (nested.length > 0) {
        fail(
          `Invalid layout: skills/${entry.name}/ contains SKILL.md and nested skill folders (${nested.join(", ")})`,
        );
      }
      skills.push({ name: entry.name, sourcePath: entryPath, category: null });
      continue;
    }

    const children = await fs.readdir(entryPath, { withFileTypes: true });
    let foundSkill = false;

    for (const child of children) {
      if (!child.isDirectory()) continue;
      const childPath = path.join(entryPath, child.name);

      if (!(await hasSkillMd(childPath))) {
        if (await childDirsWithSkillMd(childPath).then((n) => n.length > 0)) {
          fail(
            `Invalid depth: skills/${entry.name}/${child.name}/ — only skills/<skill>/ or skills/<category>/<skill>/ are allowed`,
          );
        }
        continue;
      }

      foundSkill = true;
      const deeper = await childDirsWithSkillMd(childPath);
      if (deeper.length > 0) {
        fail(
          `Invalid depth: skills/${entry.name}/${child.name}/ contains nested skills (${deeper.join(", ")})`,
        );
      }

      skills.push({
        name: child.name,
        sourcePath: childPath,
        category: entry.name,
      });
    }

    if (!foundSkill) {
      fail(`Category folder skills/${entry.name}/ has no skill subdirectories with SKILL.md`);
    }
  }

  const seen = new Map();
  for (const skill of skills) {
    const rel = skill.category
      ? `skills/${skill.category}/${skill.name}`
      : `skills/${skill.name}`;
    if (seen.has(skill.name)) {
      fail(`Duplicate skill folder name "${skill.name}": ${seen.get(skill.name)} and ${rel}`);
    }
    seen.set(skill.name, rel);
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

function parseFrontmatter(content, skillLabel) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    fail(`${skillLabel}: missing YAML frontmatter delimited by ---`);
  }

  const yaml = match[1];
  const nameMatch = yaml.match(/^name:\s*(.+)$/m);
  const descMatch = yaml.match(/^description:\s*(.+)$/m);

  if (!nameMatch) {
    fail(`${skillLabel}: frontmatter missing required field "name"`);
  }

  let description = descMatch?.[1]?.trim() ?? "";
  if (
    (description === ">" || description === "|" || description === ">-") &&
    descMatch
  ) {
    const block = yaml.slice(yaml.indexOf(descMatch[0]) + descMatch[0].length);
    const lines = [];
    for (const line of block.split("\n")) {
      if (/^[a-zA-Z_][\w-]*:\s*/.test(line)) break;
      if (line.startsWith("  ")) lines.push(line.slice(2).trim());
      else if (line.trim() === "") continue;
      else break;
    }
    description = lines.join(" ").trim();
  }

  description = description.replace(/^["']|["']$/g, "").trim();

  if (!description) {
    fail(`${skillLabel}: frontmatter missing required field "description"`);
  }

  const name = nameMatch[1].trim().replace(/^["']|["']$/g, "");
  return { name, description };
}

export async function validateSkills(skills) {
  for (const skill of skills) {
    const label = `skills/${skill.category ? `${skill.category}/` : ""}${skill.name}`;
    const skillMdPath = path.join(skill.sourcePath, "SKILL.md");
    let content;
    try {
      content = await fs.readFile(skillMdPath, "utf8");
    } catch {
      fail(`${label}: missing SKILL.md`);
    }

    const { name } = parseFrontmatter(content, label);

    if (!NAME_PATTERN.test(name)) {
      fail(
        `${label}: invalid name "${name}" (lowercase letters, numbers, hyphens; 1–64 chars)`,
      );
    }

    if (name !== skill.name) {
      fail(`${label}: folder name "${skill.name}" does not match frontmatter name "${name}"`);
    }
  }
}

export async function readManifest() {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, "utf8");
    const data = JSON.parse(raw);
    if (data.version !== 1) {
      fail(`Unsupported manifest version: ${data.version}`);
    }
    if (!Array.isArray(data.skills)) {
      fail("manifest.json: \"skills\" must be an array");
    }
    return { version: 1, skills: [...data.skills].sort() };
  } catch (err) {
    if (err.code === "ENOENT") {
      return { version: 1, skills: [] };
    }
    throw err;
  }
}

export async function writeManifest(skills) {
  const payload = {
    version: 1,
    skills: [...skills].sort(),
  };
  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function copySkillDir(sourcePath, destDir, skillName) {
  const destPath = path.join(destDir, skillName);
  await fs.rm(destPath, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });
  await fs.cp(sourcePath, destPath, { recursive: true });
}

async function removeSkillFromDestinations(skillName, destinations) {
  for (const destDir of destinations) {
    if (destDir.includes(FORBIDDEN_DEST)) {
      fail(`Refusing to operate on forbidden path: ${destDir}`);
    }
    await fs.rm(path.join(destDir, skillName), { recursive: true, force: true });
  }
}

export async function syncSkills(skills, destinations) {
  for (const destDir of destinations) {
    if (destDir.includes(FORBIDDEN_DEST)) {
      fail(`Refusing to write to forbidden path: ${destDir}`);
    }
    for (const skill of skills) {
      await copySkillDir(skill.sourcePath, destDir, skill.name);
    }
  }
}

export async function cmdSync() {
  const skills = await discoverSkills();
  await validateSkills(skills);
  const destinations = destinationPaths();
  await syncSkills(skills, destinations);
  console.log(`Synced ${skills.length} skill(s) to ${destinations.length} destination(s).`);
  for (const skill of skills) {
    console.log(`  - ${skill.name}`);
  }
}

export async function cmdInstall() {
  const skills = await discoverSkills();
  await validateSkills(skills);
  const destinations = destinationPaths();
  const manifest = await readManifest();
  const currentNames = new Set(skills.map((s) => s.name));

  await syncSkills(skills, destinations);

  const orphans = manifest.skills.filter((name) => !currentNames.has(name));
  for (const name of orphans) {
    await removeSkillFromDestinations(name, destinations);
    console.log(`Removed orphan: ${name}`);
  }

  await writeManifest([...currentNames]);
  console.log(
    `Installed ${skills.length} skill(s); manifest updated (${orphans.length} orphan(s) removed).`,
  );
}

export async function cmdUninstall(args) {
  const destinations = destinationPaths();
  const manifest = await readManifest();

  if (args.includes("--all")) {
    if (args.length > 1) {
      fail('Use "uninstall --all" without additional skill names');
    }
    for (const name of manifest.skills) {
      await removeSkillFromDestinations(name, destinations);
      console.log(`Removed: ${name}`);
    }
    await writeManifest([]);
    console.log("Uninstalled all skills tracked in manifest.json.");
    return;
  }

  if (args.length === 0) {
    fail("Usage: uninstall <skill-name> [skill-name...] | uninstall --all");
  }

  const toRemove = new Set(args);
  const unknown = [...toRemove].filter((n) => !manifest.skills.includes(n));
  if (unknown.length > 0) {
    fail(
      `Not in manifest (not installed by this repo): ${unknown.join(", ")}`,
    );
  }

  for (const name of toRemove) {
    await removeSkillFromDestinations(name, destinations);
    console.log(`Removed: ${name}`);
  }

  const remaining = manifest.skills.filter((n) => !toRemove.has(n));
  await writeManifest(remaining);
  console.log(`Updated manifest (${remaining.length} skill(s) remaining).`);
}

function printUsage() {
  console.log(`Usage: node scripts/lib.mjs <command>

Commands:
  sync       Copy skills to install destinations (no manifest changes, no deletes)
  install    Sync, remove orphan skills from manifest, update manifest.json
  uninstall  Remove skill(s) listed in manifest, or use --all

Requires Node.js 18+.`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === "--help" || command === "-h") {
    printUsage();
    process.exit(command ? 0 : 1);
  }

  try {
    switch (command) {
      case "sync":
        await cmdSync();
        break;
      case "install":
        await cmdInstall();
        break;
      case "uninstall":
        await cmdUninstall(args);
        break;
      default:
        fail(`Unknown command: ${command}`);
    }
  } catch (err) {
    if (err.isCliError) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
    throw err;
  }
}

const isMain = path.resolve(process.argv[1] ?? "") === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  main();
}
