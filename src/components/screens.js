/* eslint-disable prettier/prettier */
import { Lightning, Router } from "@lightningjs/sdk";

export class Screens extends Lightning.Component{
    static _template() {
        return{
            rect: true,
            h: 200,
            w: 300,
            alpha: .9,
            src: this.bindProp('background'),
            Overlay: {
              rect: true,
              w: 300,
              h: 200,
              color: 0xff000000,
              alpha: 0.3
            },
            flexItem: {
              margin: 20,
            },
            Text: {
                y: 100,
                x: 120,
                alpha: 0,
                text: {
                    text: this.bindProp('title'),
                    fontFace: 'Regular',
                    fontSize: 20,
                    wordWrap: true,
                    wordWrapWidth: 180,
                    textAlign: 'right',
                }
            }
        }
    }
    _handleEnter() {
        Router.navigate('movie/' + this.titleId )
    }
    _focus(){
        this.tag("Text").animation({
            duration: .3,
            actions: [
              {
                p: 'alpha',
                v: {
                  0: 0,
                  1: 1,
                }
            },
        ]
        }).start();
        this.patch({
            alpha: 1,
            scale: 1.04,
            Overlay:{
              alpha: 0.1
            }
        })
    }
    _unfocus(){
          this.tag("Text").animation({
            duration: .3,
            actions: [
              {
                p: 'alpha',
                v: {
                  0: 1,
                  1: 0,
                }
            },
        ]
        }).start();
          this.patch({
            alpha: 0.9,
            scale: 1,
            Overlay:{
              alpha: 0.3
            }
        })
    }
}
