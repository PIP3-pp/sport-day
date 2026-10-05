// Plain constants (no database imports) so client components can use them.

export const MATCH_STATUSES = ["scheduled", "completed", "postponed", "cancelled"] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

// versus = two teams with a score, all_teams = every team competes and is ranked
export const MATCH_FORMATS = ["versus", "all_teams"] as const;
export type MatchFormat = (typeof MATCH_FORMATS)[number];

// "completed" is deliberately absent: a match is completed only by entering its result.
export const EDITABLE_MATCH_STATUSES = ["scheduled", "postponed", "cancelled"] as const;
