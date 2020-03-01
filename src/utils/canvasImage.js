let image = null ;
let context = null ;
let imgX = 0,
    imgY = 0,
    imgScale = 1,
    canvasImage = null,
    dpr; 

let init = ({
    width,
    height,
    urls,
    activeUrl,
    scope
})=>{
    let query = wx.createSelectorQuery().in(scope.$scope);
    let canvas = query.select('#canvasImg');
    canvas.fields({
        node: true,
        size:true
    }).exec((res) =>{
        createCanvas(res,{width,height,urls,scope,activeUrl})
    })

}
const createCanvas = (msgs,props) =>{
    let { activeUrl } = props;
    if(activeUrl){
        let { node } = msgs[0];
        let ctx = node.getContext('2d');
        dpr = wx.getSystemInfoSync().pixelRatio;
        node.width = msgs[0].width * dpr;
        node.height = msgs[0].height * dpr;
        ctx.scale(dpr,dpr);

        canvasImage = node ;
        wx.getImageInfo({
            src: activeUrl,
            success:function(res){
                context = ctx;
                // 创建一个图片
                let img = canvasImage.createImage();
                img.src = activeUrl ;
                img.onload = ()=>{
                    if(img.width > props.width || img.height > props.height ){
                        imgScale = 0.3;
                    }

                    let canvasXCenter = props.width / 2;
                    let canvasYCenter = props.height / 2 ;
                    let imgXCenter = (img.width / 2) * imgScale;
                    let imgYCenter = (img.height / 2) * imgScale;

                    // 将图显示在中央
                    imgX = canvasXCenter - imgXCenter ;
                    imgY = canvasYCenter - imgYCenter;
                    console.log(props.width,img.width,props.height,img.height,props.width - img.width, props.height - img.height)

                    image = img;
                    // 画图
                    updateCanvas(res)
                }
            },
            complete:(err)=>{
                console.log(err)
            }
        })
    }
    
    
}
const updateCanvas = (val)=>{
    let { width ,height} = canvasImage;
    context.clearRect(0, 0, width, height);
    
    context.drawImage( image , 0, 0, 
        val.width,val.height,100 , 100, val.width * 0.5,val.height * 0.5
    )
}

export { init }