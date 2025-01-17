import * as ts from "typescript";
import { exportToGlobalTransformer } from "./exports-transformer";
import { importToGlobalTransformer } from "./imports-transformer";
import { stripTypesTransformer } from "./strip-types-transformer";

export function transpileFile(fileName: string, content: string) {
  const transpileOutput = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    transformers: {
      before: [
        importToGlobalTransformer(),
        stripTypesTransformer(),
        exportToGlobalTransformer(fileName),
      ],
    },
  });

  return transpileOutput.outputText.replace(/export\s*{\s*};\s*/g, "");
}
