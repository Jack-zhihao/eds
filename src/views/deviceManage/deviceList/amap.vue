<template>
  <div class="container" id="amapContainer"></div>
</template>
<script setup>
import { onMounted, onUnmounted, defineEmits, defineProps, ref  } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
const emit = defineEmits(['update:lnglat'])
const props = defineProps({
  lnglat: {
    type: Array,
    default: [116.397428, 39.90923]
  }
})

let map = null;

const reverseGeocoding = (lnglat) => {
        // 创建逆地理编码服务实例
        const geocoder = new AMap.Geocoder({
          radius: 500, // 搜索半径
          extensions: "all", // 返回地址组成部件
        });

        // 使用逆地理编码服务
        geocoder.getAddress(lnglat, function (status, result) {
          if (status == 'complete' && result.info == 'OK') {
            // 打印详细地址
            console.log('逆地理编码结果：', result.regeocode.formattedAddress);
            // 可以根据需要使用 result 对象中的其他信息
          } else {
            console.error('逆地理编码失败', status, result);
          }
        });
      }

const initMap = () => {
      console.log(props.lnglat)
      map = new AMap.Map("amapContainer", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 11, // 初始化地图级别
        center: props.lnglat, // 初始化地图中心点位置
      });

      map.addControl(new AMap.ToolBar());
      map.addControl(new AMap.Marker());
      map.addControl(new AMap.Scale());
      handleMaker(props.lnglat, map)
      map.on('click', (event) => {
        emit('update:lnglat', event.lnglat);
        const lnglat = String(event.lnglat).split(',')
        handleMaker(lnglat, map)
        reverseGeocoding(event.lnglat)
        // 可以在这里添加更多的处理逻辑
      })
}

// 清除之前的标记
const clearMaker = (map) => {
    if (!marker) return
    map.remove([marker]);
}
// 标记
let marker = null
const handleMaker = (lnglat, map) => {
    if (!lnglat[1]) return

    clearMaker(map)

    const makerData = {
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        position: new AMap.LngLat(lnglat[0], lnglat[1]),
        offset: new AMap.Pixel(-10, -10),
        content: '标记地点',
    }

    marker = new AMap.Marker({
        icon: new AMap.Icon({
            size: new AMap.Size(40, 40),
            image: makerData.icon,
            imageSize: new AMap.Size(20, 25),
        }),
        position:makerData.position,
        offset: makerData.offset,
        title: makerData.content,
    })
    marker.setMap(map);
}
onMounted(() => {
  if (props.lnglat.length != 2) return
  initMap()
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
