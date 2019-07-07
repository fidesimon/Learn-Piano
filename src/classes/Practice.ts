import { PracticeSettings } from "./PracticeSettings";
import { ClefEnum } from "./Enums";
import { CONST } from "./Constants";

export class Practice {
    public CurrentNote: string;
    public CurrentNotes: string;
    public NotesMap: {};
    public Settings: PracticeSettings;
    private _notesString = "`abcdefghijklmn";
    private _flatsString = "àáâãäåæçèéêëìíî";
    private _sharpsString = "ÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞ";
    private _emptyLine = "=";

    public MultipleNotes: boolean = true;
    public NumberOfNotes: number = 10;

    constructor() {
        this.Settings = new PracticeSettings();
        this.CurrentNotes = "";
        this.RenderStaff();
    }

    public RenderStaff(removeNote?: boolean) {
        if (!this.MultipleNotes) {
            if (!this.Settings.PlayRecordedNotes) {
                document.getElementById(CONST.PIANONotesDiv).innerText = this.getNoteString();
            } else {
                document.getElementById(CONST.PIANONotesDiv).innerText = this.getRecordedNoteString();
            }
        }else{
            if (this.CurrentNotes.length > 1 && removeNote == true) {
                this.CurrentNotes = this.CurrentNotes.slice(1);
            } else {
                var newNotes = this.generateRandomNote();
                let noteLocation : number = this._notesString.indexOf(newNotes);

                for (var i = 1; i < this.NumberOfNotes; i++) {
                    let newNote = this.generateRandomNote();
                    while ((Math.abs(noteLocation - this._notesString.indexOf(newNote)) > this.Settings.NoteThreshold)) {
                        newNote = this.generateRandomNote();
                    }
                    newNotes += newNote;
                    noteLocation = this._notesString.indexOf(newNote);
                }
                this.CurrentNotes = newNotes;
            }
            var diff = this.NumberOfNotes - this.CurrentNotes.length;
            var retString = ('==').repeat(diff);
            for(var i = 0; i < this.CurrentNotes.length; i++){
                retString += this.CurrentNotes[i] + "=";
            }
            document.getElementById(CONST.PIANONotesDiv).innerText = retString;
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
        return firstNote;
    }

    public generateRandomNote(): string {
        var noteIndex = Math.floor(Math.random() * (this._notesString.length));

        if (this.Settings.Accidentals) {
            var randForAccidental = Math.floor(Math.random() * 3);
            var accidental = randForAccidental == 0 ? this._flatsString[noteIndex] : randForAccidental == 2 ? this._sharpsString[noteIndex] : "";
            return accidental + this._notesString[noteIndex];
        }
        return this._notesString[noteIndex];
    }

    private getNoteString(): string {
        var newNote = this.CurrentNote;

        //get location of the note so that we can make sure that note is within range of 10 notes from previous one
        var noteLocation : number = this._notesString.indexOf(this.CurrentNote);

        while (this.CurrentNote == newNote || (Math.abs(noteLocation - this._notesString.indexOf(newNote)) < 3)) {
            newNote = this.generateRandomNote();
        }

        this.CurrentNote = newNote;
        return newNote;
    }
}