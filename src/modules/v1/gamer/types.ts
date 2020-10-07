/**
 * Description: Types and interfaces for gamer entity
 */

export type GetUserParams = Record<'id', number>;

export type CreateGamerPayload = Record<'name' | 'password', string>;
