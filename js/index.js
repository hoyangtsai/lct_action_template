define('/mb/action/lct_action_template/js/index', (require, exports) => {
  const LocationOrigin = location.origin || 'https://qian.tenpay.com';
  const LocationPathname = location.pathname || '/mb/action/lct_action_template/index.shtml';

  exports.init = function () {
    return new Vue({
      el: '#vueBox',
      data: function () {
        return {
          doAction: 'coding',
        };
      },
      created: function () {
        $.Loading.hideBodyLoading();
        // 初始化分享链接
        this.initShare();
      },
      mounted: function () {
        this.hidePageLoading();
      },
      methods: {
        // 设置分享标题&描述
        initShare: function (title, desc) {
          const shareConf = {
            link: LocationOrigin + LocationPathname,
            img_url: `${LocationOrigin}/mb/action/lct_action_template/img/wx-share.png`,
            title: title || '千万红包快来领！先到先得',
            desc: desc || '生成2020感谢信还可抽大红包！',
          };
          $.Share.init(shareConf, function () {
            // 分享关闭后回调
          });
        },
        hidePageLoading: function () {
          const pageLoading = document.querySelector('.page-loading');
          if (pageLoading) {
            pageLoading.style = 'display: none;';
          }
          // document.querySelector("#vueBox").style = "display: block;";
          this.isPageLoaded = true;
        },
        // 展示活动规则详情
        handleRuleShow: function () {
          const that = this;
          this.$refs.ruleDialog.show({
            title: '活动规则',
            btns: [{
              text: '我知道了',
              click() {
                that.$refs.ruleDialog.hide();
              },
            }],
          });
        },
      },
    });
  };
});
