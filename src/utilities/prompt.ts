import inquirer from "inquirer";

export async function promptSelect(
  message: string,
  choices: any //! Fix any type
): Promise<string> {
  const { prompt } = await inquirer.prompt([
    {
      type: "list",
      name: "prompt",
      message: message,
      choices: choices,
      pageSize: choices.length,
    },
  ]);
  return prompt;
}

export async function promptText(message: string): Promise<string> {
  const { input } = await inquirer.prompt([
    {
      type: "input",
      name: "input",
      message: message,
    },
  ]);
  return input;
}

export async function promptConfirmation(message: string): Promise<boolean> {
  const { confirm } = await inquirer.prompt([
    {
      type: "expand",
      name: "confirm",
      choices: [
        { key: "y", name: "Yes", value: true },
        { key: "n", name: "No", value: false },
      ],
      message: message,
    },
  ]);
  return confirm;
}
