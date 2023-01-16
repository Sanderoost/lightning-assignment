/* eslint-disable prettier/prettier */
import { Lightning,Utils, Router } from "@lightningjs/sdk";

export class Cards extends Lightning.Component{
    static _template() {
        return{
            rect: true,
            h: 500,
            w: 340,
            alpha: .5,
            src: this.bindProp('poster'),
            flexItem: {
                margin: 30,
            },
            Text: {
                y: 510,
                x: 20,
                text: {
                    text: this.bindProp('title'),
                    fontFace: 'Regular',
                    fontSize: 22,
                    wordWrap: true,
                    wordWrapWidth: 300,
                }
            }
        }
    }
    _handleEnter() {        
        Router.navigate('movie/' + this.titleId )
    }
    _focus(){
        this.patch({
            scale: 1.05,
            alpha: 1,
        })
    }
    _unfocus(){
        this.patch({
            scale: 1,
            alpha: .5,
        })
    }
}
