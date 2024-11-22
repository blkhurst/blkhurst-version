import inquirer from "inquirer";
import semver from "semver";
import fs, { readJson } from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";

const defaults = {
  versionFiles: ["package.json", "package-lock.json"],
  prereleaseId: "canary",
  tagPrefix: "v",
};
type Defaults = typeof defaults;

const pathExists = (filePaths: string[]): boolean => {
  const missingPaths = filePaths.filter((path) => !fs.existsSync(path));
  if (missingPaths.length > 0 || filePaths.length == 0) return false;
  return true;
};

const readJsonVersion = async (file: string) => {
  const filePath = path.resolve(process.cwd(), file);
  const jsonContent = await fs.readJSON(filePath);
  return jsonContent.version;
};

const writeJsonVersion = async (file: string, newVersion: string) => {
  const filePath = path.resolve(process.cwd(), file);
  const jsonContent = await fs.readJSON(filePath);
  jsonContent.version = newVersion;
  await fs.writeJSON(filePath, jsonContent, { spaces: 2 });
};

async function promptVersion(currentVersion: string, prereleaseId: string) {
  const patch = semver.inc(currentVersion, "patch");
  const minor = semver.inc(currentVersion, "minor");
  const major = semver.inc(currentVersion, "major");
  const prepatch = semver.inc(currentVersion, "prepatch", prereleaseId);
  const preminor = semver.inc(currentVersion, "preminor", prereleaseId);
  const premajor = semver.inc(currentVersion, "premajor", prereleaseId);
  const prerelease = semver.inc(currentVersion, "prerelease", prereleaseId);

  const choices = [
    { value: patch, name: `Patch (${patch})` },
    { value: minor, name: `Minor (${minor})` },
    { value: major, name: `Major (${major})` },
    { value: prepatch, name: `Prepatch (${prepatch})` },
    { value: preminor, name: `Preminor (${preminor})` },
    { value: premajor, name: `Premajor (${premajor})` },
    { value: prerelease, name: `Prerelease (${prerelease})` },
  ];

  const { newVersion } = await inquirer.prompt([
    {
      type: "list",
      name: "newVersion",
      message: `Select a new version (currently ${currentVersion}):`,
      choices: choices,
    },
  ]);

  return newVersion;
}

async function promptConfirmation(message: string) {
  const { confirmNewVersion } = await inquirer.prompt([
    {
      type: "expand",
      default: "y",
      name: "confirmNewVersion",
      message: message,
      choices: [
        { key: "y", name: "Yes", value: true },
        { key: "n", name: "No", value: false },
      ],
    },
  ]);

  if (confirmNewVersion) return true;
  return false;
}

function addTagPrefix(version: string, tagPrefix: string): string {
  return `${tagPrefix}${version}`;
}

function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: "utf8", stdio: "pipe" }).trim();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}

function isWorkingDirectoryClean() {
  const status = runCommand("git status --porcelain");
  return status === "";
}

function isOnBranch() {
  const branch = runCommand("git rev-parse --abbrev-ref HEAD");
  return branch !== "HEAD";
}

function tagExists(tag: string) {
  const localTags = runCommand(`git tag -l "${tag}"`).split("\n");
  return localTags.includes(tag);
}

function checkRemoteExists(remoteName: string = "origin") {
  const remotes = runCommand("git remote");
  return remotes.split("\n").includes(remoteName);
}

function githubCliExists() {
  try {
    runCommand("gh --version");
  } catch {
    return false;
  }
  return true;
}

function createCommitAndTag(filePaths: string[], newVersion: string): void {
  runCommand(`git add ${filePaths.join(" ")}`);
  runCommand(`git commit -m "chore(release): ${newVersion}"`);
  runCommand(`git tag ${newVersion} -m ${newVersion}`);
}

function createGithubRelease(version: string, prerelease: boolean): void {
  const prereleaseFlag = prerelease ? "--prerelease" : "";
  const command = `gh release create ${version} --title "${version}" --generate-notes ${prereleaseFlag}`;
  runCommand(command);
}

function logSuccess(scope: string, message: string = "") {
  console.log(
    chalk.bgBlack.dim("blkhurst"),
    chalk.green.bold("success"),
    chalk.magenta(scope),
    message
  );
}

function logNotice(scope: string, message: string = "") {
  console.log(
    chalk.bgBlack.dim("blkhurst"),
    chalk.cyan("notice"),
    chalk.magenta(scope),
    message
  );
}

function logError(message: string) {
  throw new Error(message);
}

async function main() {
  const args = process.argv.slice(2);
  const isAutomated = args.includes("--auto");
  const createRelease = args.includes("--create-release");
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");

  if (createRelease && !(process.env.GH_TOKEN || process.env.GITHUB_TOKEN)) {
    logError("Either GH_TOKEN or GITHUB_TOKEN must be set to create a release");
  }

  if (!pathExists(defaults.versionFiles)) {
    logError(`Version files not found: [${defaults.versionFiles.join(", ")}]`);
  }

  const version = await readJsonVersion(defaults.versionFiles[0]);
  const currentVersion = semver.clean(version);
  if (!currentVersion || !semver.valid(currentVersion)) {
    logError(`Invalid 'version' in package.json: ${currentVersion}`);
    process.exit(1);
  }

  let newVersion: string;
  if (isAutomated) {
    newVersion = "";
    logError("Automated releases are currently not supported.");
    //! recommendedVersion (ensure is defaults to prerelease)
  } else {
    newVersion = await promptVersion(currentVersion, defaults.prereleaseId);
    console.log(`\nChanges:\n - ${currentVersion} => ${newVersion}\n`);
    const confirmChangesMsg = "Are you sure you want to create this version";
    const confirmChanges = await promptConfirmation(confirmChangesMsg);
    if (!confirmChanges) {
      process.exit(1);
    }
  }

  newVersion = addTagPrefix(newVersion, defaults.tagPrefix);
  const isPrerelease = semver.prerelease(newVersion) !== null;

  if (!isWorkingDirectoryClean() && !force) {
    logError("Working directory is not clean.");
  }

  if (!isOnBranch()) {
    logError("You are in a detached HEAD state.");
  }

  if (tagExists(newVersion)) {
    logError(`Tag "${newVersion}" already exists locally.`);
  }

  const remoteExists = checkRemoteExists();
  if (!remoteExists) {
    console.warn("Remote not detected.");
  }
  
  if (dryRun) {
    logSuccess("Dry Run", newVersion);
    process.exit(0);
  }

  logNotice("Incrementing versions...");
  for (const versionFile of defaults.versionFiles) {
    console.log(` - Writing version to ${versionFile}...`);
    await writeJsonVersion(versionFile, newVersion);
  }

  createCommitAndTag(defaults.versionFiles, newVersion);
  logNotice("Created Commit & Tag");

  if (remoteExists && createRelease) {
    if (!githubCliExists()) {
      logError("GitHub CLI (gh) is not installed.");
    }

    runCommand("git push --follow-tags");
    logNotice("Pushed Tags");

    createGithubRelease(newVersion, isPrerelease);
    logNotice("GitHub Release");
  } else {
    // Show how to perform tagging and releasing
    logNotice("Push changes & release to complete.");
    const pushTagCommand = " - git push --follow-tags origin main";
    const releaseCommand = ` - gh release create "${newVersion}" --title "${newVersion}" --generate-notes ${
      isPrerelease ? "--prerelease" : ""
    }`;
    console.log(pushTagCommand);
    console.log(releaseCommand);
  }

  logSuccess("New Version", newVersion);
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
