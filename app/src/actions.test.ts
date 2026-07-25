import { describe, expect, it } from "vitest";
import {
  addTask,
  clearTasks,
  removeTask,
  setFilter,
  setTaskPriority,
  toggleTask,
} from "./actions.js";

describe("action creators", () => {
  it("addTask builds a task/added action", () => {
    expect(addTask("a", "Buy milk")).toEqual({
      type: "task/added",
      payload: { id: "a", title: "Buy milk" },
    });
  });

  it("toggleTask builds a task/toggled action", () => {
    expect(toggleTask("a")).toEqual({
      type: "task/toggled",
      payload: { id: "a" },
    });
  });

  it("removeTask builds a task/removed action", () => {
    expect(removeTask("a")).toEqual({
      type: "task/removed",
      payload: { id: "a" },
    });
  });

  it("clearTasks builds a task/cleared action", () => {
    expect(clearTasks()).toEqual({ type: "task/cleared" });
  });

  it("setTaskPriority builds a task/prioritized action with the given id and priority", () => {
    expect(setTaskPriority("a", "high")).toEqual({
      type: "task/prioritized",
      payload: { id: "a", priority: "high" },
    });
  });

  it("setFilter builds a filter/set action", () => {
    expect(setFilter("done")).toEqual({
      type: "filter/set",
      payload: { filter: "done" },
    });
  });
});