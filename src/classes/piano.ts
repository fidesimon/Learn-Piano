import { PracticeSettings, ClefEnum } from "./PracticeSettings";
import { PianoEventHandlers } from "./PianoEventHandlers";
import { MidiComponent } from "./MidiComponent";
import { Practice } from "./Practice";

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