import { CodeNode } from "@flyde/core";
import * as fs from "fs";

export const Exists: CodeNode = {
  id: "Exists",
  defaultStyle: {
    icon: "fa-file",
  },
  namespace: "File System",
  description: "Checks if a file exists",
  inputs: { path: { description: "Path to the file" } },
  outputs: { exists: { description: "Whether the file exists" } },
  run: async ({ path }, { exists }) => {
    return exists.next(await fs.promises.access(path, fs.constants.F_OK));
  },
};
