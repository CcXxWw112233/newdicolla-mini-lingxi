// 配置
let envir = 'online';
let ENVIRONMENT_CONFIG = {};
let configMap = {
  test: {
    appkey: 'dee48072f1b3a1f3f6946c705c8b3f63 ',
    // appkey: '686986c5995dde50e3872d43f14c3ee1',
    postUrl: 'https://apptest.netease.im'
  },
  pre: {
    // appkey: '45c6af3c98409b18a84451215d0bdd6e',
    appkey: 'c3abea191b7838ff65f9a6a44ff5e45f',
    url: 'http://preapp.netease.im:8184'
  },
  online: {
    //appkey: '4cef922e6d1507726a859b84bc09b3cd', //测试
    // appkey: 'c5cb5fb73e7a86be378bb8b42d9e450a', //预发布
    appkey: 'c3abea191b7838ff65f9a6a44ff5e45f',   //正式环境
    postUrl: 'https://app.netease.im'
  }
};
ENVIRONMENT_CONFIG = configMap[envir];
// 是否开启订阅服务
ENVIRONMENT_CONFIG.openSubscription = true;
ENVIRONMENT_CONFIG.privateConf = {
  lbs_web: 'http://59.111.108.145:8281/lbs/webconf.jsp',
  link_ssl_web: false,
  nos_uploader_web: 'http://59.111.108.145:10080',
  https_enabled: false,
  nos_downloader: '59.111.108.145:10080/{bucket}/{object}',
  nos_accelerate: '',
  nos_accelerate_host: '',
  nt_server: ''
};
// 是否开启私有化部署
ENVIRONMENT_CONFIG.openPrivateConf = false;

export default ENVIRONMENT_CONFIG;
