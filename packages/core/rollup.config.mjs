import typescript from "@rollup/plugin-typescript";
import clear from "rollup-plugin-clear";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "./src/index.ts",
    output: {
      file: "dist/index.js",
      format: "es",
    },

    plugins: [
      terser({ module: true }),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      clear({
        targets: ["dist"],
        watch: true,
      }),
    ],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: "watermark",
    },

    plugins: [
      terser(),
      typescript({
        tsconfig: "./tsconfig.json",
        compilerOptions: {
          module: "ES2015",
        },
      }),
      clear({
        targets: ["dist"],
        watch: true,
      }),
    ],
  },
];
