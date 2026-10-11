import { describe, it, expect } from "vitest";
import { payoffPlan } from "@/lib/debt";

const debts = [
  { name: "Card", balance: 1000, rate: 24, min: 30 },
  { name: "Loan", balance: 300, rate: 5, min: 20 },
];
describe("debt organizer", () => {
  it("snowball pays the smallest balance first", () => {
    expect(payoffPlan(debts, 200, "snowball").order[0]).toBe("Loan");
  });
  it("avalanche pays the highest rate first", () => {
    expect(payoffPlan(debts, 200, "avalanche").order[0]).toBe("Card");
  });
  it("avalanche never costs more interest than snowball", () => {
    expect(payoffPlan(debts, 200, "avalanche").interest).toBeLessThanOrEqual(payoffPlan(debts, 200, "snowball").interest);
  });
  it("budget below minimums is not feasible", () => {
    expect(payoffPlan(debts, 40, "snowball").feasible).toBe(false);
  });
});
