interface MainRsParams {
  name: string;
}
export function mainRs({ name }: MainRsParams) {
  const libName = `${name.replaceAll("-", "_")}_lib`;
  return `
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    ${libName}::run()
}
`;
}
