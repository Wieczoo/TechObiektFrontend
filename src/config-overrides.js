const webpack=require('webpack');
module.exports=function override(config,env){
    config.resolve.fallback={
        util:require.resolve('util/'),
        util:require.resolve('url/'),
        util:require.resolve('assert/'),
        util:require.resolve('buffer/'),
    };
    config.plgins.push(
        new webpack.ProvidePlugin({
            process:'process/browser',
            Buffer:['buffer','Buffer']
        }),
    );
    return config;
}