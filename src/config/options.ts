import { Options } from "yargs";

export const versionOptions: { [key: string]: Options } = {
  prereleaseId: {
    alias: "preid",
    type: "string",
    describe: "Prerelease identifier.",
    default: "canary",
  },
  tagPrefix: {
    type: "string",
    describe: "Tag prefix.",
    default: "v",
  },
  versionFiles: {
    alias: "vf",
    type: "array",
    describe: "Files to update version in.",
    default: ["package.json", "package-lock.json"],
  },
};