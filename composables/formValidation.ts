const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordRegex = new RegExp(
  '^(?=(?:.*?[A-Z]){2})(?=(?:.*?[a-z]){2})(?=(?:.*?\\d){2})(?=(?:.*?[^\\w\\s]){2}).{8,128}$',
)

export function useFormValidation() {
  return {
    required: v => String(v).trim().length > 0 || 'Champs requis',
    email: v => emailRegex.test(String(v)) || 'Format invalide',
    password: v =>
      passwordRegex.test(String(v)) ||
      'Format invalide, 8 caractères, 2 majuscules, 2 minuscules, 2 chiffres, 2 caractères spéciaux parmis !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
    length: (v, min?: number, max?: number) =>
      ((min ? String(v).trim().length >= min : true) &&
        (max ? String(v).trim().length <= max : true)) ||
      `Entre ${min} et ${max} caractères.`,
  }
}
