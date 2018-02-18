export class Score {
    public NotesPlayed: number;
    public CorrectNotes: number;
    
    constructor() {
        this.NotesPlayed = 0;
        this.CorrectNotes = 0;
    }

    public GetAccuracy(): string{
        var score = ((this.CorrectNotes / this.NotesPlayed) * 100).toFixed(2);
        return score;
    }
}