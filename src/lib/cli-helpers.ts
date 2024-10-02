export function getFlag(cliArgs: string[], flag: string) {
  const flags = cliArgs.slice(2);

  const index = flags.indexOf(flag);
  if (index > -1 && flags[index + 1]) {
    return flags[index + 1];
  }
  return null;
}
