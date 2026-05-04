import rss from '@astrojs/rss';
import { getPublishedLetters, getLetterUrl } from '../lib/letters';

export async function GET(context) {
  const letters = await getPublishedLetters();

  return rss({
    title: "Summer's Dev Letter",
    description: '일과 개발, 제품, 협업을 매주 정리하는 Summer의 개발레터입니다.',
    site: context.site,
    items: letters.map((letter) => ({
      title: letter.data.title,
      description: letter.data.summary,
      pubDate: letter.data.publishedAt,
      link: getLetterUrl(letter),
    })),
    customData: '<language>ko-KR</language>',
  });
}

