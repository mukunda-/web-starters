import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';
import pkg from 'webpack';
const { DefinePlugin } = pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));
import CopyWebpackPlugin from 'copy-webpack-plugin';

// For minification in production builds.
import TerserPlugin from 'terser-webpack-plugin';

// TODO: what does this do *exactly*?
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export default (env, argv) => {
   const buildtime = Date.now();
   const production = argv.mode == "production";
   const devtool = production ? undefined : "source-map";
   const version = "1.0.0";

   const optimization = production ? {
      // For production builds, compress the result.
      minimize: true,
      minimizer: [
         new TerserPlugin({
            terserOptions: {
               compress: {
                  passes: 2,
               },
               format: {
                  comments: false,
               },
            },
            extractComments: true,
         }),
      ],
   } : {
      // For non-production builds, leave the output readable (for debuggers).
      minimize: false,
   };

   ///////////////////////////////////////////////////////////////////////////////////////
   return {
      devtool,
      entry: {
         hello: {
            import: ["./src/hello.tsx", "./src/hello.css"],
            filename: "./dist/bundle.js"
         },
         // Add other entry points here to create additional bundle files.
      },
      
      resolve: {
         // Allow omitting these extensions when using `import` statements in JS.
         extensions: ['.ts', '.tsx', '.js', '.scss'],

         // I believe this allows to use relative paths according to the folders
         // in tsconfig.json
         plugins: [new TsconfigPathsPlugin({})],
      },

      output: {
         // Output files relative to project directory.
         path: __dirname,
      },

      module: {
         rules: [
            {
               // ts and tsx files.
               test: /\.tsx?$/,
               use: 'ts-loader',
               exclude: /node_modules/,
            },
            {
               // scss files.
               test: /\.(scss)$/i,
               use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
               exclude: /node_modules/,
            },
            {
               // css files.
               test: /\.(css)$/i,
               use: ['style-loader', 'css-loader', 'postcss-loader'],
               exclude: /node_modules/,
            }
         ]
      },
      optimization,
      plugins: [
         new ESLintPlugin({
            extensions: ['js', 'ts', 'tsx']
         }),
         new DefinePlugin({
            __PRODUCTION: JSON.stringify(production),
            __VERSION: JSON.stringify(version),
         }),
         
         // Copy HTML files to output folder.
         new CopyWebpackPlugin({
            patterns: [{
               from: './src/*.html',
               to: 'dist/[name][ext]',
               transform(content) {
                  // For cachebusting.
                  return content.toString().replaceAll("{{buildtime}}", buildtime);
               }
            },
            // Additional copies can be added here.
            // {
            //    from: './res/*',
            //    to: 'dist/',
            // },
            // {
            //    from: './manifest.json',
            //    to: 'dist/',
            // }
            ]
         }),
      ]
   }
};
