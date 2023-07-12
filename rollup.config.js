"use strict";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";

import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

import pkg from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/index.js",
    output: [
      {
        file: pkg.exports.require,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: pkg.exports.import,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/env"],
      }),
      commonjs(),
      terser(),
    ],
  },
];
