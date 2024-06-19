import {Component, inject, model} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

export interface DialogData {
  tittle: string;
  subtitulos: string;
  cancel: string;
  accept: string;
  input: string;
  inputLabel: string;
}

@Component({
  selector: 'app-dialog-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,],
  templateUrl: './dialog-input.component.html',
  styleUrl: './dialog-input.component.scss'
})
export class DialogInputComponent {
  readonly dialogRef = inject(MatDialogRef<DialogInputComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly input = model(this.data.input);

  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(){
    this.dialogRef.close(this.data.input);  
  }
}
