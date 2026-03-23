import fs from "fs-extra";
import path from "path";
import pc from "picocolors";
import type { ProjectAnswers } from "./prompts.js";

interface ScaffoldOptions extends ProjectAnswers {
  outputDir: string;
}

export async function scaffoldProject(opts: ScaffoldOptions): Promise<void> {
  const { projectName, template, includeVotingExample, network, outputDir } = opts;
  const templateDir = path.join(__dirname, "..", "templates", template);

  console.log(`\n  Creating ${pc.cyan(projectName)} using ${pc.yellow(template)} template...\n`);

  // 1. Copy base template
  await fs.copy(templateDir, outputDir);

  // 2. Patch config files with the user's project name
  if (template === "hardhat") {
    await patchHardhatConfig(outputDir, network);
    await writePackageJson(outputDir, projectName);
  } else {
    await patchFoundryToml(outputDir, network);
  }

  // 3. Optionally add the Voting contract example
  if (!includeVotingExample) {
    const contractsDir = path.join(outputDir, template === "hardhat" ? "contracts" : "src");
    const scriptDir = path.join(outputDir, "script");
    // Remove voting files if they exist
    await fs.remove(path.join(contractsDir, "Voting.sol")).catch(() => {});
    await fs.remove(path.join(scriptDir, "Voting.s.sol")).catch(() => {});
  }

  // 4. Write .env file (copy from .env.example)
  const envExample = path.join(outputDir, ".env.example");
  const envFile = path.join(outputDir, ".env");
  if (await fs.pathExists(envExample) && !(await fs.pathExists(envFile))) {
    await fs.copy(envExample, envFile);
  }

  // 5. Print success message
  console.log(`  ${pc.green("✔")}  Created ${pc.cyan(outputDir)}\n`);
  console.log("  Next steps:\n");
  console.log(`    ${pc.cyan(`cd ${projectName}`)}`);

  if (template === "hardhat") {
    console.log(`    ${pc.cyan("npm install")}`);
    console.log(`    ${pc.cyan("# Set TESTNET_PRIVATE_KEY in .env")}`);
    console.log(`    ${pc.cyan("npm run compile")}`);
    console.log(`    ${pc.cyan("npm run deploy")}`);
  } else {
    console.log(`    ${pc.cyan("# Set TESTNET_PRIVATE_KEY in .env")}`);
    console.log(`    ${pc.cyan("forge build")}`);
    console.log(
      `    ${pc.cyan(
        "forge script script/Counter.s.sol --rpc-url https://rpc.ab.testnet.adifoundation.ai --broadcast --private-key $TESTNET_PRIVATE_KEY"
      )}`
    );
  }

  console.log(`\n  Testnet faucet: ${pc.underline("http://faucet.ab.testnet.adifoundation.ai")}`);
  console.log(`  Testnet explorer: ${pc.underline("https://explorer.ab.testnet.adifoundation.ai")}\n`);
}

async function patchHardhatConfig(dir: string, network: "testnet" | "both"): Promise<void> {
  const configPath = path.join(dir, "hardhat.config.ts");
  if (!(await fs.pathExists(configPath))) return;
  let content = await fs.readFile(configPath, "utf8");
  if (network === "testnet") {
    // Remove mainnet config block if user only wants testnet
    content = content.replace(/\/\/ MAINNET_START[\s\S]*?\/\/ MAINNET_END\n?/g, "");
  }
  await fs.writeFile(configPath, content);
}

async function patchFoundryToml(dir: string, network: "testnet" | "both"): Promise<void> {
  const tomlPath = path.join(dir, "foundry.toml");
  if (!(await fs.pathExists(tomlPath))) return;
  let content = await fs.readFile(tomlPath, "utf8");
  if (network === "testnet") {
    content = content.replace(/# MAINNET_START[\s\S]*?# MAINNET_END\n?/g, "");
  }
  await fs.writeFile(tomlPath, content);
}

async function writePackageJson(dir: string, projectName: string): Promise<void> {
  const pkgPath = path.join(dir, "package.json");
  if (!(await fs.pathExists(pkgPath))) return;
  const pkg = await fs.readJson(pkgPath);
  pkg.name = projectName;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}
