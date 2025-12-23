import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: './src/main.tsx',
  context: __dirname,
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.css$/,
        type: 'css',
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      inject: 'body',
    }),
    new ReactRefreshPlugin(),
  ],
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    open: true,
    static: [
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      },
      {
        directory: path.join(__dirname),
        publicPath: '/',
        watch: false,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});

