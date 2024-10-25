export const useFormValidation = () => {
  const required = (value: string | number) => {
    if (!value && value !== 0) {
      return 'Champs requis.'
    }
    return true
  }

  const email = (value: string) => {
    if (!value) {
      return 'Ce champ est requis.'
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(value)) {
      return 'Adresse email invalide.'
    }
    return true
  }

  return {
    required,
    email,
  }
}
