export class LCG {
    private seed: number;
    private multipler: number;
    private increment: number;
    private modules: number;
    private state: number;
    constructor(params :{
        seed: number;
        multiplier: number;
        increment: number;
        modules: number;
    }) {
        this.seed = params.seed ? params.seed : 1;
        this.multipler = params.multiplier ? params.multiplier : 16807;
        this.increment = params.increment ? params.increment : 0;
        this.modules = params.modules ? params.modules : 2147483647;

        if ( this.multipler <= 0) { throw Error("`multiplier` must be strictly larger than 0"); }
        if ( this.multipler >= this.modules) { throw Error("`multiplier` must be smaller than `modulus`"); }
        if ( this.increment < 0) { throw Error("`increment` must not be negative"); }
        if ( this.increment >= this.modules ) { throw Error("`increment` must be smaller than `modulus`"); }
        if ( this.seed < 0 ) { throw Error("`seed` must not be negative"); }
        if ( this.seed >= this.modules ) { throw Error("`seed` must be smaller than `modulus`"); }
        if ( this.seed === 0 && this.increment === 0) {
            throw Error("`seed` cannot be 0 if `increment` is 0");
        }
        this.state = Math.abs(this.seed);
    }
    
    public get random(): number {
        var result = ( this.state * this.multipler + this.increment) % this.modules;
        this.state = result;
        return result;
    }
}