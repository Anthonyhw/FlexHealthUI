import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatFieldsService {

  constructor() { }

  formatRg(formGroup: any, input: any) {
    let valor = input.target.value;
    valor = valor.replace(/\D/g, '');

    const x = valor.substr(0, 2);
    const y = valor.substr(2, 3);
    const z = valor.substr(5, 3);
    const a = valor.substr(8, 1);

    let formatedRg = '';
    if (x) {
        formatedRg += x;
        if (y) {
            formatedRg += '.' + y;
            if (z) {
                formatedRg += '.' + z;
                if (a) {
                    formatedRg += '-' + a;
                }
            }
        }
    }

    input.target.value = formatedRg;
    formGroup.rg.value = formatedRg;

    console.log(formGroup.rg.errors);
}

formatCpf(formGroup: any, input: any) {
    let valor = input.target.value;
    valor = valor.replace(/\D/g, '');

    const x = valor.substr(0, 3);
    const y = valor.substr(3, 3);
    const z = valor.substr(6, 3);
    const a = valor.substr(9, 2);

    let formatedCpf = '';
    if (x) {
        formatedCpf += x;
        if (y) {
            formatedCpf += '.' + y;
            if (z) {
                formatedCpf += '.' + z;
                if (a) {
                    formatedCpf += '-' + a;
                }
            }
        }
    }

    input.target.value = formatedCpf;
    formGroup.cpf.value = formatedCpf;
}

formatPhone(formGroup: any, input: any) {
    let valor = input.target.value;
    valor = valor.replace(/\D/g, '');

    var x, y, z;
    if (valor.length == 10) {
        x = valor.substr(0, 2);
        y = valor.substr(2, 4);
        z = valor.substr(6, 4);
    } else {
        x = valor.substr(0, 2);
        y = valor.substr(2, 5);
        z = valor.substr(7, 4);
    }


    let formatedPhone = '';
    if (x) {
        formatedPhone += '(' + x;
        if (y) {
            formatedPhone += ') ' + y;
            if (z) {
                formatedPhone += '-' + z;
            }
        }
    }

    input.target.value = formatedPhone;
    formGroup.telefone.value = formatedPhone;
}

formatCnpj(formGroup: any, input: any) {
    let valor = input.target.value;
    valor = valor.replace(/\D/g, '');

    const x = valor.substr(0, 2);
    const y = valor.substr(2, 3);
    const z = valor.substr(5, 3);
    const a = valor.substr(8, 4);
    const b = valor.substr(12, 2);

    let formatedPhone = '';
    if (x) {
        formatedPhone += x;
        if (y) {
            formatedPhone += '.' + y;
            if (z) {
                formatedPhone += '.' + z;
                if (a) {
                    formatedPhone += '/' + a;
                    if (b) {
                        formatedPhone += '-' + b;
                    }
                }
            }
        }
    }

    input.target.value = formatedPhone;
    formGroup.telefone.value = formatedPhone;
}
}
