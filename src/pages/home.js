import { Lightning, Router }from "@lightningjs/sdk";
import { fetchData } from "../lib/api";
import { Cards } from "../components/cards"

export class Home extends Lightning.Component {
    static _template(){
      return{
          Background: {
              rect: true,
              w: 1920,
              h: 1080,
              color: 0xff241623,
            },
            Container: {
              rect: true,
              x: 140,
              y: 480,
              mountY: .5,
              color: 0xff241623,
              flex: {
                wrap: false,
              },
            }
        }
    }
    _handleLeft(){
      if(this.index > 0) {
          this.index--;
          this.tag('Container').animation({
            duration: .3,
            actions: [
              {
                p: 'x',
                v: {
                  0: this.tag('Container').x,
                  1: this.tag('Container').x + 340
                }
              }
            ]
          }).start();
      }
    }
    _handleRight(){
        if(this.index < this.tag('Container').children.length-1) {
            this.index++;
            this.tag('Container').animation({
              duration: .3,
              actions: [
                {
                  p: 'x',
                  v: {
                    0: this.tag('Container').x,
                    1: this.tag('Container').x - 340
                  }
                }
              ]
            }).start();
        }
    }
    getActiveItem() {
        return this.tag('Container').children[this.index];
    }
    _getFocused(){
        return this.getActiveItem();
    }
    pageTransition(){
        return 'top'; 
    }  
    async _construct(){
      this.index = 0;
      let data = await fetchData('https://api.themoviedb.org/3/discover/movie?api_key=ca4fb0b3337d3c5d161d30e85d1d4cf9&primary_release_year=2022');
        let movies = data.results.map(movie => {
          return {
              type: Cards,
              title: movie.title,
              titleId: movie.id,
              poster: "https://image.tmdb.org/t/p/w400" + movie.poster_path,
            }
          });
        let tempChildren = this.tag('Container').children;
        this.tag('Container').patch({
          children: tempChildren.concat(movies)
        })
    }
  }