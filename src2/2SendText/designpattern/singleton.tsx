export default class Singleton {
    private static instance: Singleton = new Singleton;
    private variable : any;
    public static getInstance(): Singleton {
        return Singleton.instance;
    }
    public setVariable(obj : any){
        if (!this.variable){
            this.variable = obj
        }
    }
    public getVariable() : any{
        return this.variable
    }
 }