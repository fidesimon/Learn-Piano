import { Practice } from "./Practice";
import { ClefEnum } from "./Enums";
import { CONST } from "./Constants";
import { notImplemented } from "@angular/core/src/render3/util";

export interface IPianoEventHandling {
    ClefChange(): void;
    AutoPlayChange(): void;
    IntervalChange(): void;
    ManualNoteChange(e: any): void;
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
        var clefDropDown = document.getElementById(CONST.PIANOClefDropDown);
        clefDropDown.addEventListener('change', this.ClefChange.bind(this));
        var autoCheckBox = document.getElementById(CONST.PIANOAutoCheckBox);
        autoCheckBox.addEventListener('change', this.AutoPlayChange.bind(this));
        var accidentalsCheckBox = document.getElementById(CONST.PIANOAccidentalsCheckBox);
        accidentalsCheckBox.addEventListener('change', this.AccidentalsChange.bind(this));
        var intervalTextBox = document.getElementById(CONST.PIANOIntervalTextBox);
        intervalTextBox.addEventListener('change', this.IntervalChange.bind(this));
        var playRecordedCheckBox = document.getElementById(CONST.PIANOPlayRecordedCheckBox);
        playRecordedCheckBox.addEventListener('change', this.PlayRecordedChange.bind(this));
        var startButton = document.getElementById(CONST.PIANOStartButton);
        startButton.addEventListener('click', this.StartRecorded.bind(this));
    }

    AccidentalsChange(){
        var accidentals = <HTMLInputElement>document.getElementById(CONST.PIANOAccidentalsCheckBox);
        this._practice.Settings.Accidentals = accidentals.checked;
    }

    StartRecorded() {
        var startButton = document.getElementById(CONST.PIANOStartButton);
        var recordString = <HTMLTextAreaElement>document.getElementById(CONST.PIANORecordString);
        if (recordString.value == "") {
            alert("please provide the record string");
            return;
        }
        startButton.textContent = "Stop";

    }

    PlayRecordedChange() {
        var playRecorded = <HTMLInputElement>document.getElementById(CONST.PIANOPlayRecordedCheckBox);
        this._practice.Settings.PlayRecordedNotes = playRecorded.checked;
        var settings = document.getElementById(CONST.PIANOSettingsDiv);
        var recordDiv = document.getElementById(CONST.PIANORecordDiv);

        if (playRecorded.checked) {
            settings.style.display = "none";
            recordDiv.style.display = "block";
        } else {
            settings.style.display = "block";
            recordDiv.style.display = "none";
        }
    }

    ClefChange() {
        var selectedClef = (<HTMLInputElement>document.getElementById(CONST.PIANOClefDropDown)).value;
        var clefElement = document.getElementById(CONST.PIANOClefDiv);
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
        clefElement.innerText = this._practice.Settings.Clef;
        //this._practice.RenderStaff();
        document.getElementById(CONST.PIANOClefDropDown).blur();
    }

    AutoPlayChange() {
        var autoDisplay = <HTMLInputElement>document.getElementById(CONST.PIANOAutoCheckBox);
        this._practice.Settings.AutoPlay = autoDisplay.checked;
        var intervalTextBox = <HTMLInputElement>document.getElementById(CONST.PIANOIntervalTextBox);
        var pianoIntervalDiv = document.getElementById(CONST.PIANOIntervalDiv);

        if (autoDisplay.checked) {
            var intervalValue = +(intervalTextBox.value); // +(string) -> TypeScript converts string to number
            intervalTextBox.disabled = false;
            pianoIntervalDiv.style.display = "block";
            this._startInterval(intervalValue);
        } else {
            intervalTextBox.disabled = true;
            pianoIntervalDiv.style.display = "none";
            this._stopInterval();
        }
        document.getElementById(CONST.PIANOAutoCheckBox).blur();
    }

    IntervalChange() {
        var intervalTextBox = <HTMLInputElement>document.getElementById(CONST.PIANOIntervalTextBox);
        var interval = +(intervalTextBox.value);
        if (this._intervalVal !== null) { //means that interval is executing
            this._stopInterval();
            this._startInterval(interval);
        }
        document.getElementById(CONST.PIANOIntervalTextBox).blur();
    }

    ManualNoteChange(e) {
        var key = window.event ? e.keyCode : e.which;
        if (e.keyCode == 32) {
            this._practice.RenderStaff();
        }
    }

    private _startInterval(interval: number) {
        this._intervalVal = window.setInterval(this._practice.RenderStaff.bind(this._practice), interval);
    }

    private _stopInterval() {
        window.clearInterval(this._intervalVal);
        this._intervalVal = null;
    }
}