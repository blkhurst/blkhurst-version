import semver from "semver";
import { logger } from "../utilities/logger.js";
import { Bumper } from "conventional-recommended-bump";

async function getConventionalRecommendedBump() {
  const bumper = new Bumper().loadPreset("conventionalcommits");
  const bumpResult = await bumper.bump();
  const bump = bumpResult.releaseType || "patch";
  logger.info("conventional-commits", `${bumpResult.reason}: ${bump}`);
  return bump;
}

const shouldBumpPrerelease = (
  releaseType: string,
  version: string | semver.SemVer
) => {
  if (!semver.prerelease(version)) {
    return true;
  }
  switch (releaseType) {
    case "major":
      return semver.minor(version) !== 0 || semver.patch(version) !== 0;
    case "minor":
      return semver.patch(version) !== 0;
    default:
      return false;
  }
};

export async function recommendVersion(
  currentVersion: string,
  prereleaseId: string,
  forcePrerelease: boolean
): Promise<string> {
  let recommendedBump = await getConventionalRecommendedBump();

  if (forcePrerelease) {
    const shouldBump = shouldBumpPrerelease(recommendedBump, currentVersion);
    const prereleaseType = shouldBump ? `pre${recommendedBump}` : "prerelease";

    logger.info("prerelease-logic", prereleaseType);

    return semver.inc(
      currentVersion,
      prereleaseType as semver.ReleaseType,
      prereleaseId
    ) as string;
  }

  const isInitialDevelopment = semver.major(currentVersion) === 0;

  if (isInitialDevelopment && recommendedBump === "major") {
    // 0.x.x
    recommendedBump = "minor";
  }

  return semver.inc(
    currentVersion,
    recommendedBump as semver.ReleaseType
  ) as string;
}
