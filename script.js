/**@type{HTMLCanvasElement} */
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

let radius=40

let canvasPosition = canvas.getBoundingClientRect()

let trashImage=new Image()
trashImage.src='https://cdn3.iconfinder.com/data/icons/linecons-free-vector-icons-pack/32/trash-512.png'

let mode='draw'
let label=1

let snapAudio=new Audio()
snapAudio.src='Finger Snap.wav'

let deleteX=0
let deleteY=0

let mouseX=0
let mouseY=0

let inRangeX=0
let inRangeY=0

let brushArmlength=0

let mouseDownTime=0

let armNumber=0

let space=false
let hydrogenFixed=false

let newestMoleculeIdx=0

let panX=0
let panY=0

let newDetectedIDX=0
let newDetectedARM=0
let newDetectedMLCIDX=0
let newDetectedMLCIDXCan=0

let moleculeX=0
let moleculeY=0

let dx=0
let dy=0
let distance=0

let moleculeRadius=30

let mouseDownX=0
let mouseDownY=0

let mouseDown=false

let brush = 1

const moleculeArray=[]

const detectorArray=[]

class Molecule{
    constructor(x,y,idx){
        this.x=x
        this.y=y
        if (brush==1) {
            this.fillStyle='black'
            this.strokestyle='black'
            this.label='C'
        } else {
            this.fillStyle='blue'
            this.strokestyle='blue'
            this.label='H'
        }
        this.distance=0
        this.dx=0
        this.dy=0
        this.brushType=brush



        this.moleculeRadius=brushArmlength/3
        this.armLength=brushArmlength


        this.armNumber=armNumber

        this.idx=idx
        this.noArms=hydrogenFixed

        if(this.idx==newDetectedMLCIDX){
            this.x=moleculeX
            this.y=moleculeY
        }

        if(this.brushType==1){
            detectorArray.push(new Detector(this.x-3+this.armLength,this.y-3, 1, this.idx,this.armLength))
            detectorArray.push(new Detector(this.x-3-this.armLength,this.y-3, 2, this.idx,this.armLength))
            detectorArray.push(new Detector(this.x-3,this.y-3+this.armLength, 3, this.idx,this.armLength))
            detectorArray.push(new Detector(this.x-3,this.y-3-this.armLength, 4, this.idx,this.armLength))
        }else{
            detectorArray.push(new Detector(this.x-3,this.y-3-this.armLength, 4, this.idx,this.armLength))
        }





    }
    calculate(){
        this.dx=mouseX-this.x
        this.dy=mouseY-this.y
        this.distance=Math.sqrt((this.dx*this.dx)+(this.dy*this.dy))
        this.distance=Math.round(this.distance)
        if(newDetectedIDX==this.idx){
            moleculeX=this.x
            moleculeY=this.y
        }
    }
    update(){


    }
    draw(){


        ctx.beginPath()
        ctx.lineWidth=2
        ctx.strokeStyle=this.strokestyle
        ctx.fillStyle=this.fillStyle
        if(this.brushType==1){
            ctx.moveTo(this.x-moleculeRadius/2,this.y-moleculeRadius/2)
            ctx.lineTo(this.x-moleculeRadius/2,this.armLength+this.y-moleculeRadius/2)
    
            ctx.moveTo(this.x-moleculeRadius/2,this.y-moleculeRadius/2)
            ctx.lineTo(this.x-moleculeRadius/2,-this.armLength+this.y-moleculeRadius/2)
    
            ctx.moveTo(this.x-moleculeRadius/2,this.y-moleculeRadius/2)
            ctx.lineTo(this.armLength+this.x-moleculeRadius/2,this.y-moleculeRadius/2)
    
            ctx.moveTo(this.x-moleculeRadius/2,this.y-moleculeRadius/2)
            ctx.lineTo(-this.armLength+this.x-moleculeRadius/2,this.y-moleculeRadius/2)
        }else{
            if(this.armNumber==1){
                ctx.moveTo(this.x-moleculeRadius/2,this.y-moleculeRadius/2)
                ctx.lineTo(-this.armLength+this.x-moleculeRadius/2,this.y-moleculeRadius/2)
            }else{
                if(this.armNumber==2){
                    ctx.moveTo(this.x-moleculeRadius/2,this.y-moleculeRadius/2)
                    ctx.lineTo(this.armLength+this.x-moleculeRadius/2,this.y-moleculeRadius/2)
                }else{
                    if(this.armNumber==3){
                        ctx.moveTo(this.x-moleculeRadius/2,this.y-moleculeRadius/2)
                        ctx.lineTo(this.x-moleculeRadius/2,-this.armLength+this.y-moleculeRadius/2)
                    }else{
                        ctx.moveTo(this.x-moleculeRadius/2,this.y-moleculeRadius/2)
                        ctx.lineTo(this.x-moleculeRadius/2,this.armLength+this.y-moleculeRadius/2)
                    }
                }
            }
        }
        ctx.stroke()

        ctx.beginPath()
        ctx.fillStyle=this.fillStyle
        ctx.arc(this.x-moleculeRadius/2,this.y-moleculeRadius/2,this.moleculeRadius,0,Math.PI*2,false)

        ctx.fill()

        ctx.beginPath()

        if(label==1){
            ctx.fillStyle='white'
            if(this.brushType==1){
                ctx.beginPath()
                ctx.font='30px verdana'
                ctx.fillText(this.label, this.x-27, this.y-3, 99999000)
            }else{
                ctx.beginPath()
                ctx.font='13px verdana'
                ctx.fillText(this.label, this.x-20, this.y-10, 99999000)
            }
        }

    }

}


class Detector{
    constructor(x,y,armNumber, moleculeIDX, armLength){
        this.moleculeIdx=moleculeIDX
        this.armNumber=armNumber
        this.armLength=0
        this.bondDistance=armLength+brushArmlength
        this.x=x
        this.y=y
        this.dx=0
        this.dy=0
        this.distance=0
        this.range=10
        this.fillStyle='blue'
    }

    calculate(){
        this.dx=this.x-mouseX
        this.dy=this.y-mouseY
        this.distance=Math.sqrt((this.dx**2)+(this.dy**2))
    }
    update(){
        this.bondDistance=this.armLength+brushArmlength
        if(this.distance<this.range){
            newDetectedIDX=this.moleculeIdx
            newDetectedARM=this.armNumber
            newDetectedMLCIDX=newDetectedMLCIDXCan
            if(this.armNumber==1){
                inRangeX=this.x+3+this.bondDistance
                inRangeY=this.y+3

            }else{
                if(this.armNumber==2){

                    inRangeX=this.x+3-this.bondDistance
                    inRangeY=this.y+3


                }else{
                    if(this.armNumber==3){
                        inRangeX=this.x+3
                        inRangeY=this.y+3+this.bondDistance

                    }else{
                        inRangeX=this.x+3
                        inRangeY=this.y+3-this.bondDistance
                    }
                }
            }
            hydrogenFixed=true
        armNumber=this.armNumber


        }
        if (this.distance<this.range) {
            this.fillStyle='#3AFF00'
        } else {
            this.fillStyle='white'
        }
        ctx.beginPath()
        ctx.fillStyle=this.fillStyle
        ctx.arc(this.x-1-this.range,this.y-1-this.range,this.range,0,2*Math.PI,false)
        ctx.fill()



    }
}

function loop(){
    armNumber=3
    inRangeX=mouseX
    inRangeY=mouseY
    hydrogenFixed=false
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawOptions()
    detectorArray.forEach(detector=>{
        detector.calculate()
        detector.update()})

        if(space){
            // moleculeArray.push(new Molecule(mouseX,mouseY,newDetectedMLCIDXCan))

        }
    moleculeArray.forEach(dot=>{
        dot.calculate()
        dot.update()
        dot.draw()})


        if (brush==1) {
            brushArmlength=15.4*3
            
        } else {
            brushArmlength=7.4*3
            
        }

    requestAnimationFrame(loop)

}

function drawOptions(){
    ctx.fillStyle='lightgray'
    if(mouseX<310){
        panX+=0.2*(0-panX)
    }else{
        panX+=0.2*(-350-panX)
    }
    ctx.fillRect(panX,panY,300,canvas.height)

    ctx.beginPath()
    ctx.fillStyle='gray'

    ctx.arc(panX+150,100,radius,0,2*Math.PI,'false')
    ctx.fill()
    dx=(panX+150)-mouseX
    dy=100-mouseY
    distance=sqrt(dx**2+dy**2)
    if(distance<radius){
        if(mouseDown){
            brush=1
        }
    }
    ctx.beginPath()
    ctx.fillStyle='blue'
    ctx.arc(panX+150,250,radius,0,2*Math.PI,'false')
    dx=(panX+150)-mouseX
    dy=250-mouseY
    distance=sqrt(dx**2+dy**2)
    if(distance<radius){
        if(mouseDown){
            brush=2
        }
    }

    ctx.fill()

    ctx.drawImage(trashImage,0,0,512,512,panX+10,790,100,100)
    dx=(panX+60)-mouseX
    dy=790-mouseY
    distance=sqrt(dx**2+dy**2)
    console.log(distance)

    if(distance<50){
        if(mouseDown){
            moleculeArray.splice(0,moleculeArray.length)
            detectorArray.splice(0,detectorArray.length)
        }
    }
    ctx.beginPath()
    ctx.fillStyle='white'
    ctx.roundRect(panX+10,750,180,-70,10)
    ctx.fill()
    ctx.fillStyle='black'
    ctx.font='50px Arial Black'
    ctx.fillText('label', panX+20, 730, 9999999)

    dx=(panX+100)-mouseX
    dy=750-35-mouseY
    distance=sqrt(dx**2+dy**2)
    if(distance<100){
        if(mouseDownTime==1){
            if (label==1) {
                label=0
            } else {
                label=1
            }
        }
    }


}

function sqrt(x){
    return(Math.sqrt(x))
}

document.addEventListener('click', function(){

    if((mouseX<300)==false){
        newDetectedMLCIDXCan=getRandomInt(100000,999999)
    
        moleculeArray.unshift(new Molecule(inRangeX,inRangeY, newDetectedMLCIDXCan))
        snapAudio.play()

    }
})


document.addEventListener('mousemove',function(e){
    mouseX=e.x-canvasPosition.left
    mouseY=e.y-canvasPosition.top
})

document.addEventListener('mousedown',function(e){
    mouseDownX=mouseX
    mouseDownY=mouseY
    mouseDown=true
    mouseDownTime++
})
document.addEventListener('mouseup',function(){
    mouseDown=false
    mouseDownTime=0
})

document.addEventListener('keydown', function(e){
    if(e.key==' '){
        space=true
    }

})

document.addEventListener('keyup', function(e){
    if(e.key==' '){
        space=false
    }
})


function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }


loop()
