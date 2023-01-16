import { Lightning,Utils, Router } from "@lightningjs/sdk";

export class Boot extends Lightning.Component {
    static _template() {
        return {
            Background: {
                rect: true,
                w: 1920,
                h: 1080,
                color: 0xff241623
            },
            Logo: {
              x: 960,
              y: 540,
              mount: 0.5,            
              aplha: 0,
              src: Utils.asset('images/24i.png'),
            },
        }
    }  
    _init(){
        this.animation = this.tag('Logo').animation({
            duration: 2,
            actions: [
              {
                p: 'alpha',
                v: {
                  0: 0,
                  1: 1
                }
              }
            ]
          }).start();
        setTimeout(() => {
                Router.navigate('home')
          }, 3000)
    }
}