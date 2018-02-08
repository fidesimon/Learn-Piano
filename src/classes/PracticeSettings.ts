import { ClefEnum } from "./Enums";

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