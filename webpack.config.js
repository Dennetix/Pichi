const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const debug = true;

const clientConfig = {
    mode: debug ? 'development' : 'production',
    entry: './src/client/App',
    output: {
        path: path.resolve(__dirname, './dist/static'),
        filename: 'client.bundle.js'
    },
    resolve: {
        extensions: ['*', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx'],
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./src')
        ]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            namedExport: true,
                            camelCase: true,
                            modules: true
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            }
        ]
    }
};

let nodeModules = {};
fs.readdirSync('node_modules')
    .filter((x) => {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach((module) => {
        nodeModules[module] = 'commonjs ' + module;
    });

const serverConfig = {
    mode: debug ? 'development' : 'production',    
    entry: './src/server/Server',
    target: 'node',
    output: {
        path: path.resolve(__dirname, './dist/static'),
        filename: 'server.bundle.js'
    },
    externals: nodeModules,
    resolve: {
        extensions: ['*', '.webpack.js', '.web.js', '.ts', '.js', '.node'],
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./src')
        ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            }
        ]
    }
}

module.exports = [clientConfig, serverConfig];