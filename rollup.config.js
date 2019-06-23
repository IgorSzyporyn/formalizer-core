import path from 'path'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import json from 'rollup-plugin-json'
import pkg from './package.json'

const input = './compiled/index.js'
const external = id => !id.startsWith('.') && !path.isAbsolute(id)
const replacements = [{ original: 'lodash', replacement: 'lodash-es' }]

const babelOptions = {
  exclude: /node_modules/,
  plugins: [
    'annotate-pure-calls',
    'dev-expression',
    ['transform-rename-import', { replacements }],
  ],
}

const buildUmd = ({ env }) => ({
  input,
  external: ['react'],
  output: {
    name: 'core',
    format: 'umd',
    sourcemap: true,
    file: `./dist/core.umd.${env}.js`,
    exports: 'named',
    globals: {
      react: 'React',
    },
  },
  plugins: [
    resolve(),
    json(),
    babel(babelOptions),
    replace({
      exclude: 'node_modules/**',
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    commonjs({
      include: /node_modules/,
      namedExports: {
        'node_modules/prop-types/index.js': [
          'object',
          'oneOfType',
          'string',
          'node',
          'func',
          'bool',
          'element',
        ],
      },
    }),
    sourceMaps(),
    sizeSnapshot(),
    env === 'production' &&
      terser({
        sourcemap: true,
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true,
        },
        warnings: true,
        ecma: 5,
        toplevel: false,
      }),
  ],
})

const buildCjs = ({ env }) => ({
  input,
  external,
  output: {
    file: `./dist/core.cjs.${env}.js`,
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    json(),
    replace({
      exclude: 'node_modules/**',
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    sourceMaps(),
    sizeSnapshot(),
    env === 'production' &&
      terser({
        sourcemap: true,
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true,
        },
        warnings: true,
        ecma: 5,
        // Compress and/or mangle variables in top level scope.
        // @see https://github.com/terser-js/terser
        toplevel: true,
      }),
  ],
})

export default [
  buildUmd({ env: 'production' }),
  buildUmd({ env: 'development' }),
  buildCjs({ env: 'production' }),
  buildCjs({ env: 'development' }),
  {
    input,
    external,
    output: [
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      json({
        // for tree-shaking, properties will be declared as
        // variables, using either `var` or `const`
        preferConst: true, // Default: false

        // specify indentation for the generated default export —
        // defaults to '\t'
        indent: '  ',

        // ignores indent and generates the smallest code
        compact: true, // Default: false

        // generate a named export for every property of the JSON object
        namedExports: true, // Default: true
      }),
      babel(babelOptions),
      sizeSnapshot(),
      sourceMaps(),
    ],
  },
]
