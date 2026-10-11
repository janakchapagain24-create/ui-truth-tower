import { describe, it, expect, beforeEach } from "vitest";
import { rewardUrgeSurf, coachRemaining, COACH_FREE_PER_DAY } from "@/lib/store";

describe("urge-surf game rewards", () => {
  beforeEach(() => localStorage.clear());
  it("needs at least 3 minutes of play", () => {
    expect(rewardUrgeSurf(179, "2026-01-01")).toBe(false);
    expect(rewardUrgeSurf(180, "2026-01-01")).toBe(true);
  });
  it("caps at 3 rewards per day", () => {
    const d = "2026-02-01";
    expect([1, 2, 3, 4].map(() => rewardUrgeSurf(200, d))).toEqual([true, true, true, false]);
  });
});
describe("coach limit", () => {
  it("gives 10 free messages on a new day", () => {
    expect(COACH_FREE_PER_DAY).toBe(10);
    expect(coachRemaining({ gameRewards: {}, surfMinutes: 0, coach: { date: "2026-01-01", count: 10 }, debts: [], pledges: [] }, "2026-01-02")).toBe(10);
  });
});
