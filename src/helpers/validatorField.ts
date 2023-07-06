import { AbstractControl, FormGroup } from "@angular/forms";

export class ValidatorField {
    static mustMatch(controlName: string, matchingControlName: string): any {
        return (group: AbstractControl) => {
            const formGroup = group as FormGroup;
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
                return null
            }

            if (control.value != matchingControl.value) {
                matchingControl.setErrors({mustMatch: true});
            } else {
                matchingControl.setErrors(null);
            }
            
            return null;
        }
    }

    static checkName(controlName: string): any {
        return (group: AbstractControl) => {
            const formGroup = group as FormGroup;
            const control = formGroup.controls[controlName];

            if (control.errors && !control.errors['checkName']) {
                return null
            }

            var name = control.value.trim().split(" ");
            
            if (name.length < 2) {
                control.setErrors({checkName: true});
            } else {
                control.setErrors(null);
            }
            
            return null;
        }
    }
}