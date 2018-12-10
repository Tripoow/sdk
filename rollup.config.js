import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'

const packageName = process.env.PACKAGE_NAME;

if (!packageName) {
  throw new Error('You need to set --environment PACKAGE_NAME:EXAMPLE');
}

const pkg = require('./packages/'+packageName+'/package.json')
const external = []
const globals = {}
 if (pkg.dependencies) {
  for (const dependency in pkg.dependencies) {
    external.push(dependency)
    globals[dependency] = camelCase(dependency)
  }
}
 if (pkg.peerDependencies) {
  for (const dependency in pkg.peerDependencies) {
    external.push(dependency)
    globals[dependency] = camelCase(dependency)
  }
}

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, name: camelCase(packageName), format: 'umd', sourcemap: true, globals: globals },
    { file: pkg.module, format: 'es', sourcemap: true, globals: globals },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: external,
  watch: {
    include: 'src/**'
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
}
