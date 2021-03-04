//消息推送的消息体，符合以下模板
//谁(执行人)对什么(对象, 或者说范围，这一点可能不存在，或者说不被提及)做了(行为)什么(行为内容)
//所以，根据这个基本模板
//修正具体的推送条目中不符合模板的信息
//其中的四个要素:
// - 执行人(creator),这个字段是数据中一定会存在的
// - 对象或者范围(range), 这个字段后台没有明确返回，需要根据情况组装，同时有的情况不需要组装这个要素(比如， “andy 完成了一条任务：建个小项目”， 其中就没有范围这个要素)
// - 行为(action), 这个字段，可以直接使用消息体中的 title 字段，如果 title 字段不符合要求， 那么可以 手动添加 actionText 字段来修正
// - 行为内容(content), 这个字段在判定推送消息体中的 action 字段 和 消息体中 content 相对应的时候就不需要修正（比如消息体 {action: 'board.card.update.add', content:{card: {}}},
//    但是，像: {action: 'board.file.upload', content: {board: {}, board_file: {}}}, 这种坑爹的情况(file !== board_file)， 就需要修正

//修正方式:
//range - 添加 rangeCallback 回调函数，用来生成解析数据时的 range 字段
//action - actionText - 字符串
//content - 添加 contentCallback 回调函数，用来生成解析数据时的 conntent 字段，对于符合预期的推送消息体(推送消息体中的 action 字段 和 消息体中 content 相对应),就不需要通过这个回调修正了

//rangeCallback 中占位符字段
const placeholder = "{placeholder}";

//辅助生成 rangeCallback 回调函数
const genRangeObj = (rangeText = "", rangeObj = {}, isNavigate) => {
  return Object.assign(
    {},
    {
      rangeText,
      rangeObj,
      isNavigate
    }
  );
};

//辅助生成 contentCallback 回调函数
const genContentObj = (contentText = "", contentObj = {}, isNavigate) => {
  return Object.assign(
    {},
    {
      contentText,
      contentObj,
      isNavigate
    }
  );
};

const activityConfig = {
  "board.create": {}, // 创建
  "board.delete": {}, // 删除
  "board.update.name": {
    contentCallback: content => {
      const { board } = content;
      return genContentObj(board.name, board);
    }
  }, // 修改名称
  "board.update.description": {
    contentCallback: content => {
      return genContentObj(".", {});
    }
  }, // 修改详情
  "board.meeting.create": {
    actionText: "发起了一条会议"
  }, // 发起会议
  "board.update.user.add": {
    contentCallback: (content, data) => {
      const { creator } = data || {}
      const { rela_users = [], board = {} } = content
      const text = `${creator.name} 邀请了 ${rela_users.join(',')} 加入了 ${board.name} 项目`
      return genContentObj(text, data)
    }
  }, // 添加用户
  "board.update.archived": {}, // 归档
  "board.update.user.quit": {}, // 用户退出项目
  "board.update.user.remove": {}, // 用户被移出项目
  "board.update.app.add": {}, // 项目添加功能
  "board.update.app.remove": {}, // 项目移除功能
  "board.update.user.role": {}, // 设置用户在项目的角色
  "board.update.contentprivilege": {}, // 设置项目内容特权

  "board.content.link.add": {}, // 关联内容添加
  "board.content.link.remove": {}, // 关联内容移除
  "board.content.link.update": {}, // 关联内容名称修改

  "board.card.create": {
    actionText: "创建了一个任务"
  }, // 创建
  "board.card.delete": {}, // 删除
  "board.card.update.description": {}, // 修改描述
  "board.card.update.name": {}, // 修改名称
  "board.card.update.startTime": {}, // 修改开始时间
  "board.card.update.dutTime": {}, // 修改结束时间
  "board.card.update.finish": {}, // 标记完成
  "board.card.update.finish.child": {}, // 标记子任务完成
  "board.card.update.cancel.finish": {}, // 取消完成
  "board.card.update.cancel.finish.child": {}, // 取消子任务完成
  "board.card.update.archived": {}, // 归档任务
  "board.card.update.executor.add": {}, // 添加执行人
  "board.card.update.executor.remove": {}, // 移除执行人
  "board.card.update.file.add": {}, // 添加附件
  "board.card.update.file.remove": {}, // 移除附件
  "board.card.update.label.add": {
    rangeCallback: content => {
      const { card } = content;
      return genRangeObj(`对任务 ${placeholder}`, card, true);
    },
    contentCallback: content => {
      const { rela_data } = content;
      return genContentObj(rela_data.name, rela_data);
    }
  }, // 添加标签
  "board.card.update.label.remove": {
    rangeCallback: content => {
      const { card } = content;
      return genRangeObj(`对任务 ${placeholder}`, card, true);
    },
    contentCallback: content => {
      const { rela_data } = content;
      return genContentObj(rela_data.name, rela_data);
    }
  }, // 移除标签
  "board.card.update.contentprivilege": {}, // 设置任务内容特权

  "board.card.list.group.add": {}, // 新增分组
  "board.card.list.group.remove": {}, // 移除分组
  "board.card.list.group.update.name": {}, // 更新分组名
  "board.card.list.group.update.contentprivilege": {}, // 设置任务分组内容特权

  "board.card.update.comment.add": {}, // 添加评论
  "board.card.update.comment.remove": {}, // 移除评论
  "board.card.comment.at.notice": {}, //任务评论@通知

  "board.file.comment.add": {
    contentCallback: content => {
      const { file_comment } = content;
      return genContentObj(file_comment.text, file_comment);
    },
    rangeCallback: content => {
      const { board_file } = content;
      return genRangeObj(`对 ${placeholder}`, board_file);
    }
  }, //添加评论
  "board.file.comment.at.notice": {}, //文件评论@通知
  "board.file.upload": {
    actionText: "上传了一个文件",
    contentCallback: content => {
      const { board_file } = content;
      return genContentObj(board_file.name, board_file);

      return Object.assign({}, content, { file: board_file });
    }
  }, //文件上传
  "board.file.version.upload": {}, //文件版本更新上传
  "board.file.remove.recycle": {}, //文件移除到回收站
  "board.folder.remove.recycle": {}, //文件夹移除到回收站
  "board.file.move.to.folder": {}, //移动文件
  "board.file.copy.to.folder": {}, //复制文件
  "board.folder.add": {}, //添加文件夹
  "board.file.update.contentprivilege": {}, // 设置文件内容特权
  "board.folder.update.contentprivilege": {}, // 设置文件夹内容特权

  "board.flow.tpl.add.or.delete": {}, //创建或删除流程模板
  "board.flow.instance.initiate": {}, //启动流程
  "board.flow.instance.delete": {}, //删除流程
  "board.flow.instance.discontinue": {}, //中止流程
  "board.flow.task.pass": {}, //通过
  "board.flow.task.reject": {}, //驳回
  "board.flow.task.recall": {}, //撤回
  "board.flow.task.reassign": {}, //重新指派审批人
  "board.flow.task.attach.upload": {}, //流程附件上传
  "board.flow.cc.notice": {}, //流程抄送通知
  "board.flow.update.contentprivilege": {}, // 设置流程内容特权

  "board.flow.comment.add": {}, //流程评论
  "board.flow.comment.remove": {}, //流程评论删除

  "meeting.create": {}, // 创建了会议

  "permission.alter": {}, // 权限变更

  "organization.member.apply": {} // 申请加入组织
};

export default activityConfig;
