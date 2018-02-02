import { WebMidi } from "./../node_modules/@types/webmidi/index";

export class Notes {
    private _notesString: string;
    public NotesString: string;
    public NotesArrayMIDI: any;
    private _flatsString: string;
    private _sharpsString: string;
    private _emptyLine: string;
    private _clef: string;
    private _autoDisplay: boolean;
    private _refreshInterval: number;
    public CurrentNote: string;

    constructor() {
        this.init();
    }
    private init() {
        this._notesString = "`abcdefghijklmn";
        this.NotesString = "`abcdefghijklmn";
        this.NotesArrayMIDI = [36, 38, 40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60];
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
        if (clef.toLowerCase() === "bass") {
            this._clef = "¯";
            this.NotesArrayMIDI = [36, 38, 40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60];
        }
        else if (clef.toLowerCase() === "treble") {
            this._clef = "&";
            this.NotesArrayMIDI = [57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81];
        }
    }

    private generateRandomNote(): string {
        var newNote = this._notesString[(Math.floor(Math.random() * (this._notesString.length)))];
        if(this.CurrentNote === newNote)
            this.generateRandomNote();
        else {
            this.CurrentNote = newNote;
        }
        return newNote;
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
        var xx = new MidiHandlers();
        xx.init(this._notesObject);

        document.addEventListener('keydown', this.handler.bind(this));
        var clefDropDown = document.getElementById("clefDropDown");
        clefDropDown.addEventListener('change', this.changeClef.bind(this));
        var autoCheckBox = document.getElementById("autoCheckBox");
        autoCheckBox.addEventListener('change', this.autoTrigger.bind(this));
        var intervalTextBox = document.getElementById("intervalTextBox");
        intervalTextBox.addEventListener('change', this.updateInterval.bind(this));
    }

    updateInterval() {
        var intervalTextBox = <HTMLInputElement>document.getElementById("intervalTextBox");
        var interval = +(intervalTextBox.value);
        if (this._intervalVal !== null) { //means that interval is executing
            this.stopInterval();
            this.startInterval(interval);
        }
    }

    renderNote() {
        document.getElementById("notesDiv").innerText = this._notesObject.GetNoteString();
    }

    startInterval(interval: number) {
        this._intervalVal = window.setInterval(this.renderNote.bind(this), interval);
    }

    stopInterval() {
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
        this.renderNote();
    }

    handler(e) {
        var key = window.event ? e.keyCode : e.which;
        if (key == 32) {
            var el = document.getElementById("notesDiv");
            el.innerText = this._notesObject.GetNoteString();
        }
    }
}
export interface MIDINavigator extends Navigator {
    requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>;
}
export class MidiHandlers {
    context = null;   // the Web Audio "context" object
    midiAccess = null;  // the MIDIAccess object.
    activeNotes = []; // the stack of actively-pressed keys
    private _notesObject: Notes;

    init(obj) {
        //window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this._notesObject = obj;//new Notes();
        this.context = new AudioContext();

        if ((<MIDINavigator>navigator).requestMIDIAccess)
            (<MIDINavigator>navigator).requestMIDIAccess().then(this.onMIDIInit.bind(this), this.onMIDIReject.bind(this));
        else
            alert("No MIDI support present in your browser. You're gonna have a bad time.");
    }

    renderNote(note) {
        var index = this._notesObject.NotesString.indexOf(this._notesObject.CurrentNote);

        if (index === this._notesObject.NotesArrayMIDI.indexOf(note)) {
            document.getElementById("notesDiv").innerText = this._notesObject.GetNoteString();
        }
    }

    onMIDIInit(midi) {
        this.midiAccess = midi;

        var haveAtLeastOneDevice = false;
        var inputs = this.midiAccess.inputs.values();
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = this.MIDIMessageEventHandler.bind(this);
            haveAtLeastOneDevice = true;
        }
        if (!haveAtLeastOneDevice)
            alert("No MIDI input devices present. You're gonna have a bad time.");
    }

    onMIDIReject(err) {
        alert("The MIDI system failed to start. You're gonna have a bad time.");
    }

    MIDIMessageEventHandler(event) {
        // Mask off the lower nibble (MIDI channel, which we don't care about)
        switch (event.data[0] & 0xf0) {
            case 0x90:
                if (event.data[2] != 0) {  // if velocity != 0, this is a note-on message
                    this.noteOn(event.data[1]);
                    return;
                }
            // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
            case 0x80:
                this.noteOff(event.data[1]);
                return;
        }
    }

    noteOn(noteNumber) {
        this.renderNote(noteNumber);
        this.activeNotes.push(noteNumber);
    }

    noteOff(noteNumber) {
        var position = this.activeNotes.indexOf(noteNumber);
        if (position != -1) {
            this.activeNotes.splice(position, 1);
        }
    }
}