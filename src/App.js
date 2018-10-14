import React, {Component} from 'react';
import './App.scss';
import imageDatas from './data/imageData.json'
import ImgFigure from './component/ImgFigure.js'
import ReactDOM from 'react-dom'

class App extends Component {

    constructor(props) {
        super(props);
        this.getImageURL(imageDatas);
        this.state = {
            imgsArrangeArr: []
        };
    }

    getRangeRandom = (low, height) => {
        return Math.ceil(Math.random() * (height - low) + low);
    };

    Constant = {
        centerPos: {
            left: 0,
            right: 0
        },
        hPosRange: {
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: {
            x: [0, 0],
            topY: [0, 0]
        }
    };

    get30DegRandom() {
        return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
    }

    rearrange = (centerIndex) => {
        let {imgsArrangeArr} = this.state;
        let Constant = this.Constant;
        let centerPos = Constant.centerPos;
        let hPosRange = Constant.hPosRange;
        let vPosRange = Constant.vPosRange;
        let hPosRangeLeftSecX = hPosRange.leftSecX;
        let hPosRangeRightSecX = hPosRange.rightSecX;
        let hPosRangeY = hPosRange.y;
        let vPosRangeTopY = vPosRange.topY;
        let vPosRangeX = vPosRange.x;

        let imgsArrangeTopArr = [];
        let topImgNum = Math.floor(Math.random() * 2);
        let topImgSpliceIndex = 0;

        let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 居中centerIndex的图片
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        };
        // 取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局上侧的图片
        imgsArrangeTopArr.forEach((value, index) => {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: this.get30DegRandom(),
                isCenter: false
            };
        });
        // 布局左右两侧的图片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null;
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }
            imgsArrangeArr[i] = {
                pos: {
                    top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: this.get30DegRandom(),
                isCenter: false
            }
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        this.setState({imgsArrangeArr: imgsArrangeArr});
    };

    componentDidMount() {
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage);
        let stageW = stageDOM.scrollWidth;
        let stageH = stageDOM.scrollHeight;
        let halfStageW = Math.ceil(stageW / 2);
        let halfStageH = Math.ceil(stageH / 2);

        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
        let imgW = imgFigureDOM.scrollWidth;
        let imgH = imgFigureDOM.scrollHeight;
        let halfImgW = Math.ceil(imgW / 2);
        let halfImgH = Math.ceil(imgH / 2);

        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(Math.ceil(Math.random() * 15));
    }

    getImageURL = (imageDatasArr) => {
        for (let i = 0, j = imageDatasArr.length; i < j; i++) {
            let singleImageData = imageDatasArr[i];
            singleImageData.imageURL = require('./images/' + singleImageData.fileName);
            imageDatasArr[i] = singleImageData;
        }
        return imageDatasArr;
    };

    inverse = (index) => {
        return () => {
            let imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            })
        }
    };

    center = (index) => {
        return () => {
            this.rearrange(index);
        }
    };

    render() {
        let controllerUnits = [];
        let imgFigures = [];
        imageDatas.forEach((value, index) => {
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0, top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                };
            }
            imgFigures.push(<ImgFigure key={index}
                                       data={value}
                                       ref={'imgFigure' + index}
                                       arrange={this.state.imgsArrangeArr[index]}
                                       inverse={this.inverse(index)}
                                       center={this.center(index)}/>);
        });

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}

export default App;
