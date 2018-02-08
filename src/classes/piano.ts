import { WebMidi } from "./../../node_modules/@types/webmidi/index";
import { PracticeSettings, ClefEnum } from "./PracticeSettings";
import { PianoEventHandlers } from "./PianoEventHandlers";

export interface MIDINavigator extends Navigator {
    requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>;
}

export class MidiComponent {
    context = null;   // the Web Audio "context" object
    midiAccess = null;  // the MIDIAccess object.
    activeNotes = []; // the stack of actively-pressed keys
    private _practice: Practice;

    constructor(practice: Practice) {
        this._practice = practice;
        

        this.linkRefreshButton();
        this.initialize();
    }

    private linkRefreshButton(){
        var refreshLink = document.getElementById("midiRefresh");
        refreshLink.addEventListener('click', this.initialize.bind(this));
    }

    private initialize() {
        this.midiAccess = null;
        this.context = new AudioContext();
        if ((<MIDINavigator>navigator).requestMIDIAccess) {
            (<MIDINavigator>navigator).requestMIDIAccess().then(this.onMIDIInit.bind(this), this.onMIDIReject.bind(this));
        } else {
            alert("No MIDI support present in your browser. You're gonna have a bad time.");
        }
    }

    private _checkNote(note) {
        if (this._practice.NotesMap[this._practice.CurrentNote] === note) {
            this._practice.RenderStaff();
        }
    }

    onMIDIInit(midi) {
        this.midiAccess = midi;
        var midiDeviceSpanElement = document.getElementById("midiDevice");

        var haveAtLeastOneDevice = false;
        var inputs = this.midiAccess.inputs.values();
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = this.MIDIMessageEventHandler.bind(this);
            haveAtLeastOneDevice = true;
            midiDeviceSpanElement.innerText = input.value.name;
        }
        if (!haveAtLeastOneDevice){
            midiDeviceSpanElement.innerText = "None";
        }else{
            var input = inputs[0];
        }
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
        this._checkNote(noteNumber);
        this.activeNotes.push(noteNumber);
    }

    noteOff(noteNumber) {
        var position = this.activeNotes.indexOf(noteNumber);
        if (position != -1) {
            this.activeNotes.splice(position, 1);
        }
    }
}

export class Piano {
    _practice: Practice;
    _eventHandlers: PianoEventHandlers;
    _midiComponent: MidiComponent;

    constructor() {
        this._practice = new Practice();
        this._eventHandlers = new PianoEventHandlers(this._practice);
        this._midiComponent = new MidiComponent(this._practice);
    }
}

export class Practice {
    public CurrentNote: string;
    public NotesMap: {};
    public Settings: PracticeSettings;
    private _notesString = "`abcdefghijklmn";
    private _flatsString = "àáâãäåæçèéêëìíî";
    private _sharpsString = "ÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞ";
    private _emptyLine = "=";

    constructor() {
        this.Settings = new PracticeSettings();
        this.RenderStaff();
    }

    public RenderStaff() {
        if (!this.Settings.PlayRecordedNotes) {
            document.getElementById("notesDiv").innerText = this.getNoteString();
        } else {
            document.getElementById("notesDiv").innerText = this.getRecordedNoteString();
        }
    }

    private getRecordedNoteString() {
        var notesString = <HTMLTextAreaElement>document.getElementById("recordString");
        var firstNote: string;
        if (notesString.value.length != 0) {
            firstNote = notesString.value[0];//.charAt(0);
            notesString.value = notesString.value.substr(1);
        } else {
            firstNote = "=";
        }
        this.CurrentNote = firstNote;
        return this.Settings.Clef + "===" + firstNote + "====";
    }

    private generateRandomNote(): string {
        var randForAccidental = Math.floor(Math.random() * 3);
        var noteIndex = Math.floor(Math.random() * (this._notesString.length));
        var accidental = randForAccidental == 0 ? this._flatsString[noteIndex] : randForAccidental == 2 ? this._sharpsString[noteIndex] : "";
        return accidental + this._notesString[noteIndex];
    }

    private getNoteString(): string {
        var newNote = this.CurrentNote;

        while (this.CurrentNote == newNote) {
            newNote = this.generateRandomNote();
        }

        this.CurrentNote = newNote;
        return this.Settings.Clef + (newNote.length == 1 ? "===" : "==") + newNote + "====";
    }
}

export class RecordNotes {
    private _recordStarted: false;
    private _recordingMap: {};


}