import data from '@/kural.json';

export const kurals = data.kural;

export function getKurals(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const paginatedData = kurals.slice(skip, skip + limit);
  return {
    data: paginatedData,
    total: kurals.length,
    page,
    limit,
    totalPages: Math.ceil(kurals.length / limit)
  };
}

export function getKuralByNumber(number) {
  const kural = kurals[number - 1];
  if (kural && kural.Number === number) {
    return kural;
  }
  return kurals.find((k) => k.Number === number) || null;
}

export function getRandomKural() {
  const randomIndex = Math.floor(Math.random() * kurals.length);
  return kurals[randomIndex];
}
