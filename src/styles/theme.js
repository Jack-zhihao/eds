
import Store from '@/store'
const light = {
    'main-bg-color': 'rgba(255, 255, 255, 1)',
    'main-deep-bg-color': 'rgba(246, 246, 246, 1)',
    'main-text-color': 'rgba(35, 35, 36, 1)',
    'main-text-active-color': 'rgba(22, 93, 255, 1)',
    'sub-bg-color': 'rgba(242, 242, 242, 1)',
    'hover-bg-color': 'rgba(232, 243, 255, 1)',
    'placeholder-color': 'rgba(187, 187, 187, 1)',
    'menu-selected-bg-color': 'rgba(249, 249, 249, 1)',

    // 控制台渐变色
    'linear-gradient-color1': 'rgba(242, 249, 254, 1)',
    'linear-gradient-color2': 'rgba(230, 244, 254, 1)',

    'linear-gradient-color3': 'rgba(245, 254, 242, 1)',
    'linear-gradient-color4': 'rgba(230, 254, 238, 1)',

    'linear-gradient-color5': 'rgba(247, 247, 255, 1)',
    'linear-gradient-color6': 'rgba(236, 236, 255, 1)',
};
const dark = {
    'main-bg-color': 'rgba(35, 35, 36, 1)',
    'main-deep-bg-color': 'rgba(24, 27, 29, 1)',
    'main-text-color': 'rgba(197, 197, 197, 1)',
    'main-text-active-color': 'rgba(22, 93, 255, 1)',

    'sub-bg-color': 'rgba(46, 46, 47, 1)',
    'hover-bg-color': 'rgba(46, 46, 47, 1)',
    'placeholder-color': 'rgba(100, 100, 106, 1)',

    'menu-selected-bg-color': 'rgba(42, 42, 44, 1)',

    // 控制台渐变色
    'linear-gradient-color1': 'rgba(40, 73, 145, 1)',
    'linear-gradient-color2': 'rgba(18, 43, 98, 1)',

    'linear-gradient-color3': 'rgba(61, 73, 46, 1)',
    'linear-gradient-color4': 'rgba(38, 56, 39, 1)',

    'linear-gradient-color5': 'rgba(49, 37, 101, 1)',
    'linear-gradient-color6': 'rgba(32, 25, 54, 1)',
}

const themes = {light, dark};

//改变当前主题
export const switchTheme = (theme, fn) => {
    fn && fn(theme)
    setTimeout(() => {
        let _theme = themes[theme];
        for (let key in _theme) {
            document.body.style.setProperty(`--${key}`, _theme[key]);
        }
    })
}
