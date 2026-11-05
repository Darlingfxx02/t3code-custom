import { describe, expect, it } from "vite-plus/test";

import { resolveComposerControlsOwnership } from "./composerControlsOwnership";

const base = {
  matchesDefault: true,
  planModeUiEnabled: false,
  collapsed: false,
  measuredHiddenBlockCount: 0,
};

describe("resolveComposerControlsOwnership", () => {
  it("keeps default permissions accessible in the overflow menu", () => {
    const result = resolveComposerControlsOwnership(base);
    expect(result).toMatchObject({
      accessDisplay: "hidden",
      showModeBlock: false,
      hiddenBlockIds: [],
      overflowShowsPermissions: true,
      showOverflow: true,
    });
  });

  it("shows a labelled chip that owns composer.mode when the mode differs", () => {
    const result = resolveComposerControlsOwnership({ ...base, matchesDefault: false });
    expect(result).toMatchObject({
      accessDisplay: "label",
      showModeBlock: true,
      overflowShowsPermissions: false,
      showOverflow: false,
    });
  });

  it("gives an overflowed chip's Permissions to the overflow menu when it has no Plan toggle", () => {
    const result = resolveComposerControlsOwnership({
      ...base,
      matchesDefault: false,
      measuredHiddenBlockCount: 1,
    });
    expect(result.hiddenBlockIds).toEqual(["mode"]);
    expect(result.overflowShowsPermissions).toBe(true);
    expect(result.showOverflow).toBe(true);
  });

  it("keeps default permissions with the overflowed Plan toggle", () => {
    const result = resolveComposerControlsOwnership({
      ...base,
      planModeUiEnabled: true,
      measuredHiddenBlockCount: 1,
    });
    expect(result.showModeBlock).toBe(true);
    expect(result.hiddenBlockIds).toEqual(["mode"]);
    expect(result.overflowShowsPermissions).toBe(true);
    expect(result.showOverflow).toBe(true);
  });

  it("keeps permissions accessible when the chip and Plan toggle overflow", () => {
    const result = resolveComposerControlsOwnership({
      ...base,
      matchesDefault: false,
      planModeUiEnabled: true,
      measuredHiddenBlockCount: 1,
    });
    expect(result.hiddenBlockIds).toEqual(["mode"]);
    expect(result.overflowShowsPermissions).toBe(true);
    expect(result.showOverflow).toBe(true);
  });

  it("shows the non-default chip as an icon in the compacted row", () => {
    const result = resolveComposerControlsOwnership({
      ...base,
      matchesDefault: false,
      collapsed: true,
    });
    expect(result.accessDisplay).toBe("icon");
  });
});
