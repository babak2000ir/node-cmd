import path from 'node:path';
import { fileURLToPath } from 'node:url';
import NodemonPlugin from 'nodemon-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const configBuilder = (env, argv) => {
  const config = {
    entry: './src/app.js',
    target: 'node',
    output: {
      filename: 'server.cjs',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new NodemonPlugin({
        script: (argv.mode === 'development') ? './src/app.js' : './dist/server.cjs',
        watch: path.resolve('./src'),
        ext: 'js,njk,json,cjs',
        delay: '1000',
        verbose: true,
        env: {
          NODE_ENV: argv.mode,
        },
      }),
    ],
  };

  if (argv.mode === 'development') {
    config.watch = true;
  }

  return config;
};

export default configBuilder;