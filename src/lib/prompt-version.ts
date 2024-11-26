import semver from "semver";
import chalk from "chalk";
import { promptSelect } from "../utilities/prompt.js";

export async function promptVersion(
  currentVersion: string,
  prereleaseId: string,
  suggestedVersion: string
) {
  const patch = semver.inc(currentVersion, "patch");
  const minor = semver.inc(currentVersion, "minor");
  const major = semver.inc(currentVersion, "major");
  const prepatch = semver.inc(currentVersion, "prepatch", prereleaseId);
  const preminor = semver.inc(currentVersion, "preminor", prereleaseId);
  const premajor = semver.inc(currentVersion, "premajor", prereleaseId);
  const prerelease = semver.inc(currentVersion, "prerelease", prereleaseId);

  const choices = [
    { value: suggestedVersion, name: `Recommended (${suggestedVersion})` },
    { value: patch, name: `Patch (${patch})` },
    { value: minor, name: `Minor (${minor})` },
    { value: major, name: `Major (${major})` },
    { value: prepatch, name: `Prepatch (${prepatch})` },
    { value: preminor, name: `Preminor (${preminor})` },
    { value: premajor, name: `Premajor (${premajor})` },
    { value: prerelease, name: `Prerelease (${prerelease})` },
  ];

  return await promptSelect(
    `Select a new version (currently ${chalk.green(currentVersion)}):`,
    choices
  );
}
