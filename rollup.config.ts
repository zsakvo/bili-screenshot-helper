import { swc, defineRollupSwcOption } from 'rollup-plugin-swc3'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import metablock from 'rollup-plugin-userscript-metablock'
import pkgJson from './package.json' assert { type: 'json' }
import { defineConfig } from 'rollup'
import svg from 'rollup-plugin-svg-import'

const userScriptMetaBlockConfig = {
  file: './userscript.meta.json',
  override: {
    version: pkgJson.version,
    description: pkgJson.description,
    author: pkgJson.author,
  },
}

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'iife',
        file: 'dist/bili-screenshot-helper.user.js',
        sourcemap: false,
        esModule: false,
        compact: true,
        generatedCode: 'es2015',
        globals: {
          screenshot: 'screenshot',
          sortablejs: 'Sortable',
        },
      },
    ],
    plugins: [
      nodeResolve(),
      svg({
        stringify: true,
      }),
      swc(
        defineRollupSwcOption({
          jsc: {
            target: 'es2020',
          },
        })
      ),
      metablock(userScriptMetaBlockConfig),
    ],
    external: ['typed-query-selector', 'sortablejs'],
  },
  {
    input: 'src/dummy.js',
    output: [
      {
        file: 'dist/bili-screenshot-helper.meta.js',
      },
    ],
    plugins: [metablock(userScriptMetaBlockConfig)],
  },
])
