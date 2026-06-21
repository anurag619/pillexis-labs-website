/**
 * Quiz engine. JSON-driven. Pure functions only — UI lives in Quiz.astro.
 *
 * URL state shape (BoSar-style):
 *   ?r=<encodedAnswers>#<tierName>
 *
 * `encodedAnswers` is a base-N string where N = max(number of options across
 * all questions). For our default 4-option quizzes, that's base 4 — each
 * answer becomes a single 0..3 digit, joined.
 *
 * That keeps share URLs short and human-glanceable.
 */

/**
 * Encode an array of answer indices into a compact URL-safe string.
 * @param {number[]} indices  e.g. [0, 2, 1, 3, ...]
 * @param {number}   base     options per question (4 by default)
 * @returns {string}          e.g. "0213..."
 */
export function encodeAnswers(indices, base = 4) {
  if (!Array.isArray(indices)) return '';
  return indices.map(i => clamp(i, 0, base - 1).toString(base)).join('');
}

/**
 * Decode a URL-safe answers string back to an index array.
 * @param {string} encoded
 * @param {number} base
 * @returns {number[]}
 */
export function decodeAnswers(encoded, base = 4) {
  if (typeof encoded !== 'string' || !encoded) return [];
  return encoded.split('').map(ch => {
    const n = parseInt(ch, base);
    return Number.isFinite(n) ? n : 0;
  });
}

/**
 * Sum the weight of each chosen option.
 * @param {Array<{options: Array<{w: number}>}>} questions
 * @param {number[]} indices
 * @returns {number}
 */
export function scoreAnswers(questions, indices) {
  let total = 0;
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const idx = indices[i] ?? 0;
    const opt = q.options?.[idx];
    if (opt && typeof opt.w === 'number') total += opt.w;
  }
  return total;
}

/**
 * Pick the matching tier for a total score.
 * Tiers are expected to be sorted ascending by `max`.
 * @param {Array<{name: string, max: number}>} tiers
 * @param {number} score
 */
export function pickTier(tiers, score) {
  for (const t of tiers) {
    if (score <= t.max) return t;
  }
  return tiers[tiers.length - 1];
}

/** Convert a tier name into a URL hash slug. */
export function tierSlug(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(n) ? n : 0));
}
