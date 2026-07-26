import { describe, expect, it } from "vitest";
import { currentFilter, taskCount } from "./selectors.js";
import { initialState, type AppState } from "./types.js";

describe("taskCount", () => {
  it("counts the tasks in state", () => {
    const state: AppState = {
      tasks: [
        { id: "a", title: "A", done: false, priority: "normal" },
        { id: "b", title: "B", done: true, priority: "high" },
      ],
      filter: "all",
    };
    expect(taskCount(state)).toBe(2);
  });

  it("returns 0 for an empty task list", () => {
    expect(taskCount(initialState)).toBe(0);
  });
});

describe("currentFilter", () => {
  it("returns the state's filter", () => {
    const state: AppState = { tasks: [], filter: "done" };
    expect(currentFilter(state)).toBe("done");
  });

  it("reflects the default filter on initial state", () => {
    expect(currentFilter(initialState)).toBe("all");
  });
});