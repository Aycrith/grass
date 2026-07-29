/**
 * Prop utilities — Mission 1
 *
 * `compactUndefined(obj)` strips undefined values from an object,
 * returning a new object with only defined keys. Used in 2 places:
 *
 *   1. Button.tsx — `<Button as="link">` / `<Button as="a">` / the
 *      default `<button>` branch each need to spread a filtered
 *      subset of the polymorphic props onto the underlying element.
 *      exactOptionalPropertyTypes: true means a `{ foo: undefined }`
 *      literal won't pass the element's strict attr types; we have
 *      to drop the undefined keys before spreading.
 *
 *   2. Card.tsx — `<Card href=...>` renders as a Next <Link>, so
 *      it filters out the `href` key (handled separately) and any
 *      undefined attrs before the spread.
 *
 * Implementation is a small for-loop, not Object.fromEntries + filter,
 * to keep the per-call cost O(n) on a 5-15 key object (not O(2n)).
 * Same approach the previous inline copies used.
 */
export function compactUndefined<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  const out: Partial<T> = {};
  for (const k of Object.keys(obj) as Array<keyof T>) {
    const v = obj[k];
    if (v === undefined) continue;
    out[k] = v;
  }
  return out;
}
