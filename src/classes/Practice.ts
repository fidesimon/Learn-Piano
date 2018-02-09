import { PracticeSettings } from "./PracticeSettings";
import { ClefEnum } from "./Enums";
import { CONST } from "./Constants";

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
            document.getElementById(CONST.PIANONotesDiv).innerText = this.getNoteString();
        } else {
            document.getElementById(CONST.PIANONotesDiv).innerText = this.getRecordedNoteString();
        }
    }

    private getRecordedNoteString() {
        var notesString = <HTMLTextAreaElement>document.getElementById(CONST.PIANORecordString);
        var firstNote: string;
        if (notesString.value.length != 0) {
            firstNote = notesString.value[0];
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