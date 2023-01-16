import { Boot } from "../pages/Boot"
import { Home } from "../pages/Home"
import { NotFound } from "../pages/NotFound"
import { moviePage } from "../pages/moviePage"


export default {
    routes : [
        {
            path: '$',
            component: Boot
        },
        {
            path: '*',
            component: NotFound,
        },
        {
            path: 'home',
            component: Home,
        },
        {
            path: 'movie',
            component: moviePage,
            reuseInstance: false,
        },
        {
            path: 'movie/:selected',
            component: moviePage,
            reuseInstance: false,
        }
    ]
}