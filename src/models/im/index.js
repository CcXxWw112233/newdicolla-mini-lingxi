import Taro from '@tarojs/taro';
import { INITIAL_STATE } from './initialState';
import initNimSDK from './initNimSDK';
import { selectFieldsFromIm } from './selectFields';
import {
  handleDependOnState,
  updateStateByReplace,
  updateStateFieldByCover,
  updateStateFieldByExtension
} from './reducers';
import {
  getAllIMTeamList,
  getIMAccount,
  repairTeam
} from './../../services/im/index';
import { isApiResponseOk } from './../../utils/request';
import { onMsg, onTeams } from './actions/index';

function onSendMsgDone(error, msg) {
  console.log('消息未发出_错误:', error, msg);

  Taro.hideLoading()

  if (error) {
    // 被拉黑
    if (error.code === 7101) {
      msg.status = 'fail';
      alert(error.message);
    } else {
      // Taro.showToast({
      //   // title: `发送消息失败: ${String(error)}`,
      //   title: `消息未发出: 请重发`,
      //   icon: 'none',
      //   duration: 2000,
      // });

      msg.status = 'fail';
      onMsg(msg);

      /***
       * 消息发送失败, 重新连接, 并提示用户再次发送
       */
      const { globalData: { store: { getState } } } = Taro.getApp()
      const { im: { nim } } = getState()
      if (nim) {
        nim.disconnect({
          done: () => {
            console.log('断开连接成功');
            setTimeout(() => {
              nim.connect({})
            }, 50)
          }
        })
      }
    }
    return;
  }
  msg.status = 'success';
  onMsg(msg);
}

export { onSendMsgDone };

export default {
  namespace: 'im',
  state: INITIAL_STATE,
  effects: {
    *fetchIMAccount({ }, { call }) {
      const res = yield call(getIMAccount);
      if (isApiResponseOk(res)) {
        const { accid, token } = res.data;
        return {
          account: accid,
          token
        };
      }
    },
    *fetchAllIMTeamList({ }, { select, put, call }) {
      const res = yield call(getAllIMTeamList);
      const { currentBoardId, currentBoard } = yield selectFieldsFromIm(
        select,
        ['currentBoardId', 'currentBoard']
      );
      if (isApiResponseOk(res)) {
        const { data } = res;
        //这里应该是会拿到当前用户的全部组织的所有项目群组数据，
        //但是目前还混有其他数据，所以这里过滤一下
        const filteredAllBoardList = (arr = []) =>
          arr.filter(i => i.type && i.type === '2');

        yield put({
          type: 'updateStateFieldByCover',
          payload: {
            allBoardList: filteredAllBoardList(data)
          },
          desc: 'get all team list.'
        });

        //如果现在在群聊列表，或者群聊界面，那么需要动态更新当前的群聊列表
        if (currentBoardId && currentBoard) {
          const getCurrentBoard = (arr, id) => {
            const ret = arr.find(i => i.board_id === id);
            return ret ? ret : {};
          };
          yield put({
            type: 'updateStateFieldByCover',
            payload: {
              currentBoard: getCurrentBoard(
                filteredAllBoardList(data),
                currentBoardId
              )
            },
            desc: 'im set current board.'
          });

          yield put({
            type: 'checkTeamStatus',
            payload: {
              boardId: currentBoardId
            },
            desc: 'im check team status'
          });
        }
      }
    },
    *repairTeamStatus({ payload }, { select, call, put }) {
      const { id, type, im_id } = payload;
      const { currentBoardImValid } = yield selectFieldsFromIm(
        select,
        'currentBoardImValid'
      );
      const ret = yield call(repairTeam({ id, type }));
      if (isApiResponseOk(ret)) {
        yield put({
          type: 'updateStateFieldByCover',
          payload: {
            currentBoardImValid: Object.assign({}, currentBoardImValid, {
              [im_id]: Object.assign({}, currentBoardImValid[im_id], {
                isValid: true
              })
            })
          },
          desc: 'update currentBoardImValid'
        });
      }
    },
    *checkTeamStatus({ payload }, { select }) {
      // 因为后端将用户的 Im 群聊信息同时保存在了自己的服务器，而且我们实际显示的用户群聊信息是根据是从后端拿到的数据，而不是以 im 服务上的数据
      // 而这两份数据是有可能不一致的，具体表现为从我们后端拿到的数据(allBoardList)里面的具体群数据在 im 服务器上没有注册，或者没有生效。
      // 就可能导致用户虽然可以看到某个群(我们后端数据中拿到了)，但是却不能正常的发送消息(im 服务器上没有注册该群)
      // 因此，下面做的事情是，检查用户可能要打开的群数据是否是 im 服务器上的有效数据，如果无效，调用一个修复数据的接口修复数据
      // 而在群聊列表中依据这里生成的判断数据(currentBoardImValid), 来判定某个具体的群是否有效。

      // 所以，问题的本质是同一份数据，放在了两个地方，而且要维护数据的同步，就会导致蛋疼的情况
      // 这是一种不好的实践。

      const { boardId } = payload;
      const {
        globalData: {
          store: { dispatch }
        }
      } = Taro.getApp();

      const { nim, allBoardList } = yield selectFieldsFromIm(select, [
        'nim',
        'allBoardList'
      ]);

      if (!nim) return
      //获取当前账号的群信息
      yield nim.getTeams({
        done: getTeamsDone
      });

      async function getTeamsDone(error, teams) {
        // if (error) {
        //   Taro.showToast({
        //     title: '获取群聊状态数据失败',
        //     icon: 'none'
        //   });
        //   return;
        // }
        if (!teams || !teams.length) return;

        //处理并存储 teams 信息
        await onTeams(teams);

        //通过从 allBoardList 中拿到当前项目的群聊或者子群聊（如果有）
        const findedBoardInfo = allBoardList.find(i => i.board_id === boardId);
        if (!findedBoardInfo) return;

        const boardIms = [
          findedBoardInfo.im_id
            ? { im_id: findedBoardInfo.im_id, isMainGroup: true, boardId }
            : null
        ]
          .concat(
            findedBoardInfo.childs
              ? findedBoardInfo.childs.map(i => ({
                im_id: i.im_id,
                isMainGroup: false,
                boardId: i.im_group_id
              }))
              : null
          )
          .filter(Boolean);
        if (!boardIms.length) return;

        //验证
        const boardImValidInfo = boardIms.reduce((acc, curr) => {
          const finedInTeams = teams.find(i => i.teamId === curr.im_id);
          const isValid = team => team.valid && team.validToCurrentUser;
          const genValidInfo = (originObj, curr, isValid) =>
            Object.assign({}, originObj, {
              [curr.im_id]: Object.assign({}, curr, { isValid })
            });

          if (finedInTeams && isValid(finedInTeams)) {
            return genValidInfo(acc, curr, true);
          }
          return genValidInfo(acc, curr, false);
        }, {});

        //更新 currentBoardImValid
        //如果当前项目的群聊及其子群聊都是有效的，那么就不需要修复
        //否则，修复群聊，然后更新 currentBoardImValid
        await dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentBoardImValid: boardImValidInfo
          },
          desc: 'update im currentBoardImValid'
        });

        const checkIsAllValid = validInfo =>
          Object.entries(validInfo).every(
            ([_, value]) => value && value['isValid']
          );
        const isAllBoardImValid = checkIsAllValid(boardImValidInfo);

        if (!isAllBoardImValid) {
          for (let item in boardImValidInfo) {
            const { isValid, boardId, isMainGroup, im_id } = boardImValidInfo[
              item
            ];
            if (!isValid) {
              await dispatch({
                type: 'im/repairTeamStatus',
                payload: {
                  im_id,
                  id: boardId,
                  type: isMainGroup ? '2' : '3'
                }
              });
            }
          }
        }
      }
    },
    *initNimSDK({ payload }, { select, put }) {
      const { account, token } = payload;

      const { nim } = yield selectFieldsFromIm(select, 'nim');

      // 单例模式
      // 如果存在 nim 实例，那么先调用 disconnect 方法
      if (nim) {
        nim.disconnect();
      }
      const nimInstance = yield initNimSDK({ account, token });

      yield put({
        type: 'updateStateFieldByCover',
        payload: {
          nim: nimInstance
        },
        desc: 'im init'
      });
    },
    *updateCurrentChatUnreadNewsState({ payload }, { select }) {
      const { im_id } = payload;
      const { nim } = yield selectFieldsFromIm(select, 'nim');
      if (nim) {
        //重置群的未读信息
        nim.resetSessionUnread(im_id);
      }
    },
    *sendImage({ payload }, { select }) {
      const { type, scene, to, tempFilePaths } = payload;
      const { nim } = yield selectFieldsFromIm(select, 'nim');

      for (let i = 0; i < tempFilePaths.length; i++) {
        nim.sendFile({
          type,
          scene,
          to,
          wxFilePath: tempFilePaths[i],
          done: function (err, msg) {
            onSendMsgDone(err, msg);
          }
        });
      }
    },
    *sendAudio({ payload }, { select }) {
      const { scene, to, wxFilePath, type } = payload;
      const { nim } = yield selectFieldsFromIm(select, 'nim');
      nim.sendFile({
        scene,
        to,
        type,
        wxFilePath,
        done: (err, msg) => {
          onSendMsgDone(err, msg);
        }
      });
    },
    *sendMsg({ payload }, { select }) {
      const { scene, to, text } = payload;

      const { nim } = yield selectFieldsFromIm(select, 'nim');
      nim.sendText({
        scene,
        to,
        text,
        // needMsgReceipt: obj.needMsgReceipt || false
        needMsgReceipt: false,
        done: (error, msg) => {
          onSendMsgDone(error, msg);
        }
      });
    },
    *sendPinupEmoji({ payload }, { select }) {
      const { scene, to, pushContent, content } = payload;
      const { nim } = yield selectFieldsFromIm(select, 'nim');

      nim.sendCustomMsg({
        scene,
        to,
        pushContent,
        content: JSON.stringify(content),
        done: (error, msg) => {
          onSendMsgDone(error, msg);
        }
      });
    }
  },
  reducers: {
    handleDependOnState,
    updateStateByReplace,
    updateStateFieldByCover,
    updateStateFieldByExtension
  },
  subscriptions: {
    setup({ dispatch }) {
      // 利用 Taro 提供的全局 发布订阅模式 方法，
      // 监听特定的 im  自定义全局推送消息
      Taro.eventCenter.on('newPush', data => {
        // console.log(data, '++++++++++++++++ Taro.eventCenter.on +++++++++++++++++++++')
      });
    }
  }
};
