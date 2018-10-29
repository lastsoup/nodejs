/**
 * Webpack配置变量文件
 */
const path = require("path"),
    VARIABLE = {};

/**
 * 获取path函数
 * @param src 根目录下的子文件路径
 */
VARIABLE.getPath = (src = "") => path.resolve(__dirname, src);


/**
 * 是否为生产环境
 * @type    {boolean}
 * @default false
 */
VARIABLE.isProduction = process.env.NODE_ENV === 'production' ? true : false;


/**
 * 构建文件目录
 * @type {string}
 * @desc 开发环境下，构建目录为dev，反之为build
 */
VARIABLE.buildDir = VARIABLE.isProduction ? "./build" : "./dev";

/**
 * 入口文件路径配置
 * @type {string | array | object}
 */
VARIABLE.entry = {
    // 业务代码
    main: [
        VARIABLE.getPath("src/index"),
    ]
};

/**
 * 输出文件路径配置
 * @type {{path, publicPath: string, css: string, filename: string, fonts: string, media: string, dllFilename: string}}
 * @prop path         构建的文件目录规则
 * @prop publicPath   资源引用的公共路径规则
 * @prop filename     构建后生成文件规则
 * @prop css          构建后的样式文件规则
 * @prop fonts        构建后的字体图标文件规则
 * @prop media        构建后成的媒体文件(视频/音频)规则
 * @prop dllFilename  DLL配置文件构建后生成文件规则
 */
VARIABLE.output = {
    path: VARIABLE.getPath(VARIABLE.buildDir),
    publicPath: VARIABLE.isProduction ? "./" : "/",
    filename: `js/[name]${VARIABLE.isProduction ? ".min" : ""}.js`,
    css: `css/[name]${VARIABLE.isProduction ? ".min" : ""}.css`,
    imgs:'css/imgs/'
};

/**
 * html插件配置
 * @type {{title: string, filename, template, dllJs: string}}
 * @prop title      html中的title标签内容
 * @prop filename   构建后生成文件规则
 * @prop template   html模版文件
 * @prop dllJs      构建后生成文件规则
 */
VARIABLE.htmlPlugin = {
    filename: VARIABLE.getPath(VARIABLE.buildDir + "/index.html"),
    template: VARIABLE.getPath("src/index.html")
};

module.exports = VARIABLE;