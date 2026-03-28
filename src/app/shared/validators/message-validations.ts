export class MassageValidations {
  static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any) {
    const config: any = {
      equalTo: 'Não conferem.',
      email: 'E-mail inválido.',
      cpfNotValid: 'CPF inválido.',
      cnpjNotValid: 'CNPJ inválido.',
      noData: `${fieldName} não encontrado.`,
      invalidNumber: `${fieldName} invalido.`,
      required: `${fieldName} é obrigatório.`,
      invalidDate: `${fieldName} é invalida.`,
      matchPassword: 'As senhas não conferem.',
      notUnique: `${fieldName} já cadastrado.`,
      timeValidator: `${fieldName} é invalida.`,
      minlength: `Mínimo ${validatorValue.requiredLength} caracteres.`,
      maxlength: `Máximo ${validatorValue.requiredLength} caracteres.`,
      endsWithSpace: `${fieldName} não pode terminar com um espaço em branco`,
      startsWithSpace: `${fieldName} não pode começar com um espaço em branco`,
    };
    return config[validatorName];
  }
}
