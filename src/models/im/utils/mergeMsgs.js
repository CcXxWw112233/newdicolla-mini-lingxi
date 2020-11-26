
const mergeMsg = ({
  a =[],
  b = [] ,
  akey = 'id' ,
  bkey ='id' ,
  coverKey = [] ,
  cover = false ,
  assign = {}
})=>{
  if(!cover){
      let arr = [],notInarr = [];
      for(let i = 0; i< b.length ; i++){
          let item = b[i];
          for(let n = 0 ;n < a.length; n++){
              let ls = a[n];
              if(item[bkey] === ls[akey]){
                  arr.push(item[bkey]);
                  let obj = item;
                  ls.to = obj.to ;
                  ls.scene = obj.scene;
                  if(obj.lastMsg && obj.lastMsg.type != 'notification'){
                      ls.lastMsg = obj.lastMsg ;
                  }else{
                      ls.lastMsg = ls.lastMsg ;
                  }
                  ls.msgReceiptTime = obj.msgReceiptTime ;
                  ls.updateTime = obj.updateTime;
                  ls.from = obj.from ;
                  // 有人艾特我
                  if(ls.lastMsg && ls.lastMsg.apns){
                      ls.apns = ls.lastMsg.apns ;
                  }else if(+ls.unread > 0){
                      ls.apns = ls.apns
                  }else if(!(+ls.unread)){
                      ls.apns = void 0;
                  }
              }
          }
      }
      b.forEach(item => {
          if(arr.indexOf(item[bkey]) == -1){
              item && notInarr.push(item)
          }
      })
      // console.log(arr)
      a = a.concat(notInarr);
      return a ;
  }
}
export default mergeMsg ;
