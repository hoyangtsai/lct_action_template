# 理财通活动模版

理财通 v4 开发仓库 <http://git.code.oa.com/fmp/lct_web.git> vue 框架活动开发模版

## 如何开始

因为活动是在 lct_web 的 git仓库中开发，建议模版是以 Download 方式拷贝进去活动目录中，避免把模版中的 git metadata 记录带入。

拷貝完之后替换模版中路徑名稱成自己的活动名称

需要替換的地方僅以下

```index.shtml
<script src="/mb/action/活动名称/js/vue.min.js"></script>
<!-- components -->
<script src="/mb/action/活动名称/inc/js/fit-dialog.umd.js?{md5}"></script>
<script src="/mb/action/活动名称/inc/js/fit-qr-code.umd.js?{md5}"></script>
<script src="/mb/action/活动名称/inc/js/hey-there.umd.js?{md5}"></script>

<script type="text/javascript" data-role="script">
    var url = __pkg("/mb/action/活动名称/js/index.js?{md5}");
    loadPageScript(
        "/mb/action/活动名称/js/index",
        [url],
        function (page) {}
    );
</script>
```

```index.js
define("/mb/action/活动名称/js/index", function(require, exports) {
    var LocationOrigin = location.origin || 'https://qian.tenpay.com';
    var LocationPathname = location.pathname || '/mb/action/活动名称/index.shtml';

    exports.init = function() {
        // eslint-disable-next-line no-undef
        new Vue({

            ...
        })
    }
});
``

执行 `tnpm install` 安装开发时所需依赖

安装完依赖执行以下指令，立即可以开始开发

```bash
npm run dev
```

### css 样式

在执行 `npm run dev` 的时候，樣式是以 postcss 搭配一些常用插件，针对 postcss 目录中的 .pcss 文件进行实时编译输出 css 文件到 css 目录下，所以不需要自行建立 css 目录。

### vue 组件

统一在 components 目录下新建文件夹，如模版中 hey-there 组件，建立组件名的文件夹和组件名的vue文件。

在执行 `npm run dev` 时会监听 components 目录下变化，**自动生成**组件文件夹中的 index.js 入口文件给 rollup 进行编译生成 umd.js 文件。

### 进阶使用

也可以打包多个组件成一个 umd.js 文件

在组件目录新建一个页面级的组件集

```
.
├── components
│   └── page-index
│       └── page-index.vue
```

只需要 import 组件

```page-index.vue
<script>
import ComponentA from '../ComponentA/index';
import ComponentB from '../ComponentB/index';
import ComponentC from '../ComponentC/index';

export default {
  components: {
    ComponentA,
    ComponentB,
    ComponentC,
  }
}
</script>
```

最后在 index.shtml 页面中只要引入 page-index.umd.js 即可使用所有组件
