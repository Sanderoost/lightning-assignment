import { Lightning, Router }from "@lightningjs/sdk"

export class NotFound extends Lightning.Component {
    static _template(){
        return{
            Background: {
                rect: true,
                w: 1920,
                h: 1080,
                color: 0xff241623,
            },
            Text: {
                x: 960,
                y: 540,
                mount: 0.5,
                text: { 
                    text: '404: Not Found'
                }
            },
            Text: {
                x: 960,
                y: 580,
                mount: 0.5,
                text: { 
                    text: 'Press back to return to home'
                }
            }
        }
    }
    _handleBack(){
        Router.navigate('home')
    }
}