import {
    Component,
    Output,
    EventEmitter,
} from '@angular/core';
import {ColorPicker} from './color-picker'

@Component({
    selector: 'note-creator',
    directives: [ColorPicker],
    styles: [`
        .note-creator {
          padding: 20px;
          background-color: white;
          border-radius: 3px;
        }
        .title {
          font-weight: bold;
          color: rgba(0,0,0,0.8);
        }
        .full {
          height: 100px;
        }
    `
    ],
    template: `
	<div 
	[ngStyle]="{'background-color':newNote.color}" 
	class="note-creator shadow-2">
	<pre *ngIf ="fullForm">{{ newNote | json }}</pre>
      <form class="row" (submit)="onCreateNote()">
        <input
          type="text"
          *ngIf ="fullForm"
          [ngModel]="newNote.title"
          (ngModelChange)="onNewNoteChange(0,$event)"
          name="newNoteTitle"
          placeholder="Title"
          class="col-xs-10 title"
        >
        <input
          (focus)="toggle(true)"
          type="text"
          [ngModel]="newNote.value"
          (ngModelChange)="onNewNoteChange(1,$event)"
          name="newNoteValue"
          placeholder="Take a note..."
          class="col-xs-10"
        >
        <div 
            class="actions col-xs-12 row between-xs"
            *ngIf ="fullForm"
            >
            <div class="col-xs-3">
            <color-picker [colors]="colors"
            (selected)="onColorSelect($event)"></color-picker>
            </div>
            <button 
            (click)="onCancel()"
            class="btn-light"
           >
            Cancel
          </button>
          <button 
            [disabled]="!showDone"
            type="submit"
            class="btn-light"
           >
            Done
          </button>
        </div>
      </form>
    </div>
`
})
export class NoteCreator {

    ngOnInit() {
        this.showDone = false;
    }

    colors:Array<string> = ['white', 'seagreen', 'lightblue', 'pink'];
    newNote = {title: '', value: '', color: 'white'};
    fullForm:boolean = false;
    showDone:boolean = false;

    onNewNoteChange(index, titleData) {
        switch (index) {
            case 0:
                this.newNote.title = titleData;
                break;
            case 1:
                this.newNote.value = titleData;
                break;
        }
        const {title, value} = this.newNote;
        if (title && value) {
            this.showDone = true;
        } else {
            this.showDone = false;
        }
        console.log(title);
    }

    @Output() createNote = new EventEmitter();
    onCancel(){
        this.reset();
    }
    onColorSelect(color:string) {
        this.newNote.color = color;
    }

    onCreateNote() {
        console.log("emit:" + this.newNote);
        console.log("onCreateNote");

        const {title, value, color} = this.newNote;
        if (title && value) {
            this.createNote.emit({title, value, color});
            this.reset();
        }
    }

    reset() {
        this.newNote = {
            title: '',
            value: '',
            color: 'white'
        };
        this.toggle(false);
    }

    toggle(value:boolean) {
        this.fullForm = value;
        this.showDone = false;
    }
}
;