import prompts from "prompts";

export interface ProjectAnswers {
  projectName: string;
  template: "hardhat" | "foundry";
  includeVotingExample: boolean;
  network: "testnet" | "both";
}

interface PromptInput {
  projectName?: string;
  template?: string;
}

export async function runPrompts(input: PromptInput = {}): Promise<ProjectAnswers> {
  const questions: prompts.PromptObject[] = [];

  if (!input.projectName) {
    questions.push({
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "my-adi-dapp",
      validate: (v: string) =>
        /^[a-z0-9-_]+$/i.test(v) ? true : "Use only letters, numbers, hyphens and underscores",
    });
  }

  if (!input.template || !["hardhat", "foundry"].includes(input.template)) {
    questions.push({
      type: "select",
      name: "template",
      message: "Development framework:",
      choices: [
        {
          title: "Hardhat 3  (Ignition + TypeScript)",
          description: "Best for JS/TS devs. Ignition for deployments.",
          value: "hardhat",
        },
        {
          title: "Foundry  (forge + cast)",
          description: "Best for Solidity-first devs. Faster compilation.",
          value: "foundry",
        },
      ],
      initial: 0,
    });
  }

  questions.push(
    {
      type: "select",
      name: "network",
      message: "Networks to configure:",
      choices: [
        { title: "Testnet only  (recommended for getting started)", value: "testnet" },
        { title: "Testnet + Mainnet", value: "both" },
      ],
      initial: 0,
    },
    {
      type: "confirm",
      name: "includeVotingExample",
      message: "Include a Voting contract example?",
      initial: true,
    }
  );

  const answers = await prompts(questions, {
    onCancel: () => {
      console.log("\nCancelled.");
      process.exit(0);
    },
  });

  return {
    projectName: input.projectName || answers.projectName,
    template: ((input.template || answers.template) as "hardhat" | "foundry"),
    includeVotingExample: answers.includeVotingExample,
    network: answers.network,
  };
}
