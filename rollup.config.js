import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import localdev from "rollup-plugin-dev";
import json from "@rollup/plugin-json";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    json(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    //!production && serve(),
    /*    !production &&
      localdev({
        dirs: ["public"],
        host: "localhost",
        silent: false,
        port: 9876,
        spa: "public/index.html",
        proxy: [{ from: "/api/*", to: "localhost:8080/api/*" }],
      }),

*/
!production &&
      localdev({
        dirs: ["public"],
        port: 9800,
        silent: false,
        host: "127.0.0.1",
        proxy: {
          "/api/*": "localhost:8080",
        },
      }),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && 
          livereload({
            watch: "public",
            port: 9800,
          }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
