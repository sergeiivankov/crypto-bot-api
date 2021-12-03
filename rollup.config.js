import replace from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';

const plugins = [
  replace({
    'request/http': 'request/xhr',
    "import Client from './classes/ClientWebhookable'": "import Client from './classes/Client';export default Client;",
    delimiters: ['', ''],
    preventAssignment: false
  }),
  typescript({
    module: 'esnext',
    target: 'es5',
    sourceMap: true
  })
];

const onwarn = (message) => {
  if (/TS18028/.test(message)) return;
  if (/TS1203/.test(message)) return;
  console.error(message);
};

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'CryptoBotAPI',
      file: 'dist/crypto-bot-api.js',
      format: 'iife',
      sourcemap: true
    },
    plugins,
    onwarn,
    watch: { clearScreen: false }
  },
  {
    input: 'src/index.ts',
    output: {
      name: 'CryptoBotAPI',
      file: 'dist/crypto-bot-api.min.js',
      format: 'iife',
      sourcemap: true
    },
    plugins: [
      ...plugins,
      terser({
        compress: {

        },
        format: { comments: false }
      })
    ],
    onwarn,
    watch: false
  }
];