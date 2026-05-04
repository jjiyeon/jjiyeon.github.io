export const categories = [
  {
    slug: 'work',
    label: 'Work',
    description: '일하는 방식, 협업, 커뮤니케이션에 대한 기록',
  },
  {
    slug: 'dev',
    label: 'Dev',
    description: '구현, 디버깅, 아키텍처와 개발 과정에서 배운 것',
  },
  {
    slug: 'product',
    label: 'Product',
    description: '제품 사고, 사용자 경험, 기획에 대한 생각',
  },
  {
    slug: 'career',
    label: 'Career',
    description: '성장, 커리어, 회고에 대한 글',
  },
  {
    slug: 'notes',
    label: 'Notes',
    description: '짧은 메모, 읽은 글, 작은 배움의 조각',
  },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

