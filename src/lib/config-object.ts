const DEFAULT_OUTPUT = {
  name: "app-created",
};

export function generateOutputObject(
  userChoices: Partial<Config> = {}
): typeof DEFAULT_OUTPUT {
  console.log(userChoices);
  return Object.assign(DEFAULT_OUTPUT, userChoices);
}

type Config = {
  name: string;
  identifier: string;
  signingIdentity: string | undefined;
  pubKey: string | undefined;
};
