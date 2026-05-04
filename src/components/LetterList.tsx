import { getCategory } from '../lib/categories';
import { formatDate, getLetterUrl, type Letter } from '../lib/letters';

interface Props {
  letters: Letter[];
  emptyMessage?: string;
}

export default function LetterList({
  letters,
  emptyMessage = '아직 공개된 개발레터가 없습니다.',
}: Props) {
  if (letters.length === 0) {
    return <p className="empty">{emptyMessage}</p>;
  }

  return (
    <ol className="letter-list">
      {letters.map((letter) => {
        const category = getCategory(letter.data.category);
        return (
          <li key={letter.id}>
            <a href={getLetterUrl(letter)} className="letter-link">
              {letter.data.cover && (
                <img
                  src={letter.data.cover.src}
                  alt={letter.data.coverAlt ?? ''}
                  width={letter.data.cover.width}
                  height={letter.data.cover.height}
                  className="letter-cover"
                  loading="lazy"
                />
              )}
              <span className="letter-meta">
                Issue {letter.data.issue} · {formatDate(letter.data.publishedAt)} ·{' '}
                {category?.label}
              </span>
              <strong>{letter.data.title}</strong>
              <span>{letter.data.summary}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
