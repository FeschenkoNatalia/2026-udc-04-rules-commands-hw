import { describe, expect, it } from "vitest";
import { reducer } from "./reducer.js";
import {
  addTask,
  clearTasks,
  removeTask,
  setFilter,
  setTaskPriority,
  toggleTask,
} from "./actions.js";
import { initialState, type AppState } from "./types.js";

function stateWithTaskA(): AppState {
  return reducer(initialState, addTask("a", "A"));
}

describe("reducer", () => {
  it("adds a task as not done with normal priority", () => {
    const next = reducer(initialState, addTask("buy-milk", "Buy Milk"));
    expect(next.tasks).toEqual([
      { id: "buy-milk", title: "Buy Milk", done: false, priority: "normal" },
    ]);
  });

  it("does not mutate the previous state (immutability)", () => {
    const next = stateWithTaskA();
    expect(initialState.tasks).toEqual([]);
    expect(next).not.toBe(initialState);
  });

  it("toggles a task's done flag", () => {
    const state = stateWithTaskA();
    const action = toggleTask("a");
    const toggled = reducer(state, action);
    expect(toggled.tasks[0]?.done).toBe(true);
  });

  it("removes a task by id", () => {
    const state = stateWithTaskA();
    const action = removeTask("a");
    const removed = reducer(state, action);
    expect(removed.tasks).toEqual([]);
  });

  it("clears all tasks", () => {
    const state = stateWithTaskA();
    const action = clearTasks();
    const cleared = reducer(state, action);
    expect(cleared.tasks).toEqual([]);
  });

  it("keeps an empty task list empty", () => {
    const state = initialState;
    const action = clearTasks();
    const cleared = reducer(state, action);
    expect(cleared.tasks).toEqual([]);
  });

  it("sets the filter", () => {
    const next = reducer(initialState, setFilter("done"));
    expect(next.filter).toBe("done");
  });

  it("leaves the task unchanged for an unknown id toggle", () => {
    const state: AppState = {
      tasks: [{ id: "a", title: "A", done: false, priority: "normal" }],
      filter: "all",
    };
    const next = reducer(state, toggleTask("missing"));
    expect(next.tasks[0]?.done).toBe(false);
  });

  it("changes a task's priority", () => {
    const state = stateWithTaskA();
    const action = setTaskPriority("a", "high");
    const changed = reducer(state, action);
    expect(changed.tasks[0]?.priority).toBe("high");
  });

  it("leaves priorities unchanged for an unknown id", () => {
    const state: AppState = {
      tasks: [{ id: "a", title: "A", done: false, priority: "normal" }],
      filter: "all",
    };
    const next = reducer(state, setTaskPriority("missing", "low"));
    expect(next.tasks[0]?.priority).toBe("normal");
    expect(next).not.toBe(state);
  });
});
