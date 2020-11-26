import Taro, { Component } from '@tarojs/taro';
import { View ,Canvas ,Image,CoverView ,Button} from '@tarojs/components';

import styles from './index.scss'

export default class DrawCanvas extends Component {
  constructor(props){
    super(props);
    this.state = {
        img: '',
        screenW: '',
        // width: '',
        // height: '',
        distance: '',
        old_width: '',
        old_height: '',
        cut_: '',
        x: 0,
        y: 0,
        crop_pic: '',
        disable: false,
        imgScale:"",


        src:"",
        // width: '',
        width:"",
        height: '',
        scaled:1,
        style:{},
        addStyle:{},
        canvasWidth:null,
        canvasHeight:null,
        showCover:false
    }
    this.imgX = 0;
    this.imgY = 0;
    this.ctx = null;
    this.maxScale = 2.3;
    this.minScale = 1;
    this.obj = {
      img:null,
      canvas:null ,
      maxHeight:wx.getSystemInfoSync().screenHeight - 40,
      maxWidth: wx.getSystemInfoSync().screenWidth,

    }
    this.data = {
      _hypotenuse_length:0,
      scale:1,
    }
    this.start = [{
      x:null,
      y:null,
    }]
  }
  componentDidMount(){
    //判断图片的宽高，短的那边变成固定，长的自适应。
    wx.getSystemInfo({
      success: res => {
          const screenH = res.screenHeight,
              screenW = res.screenWidth,
              cut_ = screenW - 4;
          let that = this;
          that.setState({
              screenW: screenW,
              cut_: cut_,
              screenH: screenH
          })
      },
    })

    setTimeout(()=>{
      let { sourceType } = this.props;
      let { screenW ,screenH,scaled} = this.state;
      wx.chooseImage({
        sourceType:sourceType,
        success:(res)=>{
          this.getImage(res);
        }
      })

    })
  }

  imageIsScale = (img)=>{
    console.log(img)
    // 图片大小刚好和屏幕大小一致
    if(this.obj.maxWidth / this.obj.maxHeight == img.width/ img.height ){
      return "full"
    }else if(this.obj.maxWidth < img.width && this.obj.maxHeight < img.height){
      // 图片大于屏幕大小
      return "max"
    }else{
      // 图片小于屏幕
      return "min"
    }
  }
  // 获取图片信息
  getImage = (picture)=>{
    let that = this;
    let src = picture.tempFilePaths[0];
    let width = this.obj.maxWidth,height = this.obj.maxHeight;
    let {scaled} = this.state;
    wx.getImageInfo({
      src:src,
      success:(msg)=>{
        let img_w = msg.width,
            img_h = msg.height,
            scale = img_w / img_h,
            rpx = this.obj.maxWidth / this.obj.maxHeight == img_w / img_h;
            // console.log(this.obj.maxWidth / this.obj.maxHeight,img_w / img_h)
        //横向图片,宽不变
        //横向图片，高变成固定，宽度自适应
        // if(rpx){
        //   // 图片比例和屏幕比例一致
        //   img_top = 0.1;
        //   img_left = 0.1;
        // }
        let text = this.imageIsScale(msg);
        if(text == 'max' || text == 'full'){
          if (scale > 1) {
            let sc = this.obj.maxWidth / img_w;
            let sctop = img_h * sc;
            let scleft = img_w * sc;
            let img_left = Math.abs(width / 2 - this.obj.maxWidth / 2), img_top = Math.abs(height / 2 - (sctop) / 2);

            this.setState({
              src : src,
              style:{
                left: img_left,
                top: img_top,
                width: this.obj.maxWidth
              }
            },()=>{
              setTimeout(()=>{
                this.drawImage(src);
              },10)
            })
              // that.setState({
              //     width: scale * width,
              //     height: height,
              //     old_width: scale * width,
              //     old_height: height,
              //     img: src
              // })
          } else { //纵向图片，短边是宽，宽变成系统固定，高自适应
            let sc = this.obj.maxHeight / img_h;
            let sctop = img_h * sc;
            let scleft = img_w * sc;

            let img_left = Math.abs(width / 2 - scleft / 2), img_top = Math.abs(height / 2 - (sctop) / 2);
            this.setState({
              src : src,
              style:{
                left: img_left,
                top: img_top,
                height: this.obj.maxHeight,
              }
            },()=>{
              setTimeout(()=>{
                this.drawImage(src);
              },10)

            })

              // that.setState({
              //     width: width,
              //     height: height / scale,
              //     old_width: width,
              //     old_height: height / scale,
              //     img: src
              // })
          }
        }else if(text == 'min'){
          let left = Math.abs(width/2 -img_w/2), top = Math.abs(height/2 - img_h / 2);
          this.setState({
            src:src,
            style:{
              left: left,
              top:top,
              height: img_h,
              width:img_w
            }
          },()=>{
            setTimeout(()=>{
              this.drawImage(src);
            },10)

          })
        }

        // this.getCanvas(src);
      }
    })
  }
  imgLoad = (e)=>{
    console.log(e)
  }
  getCanvas = (src)=>{

  }

  onStart =(e)=>{
    // console.log(e)
    // console.log(e,this.state)

    if(e.touches.length == 1){
      this.start = [{
        x:e.touches[0].clientX - this.state.style.left,
        y:e.touches[0].clientY - this.state.style.top,
      }]
    }else
    if(e.touches.length == 2){
      let width = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
      let height = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
      this.start = [{
        x:e.touches[0].clientX - this.state.style.left,
        y:e.touches[0].clientY - this.state.style.top,
      },{
        x:e.touches[1].clientX - this.state.style.left,
        y:e.touches[1].clientY - this.state.style.top,
      }]
      this.data._hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
      console.log(this.data._hypotenuse_length)
    }
  }
  onMove = (e)=>{
    if(e.touches.length == 1){
      let { style: {top,left} } = this.state;
      let cleft = (e.touches[0].clientX - this.start[0].x),
      ctop = (e.touches[0].clientY - this.start[0].y);


      left += (cleft)*3;
      top += (ctop)*3;
      this.start[0].x = e.touches[0].clientX;this.start[0].y = e.touches[0].clientY;
      if(Math.abs(cleft) > 10|| Math.abs(cleft) > 10){
        return ;
      }
      this.setState({
        style:{
          ...this.state.style,
          top,
          left
        }
      })
    }
    if(e.touches.length == 2){
      let width = (Math.abs(e.touches[0].clientX - e.touches[1].clientX)),
            height = (Math.abs(e.touches[0].clientY - e.touches[1].clientY)),
            hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)),
            scale = this.data.scale * (hypotenuse / this.data._hypotenuse_length);
            // console.log(scale)
            if(scale > this.data.maxScale){
              scale = this.data.maxScale
            }
            if(scale <= this.minScale){
              scale = this.minScale
            }

            this.data.scale = scale;
            this.data._hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
            this.setState({
              scaled: scale
            })
    }
  }
  onEnd = (e)=>{
    this.start[0].x = e.changedTouches[0].clientX;this.start[0].y = e.changedTouches[0].clientY;
  }
  drawImage = (src)=>{
    let { style:{left,top} } = this.state;
    let query = wx.createSelectorQuery().in(this.$scope);
    let canvas = query.select('#canvasImg');
    canvas.fields({
        node: true,
        size:true
    }).exec((res)=>{
      let node = res[0].node;
      let img = node.createImage();
      img.src = src;
      img.onload = ()=>{
        let { style } = this.state;
        // this.drawImage(node,img ,res)
        let ctx = node.getContext('2d');
        let ctxStyle = {
          width:0,
          height:0
        }

        let tt = wx.getSystemInfoSync().screenWidth,scale=1,ht = this.obj.maxHeight;
        //
        if(this.obj.maxWidth / this.obj.maxHeight == img.width/ img.height){
          ctxStyle.width = this.obj.maxWidth;
          ctxStyle.height = this.obj.maxHeight;
        }else if(this.obj.maxWidth / this.obj.maxHeight < img.width/ img.height) {
          if(img.width > tt || img.height> ht){
            if(img.width > img.height){
              scale = tt/ img.width ;
            }else{
              scale = ht/ img.height;
            }
          }
          ctxStyle.width = img.width * scale;
          ctxStyle.height = img.height * scale;
        }else{

        }
        this.setState({
          canvasWidth:img.width * scale,
          canvasHeight:img.height * scale
        })

        node.width = ctxStyle.width;
        node.height = ctxStyle.height;
        ctx.drawImage( img , 0,0, ctxStyle.width, ctxStyle.height)
        this.setShow();
      }

      // this.obj.img = img;
      // this.obj.canvas = node;
      // let {width,height ,imgScale,screenW} = this.state;
      // let ctx = canvas.getContext('2d');
      // this.ctx = ctx;
      // let dpr = wx.getSystemInfoSync().pixelRatio;
      // canvas.width = res[0].width * dpr;
      // canvas.height = res[0].height * dpr;
      // ctx.scale(dpr,dpr);

      // imgScale = screenW / 375;
      // if(img.width > 375 * imgScale){
      //   ctx.scale(375 * imgScale / img.width, 375 * imgScale / img.width)
      // }
      // this.draw()
    })

  }
  draw =() =>{
    let { img ,canvas} = this.obj;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.drawImage(img, this.imgX,this.imgY, img.width ,img.height );
  }
  setShow = ()=>{
    setTimeout(()=>{
      this.setState({
        showCover:true
      })
    },1000)
  }

  render(){
    let { src ,style,addStyle,
      canvasWidth,
      canvasHeight,showCover} = this.state;
    let { scale } = this.data;
    return (
      <View className={styles.canvasView}>
        { <CoverView className={styles.coverviewbox}>
          <Button>12321</Button>
          <CoverView className={styles.editImageBtn}>
            编辑
          </CoverView>
        </CoverView>}
        <Image src={src}  onTouchStart={this.onStart}
        mode="scaleToFill"
        onLoad={this.imgLoad}
        onTouchMove={this.onMove} onTouchEnd={this.onEnd}
        style={{transform:`translate(${style.left+'px' } ,${style.top+'px'}) scale(${scale})`,
        height:style.height ? style.height +'px':"",width:style.width ? style.width +'px':"",
        transitionDuration:'0.1s',
        ...addStyle
        }}
        className={styles.previewImage}/>
        <Canvas type='2d' id="canvasImg" disable-scroll='true' canvas-id='canvasImg'
        style={{
          transform:`translate(${style.left+'px' } ,${style.top+'px'}) scale(${scale})`,
          transitionDuration:'0.1s',
          width:canvasWidth+'px',
          height:canvasHeight +'px',
          ...addStyle,
          pointerEvents:"none",
          zIndex:0
        }}
        className={styles.previewImage}>

        </Canvas>
      </View>
    )
  }

}
