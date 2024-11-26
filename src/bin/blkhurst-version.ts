#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { logger } from "../utilities/logger.js";
import blkhurstVersion from "../index.js";

import { versionOptions } from "../config/options.js";

const argv = yargs(hideBin(process.argv))
  .scriptName("blkhurst-version")
  .usage("$0 [options]")
  .options(versionOptions)
  .help()
  .alias("h", "help")
  .strict();

async function main() {
  const args = argv.parseSync();
  logger.debug(args);

  await blkhurstVersion();
}

main().catch((error) => {
  logger.error(error.message);
  process.exit(1);
});

