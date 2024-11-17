/**
 * @param {经纬度格式转换}
 */
export const formatLnglat = (geo_location = '') => {
  if (!geo_location) return
  const lnglat = geo_location.split(',').map(n => Number(n))
  return lnglat
}

/**
 * @param {uuid}
 */
export const uuid = (len, radix) => {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // 紧凑格式
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // RFC 4122，版本 4 格式
    var r;
    // RFC 4122 要求这些字符
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    // 填充随机数据。在 i == 19 时设置时钟序列的高位
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i === 19)? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

export const routesToMenuTree = (routes = [], parentKey = '/') => {
  const menuTree = []
  routes.forEach((route, index) => {
    let routeChild = []
    const key = parentKey + route.path
    const { children = [], component, meta, ...other } = route
    if (children && children.length) {
      routeChild = routesToMenuTree(children, key + '/')
    }
    if (!meta.hide) {
      if (routeChild.length) {
        menuTree.push({
          key,
          ...other,
          ...meta,
          children: routeChild,
        })
      } else {
        menuTree.push({
          key,
          ...other,
          ...meta,
        })
      }
    }
  })
  return menuTree
}

// 数组扁平化
export const flattenArray = (arr) => {
  while (arr.some(Array.isArray)) {
    arr = [].concat(...arr);
  }
  return arr;
}