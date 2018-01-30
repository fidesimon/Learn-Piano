export class Notes{
    private _notesString: string;
    private _flatsString: string;
    private _sharpsString: string;
    private _emptyLine: string;
    constructor(){
        this.init();
    }
    private init(){
            this._notesString = "`acbdefghijklmn";
            this._flatsString = "àáãâäåæçèéêëìíî"; //to be used to display flat symbol
            this._sharpsString = "ÐÑÓÒÔÕÖ×ØÙÚÛÜÝÞ"; //to be used to display flat symbol 
            this._emptyLine = "=";
            //¯-bass clef     &-treble clef
    }

    private generateRandomNote() : string{
        return this._notesString[(Math.floor(Math.random() * (this._notesString.length)))];
    }

    public GetNoteString() : string {
        return "¯===" + this.generateRandomNote() + "====";
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
    }

    handler(e){
        var key = window.event ? e.keyCode : e.which;
        if(key == 32){
            var el = document.getElementById("notesDiv");
            el.innerText = this._notesObject.GetNoteString();
        }
    }
}