export const compareSemVer = (v1: string, v2: string): number => {
  // Extrait version + prérelease (ex: 1.0.0-alpha.2)
  const semver = (v: string) => {
    const match = v.match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-z]+)(?:\.(\d+))?)?$/)
    if (!match) throw new Error(`Le format de la version est invalide: ${v}`)

    const [, major, minor, patch, preName, preNum] = match
    return {
      full: v,
      major: parseInt(major),
      minor: parseInt(minor),
      patch: parseInt(patch),
      preName: preName || null, // "alpha", "beta", "rc"
      preNum: preNum ? parseInt(preNum) : 0, // Numéro de la préversion
    }
  }

  const v = semver(v1)
  const lv = semver(v2)

  // Comparaison des numéros principaux
  if (v.major !== lv.major) return v.major - lv.major
  if (v.minor !== lv.minor) return v.minor - lv.minor
  if (v.patch !== lv.patch) return v.patch - lv.patch

  // Gestion des préversions
  if (!v.preName && lv.preName) return 1 // Stable > alpha/beta
  if (v.preName && !lv.preName) return -1

  const order = { alpha: 1, beta: 2, rc: 3 }
  const rank1 = order[v.preName as keyof typeof order] || 4
  const rank2 = order[lv.preName as keyof typeof order] || 4

  if (rank1 !== rank2) return rank1 - rank2

  return v.preNum - lv.preNum // Comparer alpha.1 < alpha.2
}

export const filterStableVersions = (versions: string[]): string[] => {
  return versions.filter((v) => !v.match(/-\w+/)) // Supprime les versions contenant un préfixe après un "-"
}
