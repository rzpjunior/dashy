module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
    devServer: {
        proxy: 'https://apidev.edenfarm.tech', // CHANGE TO .ENV
        host: '0.0.0.0',
        public: '0.0.0.0:8080',
        disableHostCheck: true,
        
    }
}

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//     .BundleAnalyzerPlugin;
// module.exports = {
//     configureWebpack: {
//         plugins: [new BundleAnalyzerPlugin()]
//     }
// };