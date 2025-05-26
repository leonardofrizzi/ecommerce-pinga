export function slugify(text: string): string {
  return text
    .toLowerCase()                   // tudo minúsculo
    .normalize('NFD')                // remover acentuação
    .replace(/[\u0300-\u036f]/g, '') // limpar diacríticos
    .replace(/[^a-z0-9]+/g, '-')     // não alfanuméricos → hífen
    .replace(/(^-|-$)/g, '')         // tira hífen no início/fim
}
