import { execSync } from "child_process";

function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: "utf8", stdio: "pipe" }).trim();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}