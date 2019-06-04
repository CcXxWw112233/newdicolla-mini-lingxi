# title

## hyf_交接部分

### 负责的功能模块：

#### 数据层

- im
    相关文件:
    - src/gloalSet/js/imConfig.js
        : im 配置文件，主要作用是针对不同后台环境，切换 im 线上环境
    - models/im
        : actions - 主要是 im 实例化相关回调的处理函数
        : config - 一些需要配置的 im 数据，目前主要是生成 emoji 数据  
        : demo - im 这部分基于 im 服务提供商云信的一个[原生小程序demo](https://github.com/netease-im/NIM_Web_Weapp_Demo)，这里存放着一些从里面扒下来的参考片段(这些片段在编译的时候会被忽略的,当然如果觉得碍眼，也可以直接删掉，到用的时候直接在仓库里找就可以了)
        : utils - 一些处理数据的工具函数
        : indexs.js - im model 的入口文件
            * 这里采用 [dva](https://dvajs.com/guide/#%E7%89%B9%E6%80%A7)(一个基于 react, redux, redux-saga的数据流框架工具)的写法，model层的一个配置文件包括：namespace(命名空间, model 分成的概念可以参考[redux](https://www.redux.org.cn/))；state(状态);effects(处理副作用(例如数据获取等))；reducers(根据 dispatch 的 action， 更新 state)；subscriptions(监听软件的某些状态，更新 state数据，或者处理一些副作用)  
        : initialState.js - model 初始 state  
        : initNimSDK.js - 初始化 im 连接，及绑定数据回调到 im 实例。  
        : reducers - 抽象出来的 reducers 函数，因为这里的 reducer 几乎只是根据 action 里的数据替换或更新 state 的状态，所以通用性是很高的
        : selectFields.js - 抽象 dva - effects 获取 state 字段的函数
    - - services/im - 一些数据请求接口函数

- chat
    : chat 页面抽象出来的一些公共 state

#### 页面

- src/pages/boardDetail - 项目详情页面,同时也是 im 的入口
- src/pages/chat        - 聊天页面
- src/pages/chatDetail  - 聊天详情页面（也就是聊天室的一些信息展示）
- src/pages/im          - 没什么用，因为 im 的入口在 boardDetail

### 模块思路简介

#### im

- 需求:
    满足以项目为单位的沟通场景,和 pc 端消息推送的显示(消息推送需要混合到聊天数据流中)
- 分析:
    1. 现状与说明：
        - im 服务器 - 网易云信
        - im 代码实现参考 - [网易云信原生小程序demo]((https://github.com/netease-im/NIM_Web_Weapp_Demo))
        - 其中 im SDK 初始化主要参考了 demo ，包括数据层的处理逻辑和代码风格。
        - 只实现群聊场景，p2p 形式的实现还没有。
    2. 数据流：
        - 基于现有的资源(包括服务器，后台和开发时间),实现满足一般场景的聊天功能。
        - im 数据来源包括 im 云信服务器 和 自己的后台
        - 其实 im 功能的实现思路是比较简单的，主要思路是：程序启动的时候，连接云信服务器，初始化一个 ws 连接(src/models/im/initNimSDK.js)(这里注意要是单例模式)，连接成功后，im 实例会自动返回一些初始数据，根据添加的回调，接收初始化的数据，然后处理(目前主要集中在 onMsg 和 onUpdateSession)，保存到 im - model中(src/models/im/index.js)，之后有任何需要更改云信服务器数据的操作(比如聊天消息的发送，自定义消息的接收)，都可以通过保存下来的 im 实例(src/models/im/index[state][nim])上的方法来实现.这是处理 im 云信服务器的数据的大致流程。
        - 处理自己后台的数据，主要是需要获取一份当前用户的所有项目的数据，里面包含了每个项目注册在 云信服务器上的对应的聊天群的(im_id),我们通过这份数据来渲染当前用户的项目群聊页面。这里的主要的坑在于：这份数据显示的群聊信息(通过 im_id)和 云信服务器上的群信息数据可能是不一致的(主要体现在，后台数据的群在云信服务器的群并未实际注册成功)就会导致数据异常。所以如果出现这种情况就需要调用一个后台接口去修复(src/models/im/index.js[effects][repairTeamStatus])
    3. 页面：
        - 页面和 react 的写法类似，但是也存在一些限制(具体可以参考 Taro 官网)
        - 以展示组件为主(组件可以分为容器组件和展示组件：展示组件 + 状态 = 容器组件)。然后通过 '@tarojs/redux' 提供的 'connect' 函数，将 model 层的数据和 展示组件连接起来。
        - Redux 示例中强调的 “在顶层保持一个容器组件” 是错误的。不要把这个当做准则。让你的展现层组件保持独立。然后创建容器组件并在合适时进行连接。当你感觉到你是在父组件里通过复制代码为某些子组件提供数据时，就是时候抽取出一个容器了。只要你认为父组件过多了解子组件的数据或者 action，就可以抽取容器。[redux 官网](https://www.redux.org.cn/docs/faq/ReactRedux.html)
