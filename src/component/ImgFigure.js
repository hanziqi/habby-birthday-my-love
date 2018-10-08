import React, {Component} from 'react';
import '../App.scss';

class ImgFigure extends Component {

    constructor(props) {
        super(props);
    }

    handleClick = (e) => {
        this.props.inverse();
        e.stopPropagation();
        e.preventDefault();
    };

    render() {
        let styleObj = {};
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }
        // if (this.props.arrange.rotate) {
        //     styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)'
        // }
        if (this.props.arrange.rotate) {
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        let imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
        return (
            <figure className={imgFigureClassName}
                    style={styleObj}
                    onClick={this.handleClick}>
                <img src={this.props.data.imageURL}
                     alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}

export default ImgFigure;