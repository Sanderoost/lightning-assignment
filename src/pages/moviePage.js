import { Lightning, Router } from '@lightningjs/sdk';
import { Screens } from '../components/Screens'
import { fetchData } from '../lib/api';

export class moviePage extends Lightning.Component {
    static _template(){
        return{
            Background:{
                rect: true,
                w: 1920,
                h: 1080,
                Overlay: {
                    rect: true,
                    w: 1920,
                    h: 1080,
                    color: 0xff000000,
                    alpha: 0.5
                }
            },
            MainCollumn: {
                rect: true,
                x: 50,
                y: 530,
                w: 1000,
                Text: {
                    y: 100,
                    text: {
                        fontFace: 'Bold',
                        fontSize: 42,
                        wordWrap: true,
                        wordWrapWidth: 1000,                    
                    }
                },
                Information : {
                    y: 170,
                    flex: {
                        justifyContent: 'space-between'
                    },
                    Vote: {
                        text: {
                            text: "Rating: 4,5",
                            fontFace: 'Regular',
                            fontSize: 26,                 
                        }
                    },
                    Count: {
                        flexItem: {
                            marginLeft: 20,
                        },
                        text: {
                            text: "Votes: 28",
                            fontFace: 'Regular',
                            fontSize: 26,                 
                        }
                    },
                    Release: {
                        flexItem: {
                            marginLeft: 20,
                        },
                        text: {
                            text: "Votes: 28",
                            fontFace: 'Regular',
                            fontSize: 26,                 
                        }
                    },

                },
                Similar: {
                    y: 240, 
                    x: 0,
                    text: {
                        text: 'Other movies',
                        fontFace: 'Light',
                        fontSize: 26, 
                    },
                },
                Related: {
                    y: 270, 
                    x: 0,
                    flex: {
                        justifyContent: 'space-between',
                    },
                    Film1: {
                        type: Screens,
                        flexItem:{
                            marginLeft: 0,
                        }
                    },
                    Film2: {
                        type: Screens,
                    },
                    Film3: {
                        type: Screens,
                    },
                    Film4: {
                        type: Screens,
                    }
                }
            },
            SideCollumn:{
                x: 1450,
                y: 0,
                w: 470,
                h: 1080,
                Overlay :{
                    rect: true,
                    w: 4700,
                    h: 1080,
                    color: 0xff4E4E4E,
                    alpha: .5
                },
                Still:{
                    rect: true,
                    h: 410,
                    w: 300,
                    x: 80,
                    y: 50,
                },

                Title: {
                    y: 520,
                    x: 50,
                    text: {
                        text: '',
                        fontFace: 'Regular',
                        fontSize: 28,
                        wordWrap: true,
                        wordWrapWidth: 370,
                        lineHeight: 28,
                    }
                },
                Description: {
                    y: 600,
                    x: 50,
                    text: {
                        fontFace: 'Light',
                        fontSize: 18,
                        wordWrap: true,
                        wordWrapWidth: 370,
                        lineHeight: 35,
                    }
                }
            }
        }
    }
    _onUrlParams(params){
        this.fillPage(params.selected);
    }
    _handleBack(){
        Router.navigate('home');
    }
    _handleLeft(){
        if(this.index > 0) {
            this.index--;
        }
    }
    _handleRight(){
        if(this.index < this.tag('Related').children.length-1) {
            this.index++;
        }
    }
    getActiveItem() {
        return this.tag('Related').children[this.index];
    }
    pageTransition(){
        return 'bottom'; 
    }
    _getFocused(){
        return this.getActiveItem();
    }
    _onChanged(){
        this.getRelated();
    }
    //Get selected title data
    async fillPage(movie){
        let details = await fetchData('https://api.themoviedb.org/3/movie/' + movie + '?api_key=ca4fb0b3337d3c5d161d30e85d1d4cf9&language=en-US');
        this.patch({
            Background: {
                src:"https://image.tmdb.org/t/p/w1280" + details.backdrop_path,
            },
            MainCollumn:{
                Text: {
                    text: {
                        text: details.title,
                    }
                },
                Information: {
                    Vote: {
                        text: {
                            text: "Score: " + details.vote_average,
                        }
                    },
                    Count: {
                        text: {
                            text: "Votes: " + details.vote_count,
                        }
                    },
                    Release: {
                        text: {
                            text: "Released: " + details.release_date,
                        }
                    }
                }
            },
            SideCollumn:{
                Still:{
                    src: "https://image.tmdb.org/t/p/w400" + details.poster_path,
                },
                Title: {
                    text: {
                        text: details.title,
                    }
                },
                Description: {
                    text: {
                        text: details.overview,
                        lineHeight: 20
                    }
                }
            }
        })
    }
    //Get other titles
    async getRelated(){
        // I wanted to randomize which movies would be shown on the movie page. So fetch data from a random page. I'm not that good yet with api handling.
        let data = await fetchData('https://api.themoviedb.org/3/discover/movie?api_key=ca4fb0b3337d3c5d161d30e85d1d4cf9&page=' + Math.floor(Math.random() * 20));        
        let movies = data.results.map(movie => {
                return {
                    title: movie.title,
                    titleId: movie.id,
                    background: "https://image.tmdb.org/t/p/w300" + movie.backdrop_path,
                }
            
        });
  
          this.tag('Related').patch({
            Film1: {
                title: movies[0].title,
                background: movies[0].background,
                titleId: movies[0].titleId,
            },
            Film2: {
                title: movies[1].title,
                background: movies[1].background,
                titleId: movies[1].titleId,
            },
            Film3: {
                title: movies[2].title,
                background: movies[2].background,
                titleId: movies[2].titleId,
            },
            Film4: {
                title: movies[3].title,
                background: movies[3].background,
                titleId: movies[3].titleId,
            }
          });
    }
    _construct(){
        this.index = 0;
    }
}