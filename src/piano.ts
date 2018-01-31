export class Notes{
    private _notesString: string;
    private _flatsString: string;
    private _sharpsString: string;
    private _emptyLine: string;
    private _clef: string;

    constructor(){
        this.init();
    }
    private init(){
            this._notesString = "`acbdefghijklmn";
            this._flatsString = "àáãâäåæçèéêëìíî"; //to be used to display flat symbol
            this._sharpsString = "ÐÑÓÒÔÕÖ×ØÙÚÛÜÝÞ"; //to be used to display flat symbol 
            this._emptyLine = "=";
            this._clef = "¯"; //¯-bass clef     &-treble clef
    }

    public ChangeClef(clef : string) : void {
        if(clef.toLowerCase() === "bass")
            this._clef = "¯";
        else if(clef.toLowerCase() === "treble")
            this._clef = "&";
    }

    private generateRandomNote() : string{
        return this._notesString[(Math.floor(Math.random() * (this._notesString.length)))];
    }

    public GetNoteString() : string {
        return this._clef + "===" + this.generateRandomNote() + "====";
    }
}

export class HandlerFunctionality{
    private _notesObject : Notes;
    
    constructor(notesObject : Notes){
        this._notesObject = notesObject;
        this.initialize();
    }

    initialize(){
        document.addEventListener('keydown', this.handler.bind(this));
        var clefDropDown = document.getElementById("clefDropDown");
        clefDropDown.addEventListener('change', this.changeClef.bind(this));
    }

    changeClef(){
        var selectedClef = (<HTMLInputElement>document.getElementById("clefDropDown")).value;
        this._notesObject.ChangeClef(selectedClef);
    }

    handler(e){
        var key = window.event ? e.keyCode : e.which;
        if(key == 32){
            var el = document.getElementById("notesDiv");
            el.innerText = this._notesObject.GetNoteString();
        }
    }
}