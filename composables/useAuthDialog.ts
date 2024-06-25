export const useAuthDialog = () => {
  const opened = useState('opened', () => false)

  const toggleAuthDialog = (value?: boolean) => {
    opened.value = !!value || !opened.value
  }
  return {
    opened,
    toggleAuthDialog,
  }
}
