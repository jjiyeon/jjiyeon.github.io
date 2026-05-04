import { getCollection, type CollectionEntry } from 'astro:content';

export type Letter = CollectionEntry<'letters'>;

export interface LetterMonth {
  year: string;
  month: string;
  key: string;
  label: string;
  path: string;
}

export interface MonthArchive extends LetterMonth {
  letters: Letter[];
  previous?: LetterMonth;
  next?: LetterMonth;
}

export async function getPublishedLetters() {
  const letters = await getCollection('letters', ({ data }) => data.status === 'published');
  return sortLetters(letters);
}

export function sortLetters(letters: Letter[]) {
  return [...letters].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export function getLetterUrl(letter: Letter) {
  return `/letters/${letter.data.letterSlug}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatMonthLabel(year: string, month: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
  }).format(new Date(Number(year), Number(month) - 1));
}

export function getMonthPath(year: string, month: string) {
  return `/letters/${year}/${month}/`;
}

export function getLetterMonth(letter: Letter): LetterMonth {
  const year = String(letter.data.publishedAt.getFullYear());
  const month = String(letter.data.publishedAt.getMonth() + 1).padStart(2, '0');

  return {
    year,
    month,
    key: `${year}-${month}`,
    label: formatMonthLabel(year, month),
    path: getMonthPath(year, month),
  };
}

export function getAvailableMonths(letters: Letter[]) {
  const months = new Map<string, LetterMonth>();

  for (const letter of letters) {
    const month = getLetterMonth(letter);
    months.set(month.key, month);
  }

  return Array.from(months.values()).sort((a, b) => b.key.localeCompare(a.key));
}

export function getMonthArchive(letters: Letter[], year: string, month: string): MonthArchive {
  const normalizedMonth = month.padStart(2, '0');
  const months = getAvailableMonths(letters);
  const current =
    months.find((entry) => entry.year === year && entry.month === normalizedMonth) ?? {
      year,
      month: normalizedMonth,
      key: `${year}-${normalizedMonth}`,
      label: formatMonthLabel(year, normalizedMonth),
      path: getMonthPath(year, normalizedMonth),
    };
  const currentIndex = months.findIndex((entry) => entry.key === current.key);

  return {
    ...current,
    letters: letters.filter((letter) => {
      const letterMonth = getLetterMonth(letter);
      return letterMonth.key === current.key;
    }),
    previous: currentIndex >= 0 ? months[currentIndex + 1] : undefined,
    next: currentIndex > 0 ? months[currentIndex - 1] : undefined,
  };
}

export function getLatestMonthArchive(letters: Letter[]) {
  const latest = getAvailableMonths(letters)[0];
  if (!latest) {
    return undefined;
  }

  return getMonthArchive(letters, latest.year, latest.month);
}

export function getWeekLabel(letter: Letter) {
  const match = letter.data.title.match(/(\d+)주차/);
  return match ? `${match[1]}주차` : letter.data.week;
}

export function getAllTags(letters: Letter[]) {
  return Array.from(new Set(letters.flatMap((letter) => letter.data.tags))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getLettersByTag(letters: Letter[], tag: string) {
  return letters.filter((letter) => letter.data.tags.includes(tag));
}

export function getLettersByCategory(letters: Letter[], category: string) {
  return letters.filter((letter) => letter.data.category === category);
}
