var dev = process.argv[1] && process.argv[1].indexOf('webpack-dev-server') !== -1;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

module.exports = {
    entry : './index.js',
    output : {
        path : './dist/',
        filename : 'bundle.js',
        publicPath : '/dist/'
    },
    resolve :  {
        extensions : ['', '.js.jsx', '.jsx', '.js', '.scss', '.css'],
        modulesDirectories : ['src', 'node_modules']
    },
    plugins : (
        dev ? ([
            new ExtractTextPlugin('style.css'),
            new webpack.DefinePlugin({
                __DEV__ : dev
            })
        ]) : ([
            new ExtractTextPlugin('style.css'),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.DefinePlugin({
                __DEV__ : dev,
                'process.env.NODE_ENV': '"production"'
            })
        ])        
    ),
    devtool : 'source-map',
    module : {
        preLoaders : [
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'eslint'
            }
        ],
        loaders : [
            {
                test : /\.jsx?$/,
                exclude : /node_modules/,
                loader : 'babel-loader?presets[]=react,presets[]=es2015,plugins[]=transform-runtime'
            },
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract('css?sourceMap,-minimize!postcss?sourceMap!sass?sourceMap')
            }
        ]
    },
    colors : true,
    stats : {colors : true},
    postcss : function() {
        return [autoprefixer({browsers : ['ie >= 9', 'last 2 versions']})]
    },
    eslint : {
        configFile: 'eslint.json'
    },
    devServer : {
        host: '0.0.0.0',
        publicPath : '/dist/'
    }
};