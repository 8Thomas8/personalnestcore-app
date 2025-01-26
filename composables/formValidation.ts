export const useFormValidation = () => {
  const required = (value: string | number) => {
    if (!value && value !== 0) {
      return 'Champs requis.'
    }
    return true
  }

  const requiredIf = (value: string | number | null | undefined, condition: boolean) => {
    if (condition && !value && value !== 0) {
      return 'Champs requis.'
    }
    return true
  }

  const email = (value: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(value)) {
      return 'Adresse email invalide.'
    }
    return true
  }

  const password = (value: string) => {
    const emailPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!emailPattern.test(value)) {
      return 'Le mot de passe doit contenir au moins 8 caractères dont 1 lettre majuscule, 1 lettre minuscule, 1 chiffre et 1 caractère spécial.'
    }
    return true
  }

  const passwordConfirmation = (value: string, password: string) => {
    if (value !== password) {
      return 'La confirmation du mot de passe doit être identique au mot de passe.'
    }
    return true
  }

  const isFloat = (value: string) => {
    const floatPattern = /^\d+(\.\d{1,2})?$/
    if (!floatPattern.test(value)) {
      return 'Veuillez entrer un nombre valide.'
    }
    return true
  }

  const isDateisFormatFr = (value: string) => {
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
    if (!datePattern.test(value)) {
      return 'Veuillez entrer une date au format JJ/MM/AAAA.'
    }
    return true
  }

  const isNumber = (value: string) => {
    const numberPattern = /^\d+$/
    if (!numberPattern.test(value)) {
      return 'Veuillez entrer un nombre valide.'
    }
    return true
  }

  const min = (value: string | undefined, min: number) => {
    if (value && Number(value) < min) {
      return `Veuillez entrer une valeur minimum de ${min}.`
    }
    return true
  }

  return {
    required,
    requiredIf,
    email,
    password,
    passwordConfirmation,
    isFloat,
    isDateisFormatFr,
    isNumber,
    min,
  }
}
