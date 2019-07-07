import { ClefEnum } from "./Enums";

export interface IPracticeSettings {
    Clef: ClefEnum;
    AutoPlay: boolean;
    Accidentals: boolean;
    Interval: number;
    MidiEnabled: boolean;
    PlayRecordedNotes: boolean;
    NoteThreshold: number;
}

export class PracticeSettings implements IPracticeSettings {
    Clef: ClefEnum;
    AutoPlay: boolean;
    Accidentals: boolean;
    Interval: number;
    MidiEnabled: boolean;
    PlayRecordedNotes: boolean;
    NoteThreshold: number;

    constructor() {
        this.initialize();
    }

    initialize() {
        this.Clef = ClefEnum.Bass;
        this.AutoPlay = false;
        this.Accidentals = false;
        this.Interval = 1000;
        this.PlayRecordedNotes = false;
        this.MidiEnabled = true;
        this.NoteThreshold = 50;
    }
}