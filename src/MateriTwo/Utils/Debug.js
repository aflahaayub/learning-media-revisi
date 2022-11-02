// import * as dat from 'lil-gui'
import * as dat from 'dat.gui'

export default class Debug
{
    constructor()
    {
        // this.ui = new dat.GUI()
        // console.log(this.ui.add)
        this.active = window.location.hash === '#debug'

        if(this.active)
        {
            this.ui = new dat.GUI()
        }
    }
}