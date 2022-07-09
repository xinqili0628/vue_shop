const prodPlugins = []
if(process.env.NODE_ENV=== 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins':[
    // 发布产品时用到的插件
    ...prodPlugins
  ]
}
