export function hasDebugFlag(cliArgs: string[]) {
  const flags = cliArgs.slice(2);

  return flags.includes("--debug");
}

export const QUANTUM_ASCII = `

▗▄▄▄▖ ▗▖ ▗▖ ▗▄▖ ▗▖  ▗▖▗▄▄▄▖▗▖ ▗▖▗▖  ▗▖
▐▌ ▐▌ ▐▌ ▐▌▐▌ ▐▌▐▛▚▖▐▌  █  ▐▌ ▐▌▐▛▚▞▜▌
▐▌ ▐▌ ▐▌ ▐▌▐▛▀▜▌▐▌ ▝▜▌  █  ▐▌ ▐▌▐▌  ▐▌
▐▙▄▟▙▖▝▚▄▞▘▐▌ ▐▌▐▌  ▐▌  █  ▝▚▄▞▘▐▌  ▐▌
                                      
`;
