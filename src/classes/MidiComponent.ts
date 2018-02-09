import { WebMidi } from "./../../node_modules/@types/webmidi/index";
import { Practice } from "./Practice";
import { CONST } from "./Constants";

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
        var refreshLink = document.getElementById(CONST.MIDIRefreshElement);
        refreshLink.addEventListener('click', this.initialize.bind(this));
    }

    private initialize() {
        this.midiAccess = null;
        this.context = new AudioContext();
        if ((<MIDINavigator>navigator).requestMIDIAccess) {
            (<MIDINavigator>navigator).requestMIDIAccess().then(this.onMIDIInit.bind(this), this.onMIDIReject.bind(this));
        } else {
            alert("No MIDI support present in your browser.");
        }
    }

    private _checkNote(note) {
        if (this._practice.NotesMap[this._practice.CurrentNote] === note) {
            this._practice.RenderStaff();
        }
    }

    onMIDIInit(midi) {
        this.midiAccess = midi;
        var midiDeviceSpanElement = document.getElementById(CONST.MIDIDeviceElement);

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
        alert("The MIDI system failed to start.");
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