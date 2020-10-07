/**
 * Description: Types and interfaces for admin entity
 */

export type AdminLoginPayload = Record<'name' | 'password', string>;

export type RecalculateRatingPayload = {
  id: string;
  rank: string;
};
