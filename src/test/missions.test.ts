import { describe, expect, it } from "vitest";
import { levelOf, completeMission, setState } from "@/lib/store";

describe("mission rules", () => {
  it("gives level 1 'Protect' at 0 credits and 'Stabilize' at 100", () => {
    expect(levelOf(0).name).toBe("Protect");
    expect(levelOf(100).name).toBe("Stabilize");
  });

  it("awards credits for a mission only once per day", () => {
    let credits = 0;
    setState((s) => ({ ...s, credits: 0, completed: {} }));
    completeMission("protect-confirm");
    completeMission("protect-confirm");
    setState((s) => { credits = s.credits; return s; });
    expect(credits).toBe(10);
  });

  it("logging a setback keeps credits", () => {
    let credits = 0;
    setState((s) => ({ ...s, credits: 50 }));
    setState((s) => ({ ...s, setbacks: [...s.setbacks, { date: "x", kind: "Urge" }] }));
    setState((s) => { credits = s.credits; return s; });
    expect(credits).toBe(50);
  });
});
