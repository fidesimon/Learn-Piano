import { WebMidi } from "./../node_modules/@types/webmidi/index";

export enum ClefEnum {
    Bass = "¯",
    Treble = "&"
}

export interface IPianoEventHandling {
    ClefChange(): void;
    AutoPlayChange(): void;
    IntervalChange(): void;
    ManualNoteChange(e: any): void;
}

export interface IPracticeSettings {
    Clef: ClefEnum;
    AutoPlay: boolean;
    Interval: number;
    MidiEnabled: boolean;
    PlayRecordedNotes: boolean;
}

export class PracticeSettings implements IPracticeSettings {
    Clef: ClefEnum;
    AutoPlay: boolean;
    Interval: number;
    MidiEnabled: boolean;
    PlayRecordedNotes: boolean;

    constructor() {
        this.initialize();
    }

    initialize() {
        this.Clef = ClefEnum.Bass;
        this.AutoPlay = false;
        this.Interval = 1000;
        this.PlayRecordedNotes = false;
        this.MidiEnabled = true;
    }
}

export class PianoEventHandlers implements IPianoEventHandling {
    private _practice: Practice;
    private _intervalVal: number;

    constructor(practice: Practice) {
        this._practice = practice;
        this.initialize();
    }

    initialize() {
        this._registerEventHandlers();
        this.ClefChange();
    }

    private _registerEventHandlers() {
        document.addEventListener('keydown', this.ManualNoteChange.bind(this));
        var clefDropDown = document.getElementById("clefDropDown");
        clefDropDown.addEventListener('change', this.ClefChange.bind(this));
        var autoCheckBox = document.getElementById("autoCheckBox");
        autoCheckBox.addEventListener('change', this.AutoPlayChange.bind(this));
        var intervalTextBox = document.getElementById("intervalTextBox");
        intervalTextBox.addEventListener('change', this.IntervalChange.bind(this));
        var playRecordedCheckBox = document.getElementById("playRecordedCheckBox");
        playRecordedCheckBox.addEventListener('change', this.PlayRecordedChange.bind(this));
    }

    PlayRecordedChange() {
        var playRecorded = <HTMLInputElement>document.getElementById("playRecordedCheckBox");
        this._practice.Settings.PlayRecordedNotes = playRecorded.checked;
        var settings = document.getElementById("pianoSettings");

        if (playRecorded.checked) {
            settings.style.display = "none";
        } else {
            settings.style.display = "block";
        }
    }

    ClefChange() {
        var selectedClef = (<HTMLInputElement>document.getElementById("clefDropDown")).value;
        if (selectedClef == "bass") {
            this._practice.Settings.Clef = ClefEnum.Bass;
            this._practice.NotesMap = {
                "`": 36,
                "à`": 35,
                "Ð`": 37,
                "a": 38,
                "áa": 37,
                "Ña": 39,
                "b": 40,
                "âb": 39,
                "Òb": 41,
                "c": 41,
                "ãc": 40,
                "Óc": 42,
                "d": 43,
                "äd": 42,
                "Ôd": 44,
                "e": 45,
                "åe": 44,
                "Õe": 46,
                "f": 47,
                "æf": 46,
                "Öf": 48,
                "g": 48,
                "çg": 47,
                "×g": 49,
                "h": 50,
                "èh": 49,
                "Øh": 51,
                "i": 52,
                "éi": 51,
                "Ùi": 53,
                "j": 53,
                "êj": 52,
                "Új": 54,
                "k": 55,
                "ëk": 54,
                "Ûk": 56,
                "l": 57,
                "ìl": 56,
                "Ül": 58,
                "m": 59,
                "ím": 58,
                "Ým": 60,
                "n": 60,
                "în": 59,
                "Þn": 61
            };
        }
        else {
            this._practice.Settings.Clef = ClefEnum.Treble;
            this._practice.NotesMap = {
                "`": 57,
                "à`": 56,
                "Ð`": 58,
                "a": 59,
                "áa": 58,
                "Ña": 60,
                "b": 60,
                "âb": 59,
                "Òb": 61,
                "c": 62,
                "ãc": 61,
                "Óc": 63,
                "d": 64,
                "äd": 63,
                "Ôd": 65,
                "e": 65,
                "åe": 64,
                "Õe": 66,
                "f": 67,
                "æf": 66,
                "Öf": 68,
                "g": 69,
                "çg": 68,
                "×g": 70,
                "h": 71,
                "èh": 70,
                "Øh": 72,
                "i": 72,
                "éi": 71,
                "Ùi": 73,
                "j": 74,
                "êj": 73,
                "Új": 75,
                "k": 76,
                "ëk": 75,
                "Ûk": 77,
                "l": 77,
                "ìl": 76,
                "Ül": 78,
                "m": 79,
                "ím": 78,
                "Ým": 80,
                "n": 81,
                "în": 80,
                "Þn": 82
            };
        }
        this._practice.RenderStaff();
        document.getElementById("clefDropDown").blur();
    }

    AutoPlayChange() {
        var autoDisplay = <HTMLInputElement>document.getElementById("autoCheckBox");
        this._practice.Settings.AutoPlay = autoDisplay.checked;
        var intervalTextBox = <HTMLInputElement>document.getElementById("intervalTextBox");

        if (autoDisplay.checked) {
            var intervalValue = +(intervalTextBox.value); // +(string) -> TypeScript converts string to number
            intervalTextBox.disabled = false;
            this._startInterval(intervalValue);
        } else {
            intervalTextBox.disabled = true;
            this._stopInterval();
        }
        document.getElementById("autoCheckBox").blur();
    }

    IntervalChange() {
        var intervalTextBox = <HTMLInputElement>document.getElementById("intervalTextBox");
        var interval = +(intervalTextBox.value);
        if (this._intervalVal !== null) { //means that interval is executing
            this._stopInterval();
            this._startInterval(interval);
        }
        document.getElementById("intervalTextBox").blur();
    }

    ManualNoteChange(e) {
        var key = window.event ? e.keyCode : e.which;
        this._practice.RenderStaff();
    }

    private _startInterval(interval: number) {
        this._intervalVal = window.setInterval(this._practice.RenderStaff.bind(this._practice), interval);
    }

    private _stopInterval() {
        window.clearInterval(this._intervalVal);
        this._intervalVal = null;
    }
}

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
        this.context = new AudioContext();

        if ((<MIDINavigator>navigator).requestMIDIAccess)
            (<MIDINavigator>navigator).requestMIDIAccess().then(this.onMIDIInit.bind(this), this.onMIDIReject.bind(this));
        else
            alert("No MIDI support present in your browser. You're gonna have a bad time.");
    }

    private _checkNote(note) {
        if (this._practice.NotesMap[this._practice.CurrentNote] === note) {
            this._practice.RenderStaff();
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
        document.getElementById("notesDiv").innerText = this.getNoteString();
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