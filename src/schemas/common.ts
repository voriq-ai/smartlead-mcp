import { z } from 'zod';

/** A strictly positive integer identifier. */
export const positiveInt = z.int().positive();

/** A non-negative integer (offsets, filter IDs documented as `^[0-9]+$`). */
export const nonNegativeInt = z.int().min(0);

/** A string that is not blank after trimming. */
export const nonEmptyString = z.string().trim().min(1);

/** Bounded free-text search term, matching the documented 1–255 character limit. */
export const searchTerm = z.string().trim().min(1).max(255);

export function boundedInt(min: number, max: number) {
  return z.int().min(min).max(max);
}

/**
 * Confirmation flags are plain booleans that default to `false`.
 *
 * They are deliberately *not* `z.literal(true)`: the policy layer must be the
 * component that refuses, so the caller gets a structured, actionable refusal
 * envelope instead of a schema validation error.
 */
export function confirmationFlag(description: string) {
  return z.boolean().default(false).describe(description);
}

/** Optional switch controlling whether full personal records are returned. */
export const includeFullRecords = z
  .boolean()
  .default(true)
  .describe(
    'Return complete contact records including email addresses and names. Set to false to receive a de-identified summary (counts plus non-personal attributes) instead.',
  );

/**
 * An email address. Surrounding whitespace is trimmed before validation so a
 * pasted list does not fail on a stray space; the trimmed value is what is sent.
 */
export const emailAddress = z.string().trim().pipe(z.email());

/** Normalise an email for local duplicate detection. Does not alter what is sent. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
