const regexVersion = /^(\d+)\.(\d+)\.(\d+)(?:-([a-z]+)(?:\.(\d+))?)?$/

export const compareSemVer = (v1: string, v2: string): number => {
  const semver = (v: string) => {
    const match = v.match(regexVersion)
    if (!match) throw new Error(`Le format de la version est invalide: ${v}`)

    const [, major, minor, patch, preName, preNum] = match
    return {
      full: v,
      major: parseInt(major),
      minor: parseInt(minor),
      patch: parseInt(patch),
      preName: preName || null,
      preNum: preNum ? parseInt(preNum) : 0,
    }
  }

  const v = semver(v1)
  const lv = semver(v2)

  // Comparaison des numéros principaux
  if (v.major !== lv.major) return v.major - lv.major
  if (v.minor !== lv.minor) return v.minor - lv.minor
  if (v.patch !== lv.patch) return v.patch - lv.patch

  if (!v.preName && lv.preName) return 1
  if (v.preName && !lv.preName) return -1

  const order = { alpha: 1, beta: 2, rc: 3 }
  const rank1 = order[v.preName as keyof typeof order] || 4
  const rank2 = order[lv.preName as keyof typeof order] || 4

  if (rank1 !== rank2) return rank1 - rank2

  return v.preNum - lv.preNum
}

export const filterStableVersions = (versions: string[]): string[] => {
  return versions.filter((v) => !v.match(/-\w+/))
}

export const filterInvalidVersions = (versions: string[]): string[] => {
  return versions.filter((v) => {
    try {
      return !!v.match(regexVersion)
    } catch {
      return false
    }
  })
}
