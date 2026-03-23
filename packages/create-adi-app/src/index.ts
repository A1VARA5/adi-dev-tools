#!/usr/bin/env node
/**
 * create-adi-app — CLI scaffold tool for ADI Chain dApps
 *
 * Usage:
 *   npx create-adi-app my-dapp
 *   npx create-adi-app                # interactive mode
 */

import { Command } from "commander";
import path from "path";
import { runPrompts } from "./prompts.js";
import { scaffoldProject } from "./scaffold.js";

const program = new Command();

program
  .name("create-adi-app")
  .description("Create a fully configured ADI Chain dApp project in one command")
  .version("0.1.0")
  .argument("[project-name]", "Name of the project directory to create")
  .option("-t, --template <template>", "Template to use: hardhat | foundry", "")
  .option("--testnet-only", "Pre-configure for testnet only (skip mainnet config)")
  .action(async (projectName?: string, opts?: { template: string; testnetOnly: boolean }) => {
    console.log("\n🚀  create-adi-app — ADI Chain dApp Scaffold\n");

    const answers = await runPrompts({ projectName, template: opts?.template });
    const outputDir = path.resolve(process.cwd(), answers.projectName);

    await scaffoldProject({ ...answers, outputDir });
  });

program.parse();
