module.exports = {
    devtool: 'cheap-module-source-map',
    
    entry: __dirname + "/app/main.js",
    output: {
        path: __dirname + "/public",
        filename: "bundle.js"
    },
    
    module: {
        loaders: [{
            test: /\.json$/,
            loader: "json-loader"
        }]
    },
    
    devServer: {
        historyApiFallback: true,
        inline: true
    }
    
}