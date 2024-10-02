import { createFile } from "../create-file.js";

interface MainRsParams {
  name: string;
}

interface HandleMainRsParams extends MainRsParams {
  path: string;
}

function mainRs({ name }: MainRsParams) {
  const libName = `${name.replaceAll("-", "_")}_lib`;
  return `
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    ${libName}::run()
}
`;
}

export async function handleMainRs({
  path,
  ...mainRsParams
}: HandleMainRsParams) {
  return createFile(path, mainRs(mainRsParams));
}
