import { describe, it, expect } from "vitest";
import { payoffPlan, installmentSchedule } from "@/lib/debt";

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

describe("installmentSchedule", () => {
  it("pays 1000 at 0% with 250/month in 4 dated installments", () => {
    const rows = installmentSchedule([{ name: "A", balance: 1000, rate: 0, min: 50 }], 250, "snowball", new Date(2026, 0, 15));
    expect(rows.length).toBe(4);
    expect(rows[0]!.date).toBe("2026-01-15");
    expect(rows[3]!.remaining).toBe(0);
    expect(rows[3]!.paidOff).toEqual(["A"]);
  });
  it("returns empty when budget below minimums", () => {
    expect(installmentSchedule([{ name: "A", balance: 1000, rate: 10, min: 100 }], 50, "snowball", new Date())).toEqual([]);
  });
});
