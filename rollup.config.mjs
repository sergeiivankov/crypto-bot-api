import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  replace({
    delimiters: ['', ''],
    preventAssignment: false,
    'request/http': 'request/xhr',
    'import Client from \'./classes/ClientEmitter\'': 'import Client from \'./classes/Client\';export default Client;',
  }),
  typescript({
    compilerOptions: {
      module: 'esnext',
      target: 'es5',
      sourceMap: true,
      declaration: false,
      outDir: './dist',
    },
  }),
];

const onwarn = (message, handler) => {
  if (/TS18028/.test(message)) return;
  if (/TS1203/.test(message)) return;
  handler(message);
};

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'CryptoBotAPI',
      file: 'dist/crypto-bot-api.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
    onwarn,
    watch: { clearScreen: false },
  },
  {
    input: 'src/index.ts',
    output: {
      name: 'CryptoBotAPI',
      file: 'dist/crypto-bot-api.min.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      terser({ format: { comments: false } }),
    ],
    onwarn,
    watch: false,
  },
];
