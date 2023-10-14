import type { Configuration } from 'webpack';
import dotenv from 'dotenv';
import webpack from 'webpack';

import { rules } from './webpack.rules';

const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((prev: any, next: string) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  plugins: [new webpack.DefinePlugin(envKeys)],
};
