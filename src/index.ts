import { Arguments } from "yargs";
import { versionOptions } from "./config/options.js";
import { logger } from "./utilities/logger.js";
import { recommendVersion } from "./lib/recommend-version.js";

export { recommendVersion } from "./lib/recommend-version.js"

interface VersionCommandConfigOptions {
  allowBranch?: string | string[];
  conventionalCommits?: boolean;
  amend?: boolean;
  json?: boolean;
  commitHooks?: boolean;
  gitRemote?: string;
}

export default async function blkhurstVersion(options?: any) {
  // newVersion
  // Commit
  // Tag
  // Release
}

class version {
  constructor(argv: Arguments<VersionCommandConfigOptions>) {
    logger.debug("version class initialised")

  }
}
