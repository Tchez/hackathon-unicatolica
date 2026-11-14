/**
 * Copia o texto para a área de transferência. Fora de HTTPS (ex.: celular abrindo o app pelo IP da
 * rede local) `navigator.clipboard` não existe; nesse caso usa um campo temporário. Devolve falso se
 * nenhum dos dois funcionou.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Permissão negada: tenta o campo temporário.
  }

  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.appendChild(field)
  try {
    field.select()
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(field)
  }
}
