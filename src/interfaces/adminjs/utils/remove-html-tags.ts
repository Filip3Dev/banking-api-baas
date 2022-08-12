export function removeHtmlTags(text: string): string {
  const tagRegex = /<[^<]+>/g
  return text.replace(tagRegex, '')
}
