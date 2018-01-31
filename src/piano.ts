export class Notes {
    private _notesString: string;
    private _flatsString: string;
    private _sharpsString: string;
    private _emptyLine: string;
    private _clef: string;
    private _autoDisplay: boolean;
    private _refreshInterval: number;

    constructor() {
        this.init();
    }
    private init() {
        this._notesString = "`acbdefghijklmn";
        this._flatsString = "àáãâäåæçèéêëìíî"; //to be used to display flat symbol
        this._sharpsString = "ÐÑÓÒÔÕÖ×ØÙÚÛÜÝÞ"; //to be used to display flat symbol 
        this._emptyLine = "=";
        this._clef = "¯"; //¯-bass clef     &-treble clef
        this._autoDisplay = false;
        this._refreshInterval = 1000;
    }

    SetDisplayType(auto: boolean): void {
        this._autoDisplay = auto;
    }

    public ChangeClef(clef: string): void {
        if (clef.toLowerCase() === "bass")
            this._clef = "¯";
        else if (clef.toLowerCase() === "treble")
            this._clef = "&";
    }

    private generateRandomNote(): string {
        return this._notesString[(Math.floor(Math.random() * (this._notesString.length)))];
    }

    public GetNoteString(): string {
        return this._clef + "===" + this.generateRandomNote() + "====";
    }
}

export class HandlerFunctionality {
    private _notesObject: Notes;
    private _intervalVal: number;

    constructor(notesObject: Notes) {
        this._notesObject = notesObject;
        this.renderNote();
        this.initialize();
    }

    initialize() {
        document.addEventListener('keydown', this.handler.bind(this));
        var clefDropDown = document.getElementById("clefDropDown");
        clefDropDown.addEventListener('change', this.changeClef.bind(this));
        var autoCheckBox = document.getElementById("autoCheckBox");
        autoCheckBox.addEventListener('change', this.autoTrigger.bind(this));
        var intervalTextBox = document.getElementById("intervalTextBox");
        intervalTextBox.addEventListener('change', this.updateInterval.bind(this));
    }

    updateInterval(){
        var intervalTextBox = <HTMLInputElement>document.getElementById("intervalTextBox");
        var interval = +(intervalTextBox.value);
        if(this._intervalVal !== null){ //means that interval is executing
            this.stopInterval();
            this.startInterval(interval);
        }
    }

    renderNote(){
        document.getElementById("notesDiv").innerText = this._notesObject.GetNoteString();
    }

    startInterval(interval: number) {
        this._intervalVal = window.setInterval(this.renderNote.bind(this), interval);
    }

    stopInterval(){
        window.clearInterval(this._intervalVal);
        this._intervalVal = null;
    }

    autoTrigger() {
        var autoDisplay = <HTMLInputElement>document.getElementById("autoCheckBox");
        this._notesObject.SetDisplayType(autoDisplay.checked);
        var intervalTextBox = <HTMLInputElement>document.getElementById("intervalTextBox");

        if (autoDisplay.checked) {
            var intervalValue = +(intervalTextBox.value); // +(string) -> TypeScript converts string to number
            intervalTextBox.disabled = false;
            this.startInterval(intervalValue);
        } else {
            intervalTextBox.disabled = true;
            this.stopInterval();
        }
    }

    changeClef() {
        var selectedClef = (<HTMLInputElement>document.getElementById("clefDropDown")).value;
        this._notesObject.ChangeClef(selectedClef);
    }

    handler(e) {
        var key = window.event ? e.keyCode : e.which;
        if (key == 32) {
            var el = document.getElementById("notesDiv");
            el.innerText = this._notesObject.GetNoteString();
        }
    }
}