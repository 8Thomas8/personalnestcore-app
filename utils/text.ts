export const slugify = (text: string) => {
  return text
    .toLowerCase() // Convert to lowercase
    .normalize('NFD') // Normalize to decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .trim() // Remove leading and trailing spaces
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
}
