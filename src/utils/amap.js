import AMapLoader from "@amap/amap-jsapi-loader";

window._amapsecurityconfig = {
    securityjscode: import.meta.env.VITE_APP_MAP_CODE
}
const Amap = AMapLoader.load({
    key: import.meta.env.VITE_APP_MAP_KEY,
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Marker', 'AMap.Geocoder'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
})

window.Amap = Amap
