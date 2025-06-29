import { passwordReg, usernameReg } from '~/types/constants'

export const useFormValidation = () => {
  const required = (value: string | number) => {
    if (!value && value !== 0) {
      return 'Champs requis.'
    }
    return true
  }

  const requiredIf = (value: string | number, condition: boolean) => {
    if (condition && !value && value !== 0) {
      return 'Champs requis.'
    }
    return true
  }

  const shouldBeEmptyIf = (value: string | null | undefined, condition: boolean) => {
    if (condition) {
      return !value || value === '' ? true : 'Ce champ doit être vide.'
    }
    return true
  }

  const username = (value: string) => {
    if (!usernameReg.test(value)) {
      return "Le nom d'utilisateur doit contenir entre 3 et 32 caractères, lettres, chiffres et '_'."
    }
    return true
  }

  const password = (value: string) => {
    if (!passwordReg.test(value)) {
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
    if (value == null || value === '') {
      return true
    }

    const floatPattern = /^\d+(\.\d{1,2})?$/
    return floatPattern.test(value) ? true : 'Veuillez entrer un nombre valide.'
  }

  const isDateIsFormatFr = (value: string) => {
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
    if (value && value.trim().length < min) {
      return `Veuillez entrer une valeur minimum de ${min}.`
    }
    return true
  }

  const max = (value: string | undefined, max: number) => {
    if (value && value.trim().length > max) {
      return `Veuillez entrer une valeur maximum de ${max}.`
    }
    return true
  }

  const isFormat = (value: string, format: RegExp, message: string) => {
    if (!format.test(value)) {
      return message ?? 'Le format est invalide.'
    }
    return true
  }

  const firstDateIsBeforeSecondDate = (date1: Date, date2: Date) => {
    if (date1 > date2) {
      return 'La première date doit être avant la deuxième date.'
    }
    return true
  }

  return {
    required,
    requiredIf,
    shouldBeEmptyIf,
    password,
    passwordConfirmation,
    isFloat,
    isDateIsFormatFr: isDateIsFormatFr,
    isNumber,
    min,
    max,
    username,
    isFormat,
    firstDateIsBeforeSecondDate,
  }
}
