#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { copySkillDir, discoverSkills, rewriteSharedReferenceLinks } from "./lib.mjs";

test("rewriteSharedReferenceLinks rewrites shared reference paths", () => {
  const input =
    "See [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md) and [DOMAIN](../_shared_references/DOMAIN-AWARENESS.md).";
  const output = rewriteSharedReferenceLinks(input);
  assert.equal(
    output,
    "See [ASK-QUESTION.md](./references/ASK-QUESTION.md) and [DOMAIN](./references/DOMAIN-AWARENESS.md).",
  );
});

test("discoverSkills skips _shared_* category entries", async () => {
  const skills = await discoverSkills();
  const withDocs = skills.filter((skill) => skill.category === "with-docs");
  assert.ok(withDocs.length >= 7);
  assert.ok(
    withDocs.every((skill) => skill.categoryPath?.endsWith(`${path.sep}with-docs`)),
  );
  assert.ok(!withDocs.some((skill) => skill.name.startsWith("_shared")));
});

test("copySkillDir injects _shared_references into references/", async () => {
  const tmpHome = await fs.mkdtemp(path.join(os.tmpdir(), "agent-skills-test-"));
  const destDir = path.join(tmpHome, ".agents", "skills");

  const skills = await discoverSkills();
  const grill = skills.find((skill) => skill.name === "grill-with-docs");
  assert.ok(grill);

  await copySkillDir(grill.sourcePath, destDir, grill.name, grill.categoryPath);

  const installedAsk = path.join(destDir, "grill-with-docs", "references", "ASK-QUESTION.md");
  const installedDomain = path.join(
    destDir,
    "grill-with-docs",
    "references",
    "DOMAIN-AWARENESS.md",
  );

  await fs.access(installedAsk);
  await fs.access(installedDomain);
});
