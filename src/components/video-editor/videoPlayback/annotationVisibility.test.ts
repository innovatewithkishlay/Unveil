import { describe, expect, it } from "vitest";
import { isAnnotationActiveAtTime, shouldClearSelectedAnnotation } from "./annotationVisibility";

describe("isAnnotationActiveAtTime", () => {
	it("includes both annotation range boundaries", () => {
		const annotation = { startMs: 1_000, endMs: 2_000 };

		expect(isAnnotationActiveAtTime(annotation, 1_000)).toBe(true);
		expect(isAnnotationActiveAtTime(annotation, 2_000)).toBe(true);
	});

	it("excludes timestamps outside the annotation range", () => {
		const annotation = { startMs: 1_000, endMs: 2_000 };

		expect(isAnnotationActiveAtTime(annotation, 999)).toBe(false);
		expect(isAnnotationActiveAtTime(annotation, 2_001)).toBe(false);
	});

	it("rejects invalid annotation timing", () => {
		expect(isAnnotationActiveAtTime({ startMs: Number.NaN, endMs: 2_000 }, 1_500)).toBe(false);
	});
});

describe("shouldClearSelectedAnnotation", () => {
	const annotation = {
		id: "annotation-1",
		startMs: 1_000,
		endMs: 2_000,
	} as never;

	it("clears selection after the playhead leaves its active range", () => {
		expect(shouldClearSelectedAnnotation([annotation], annotation.id, 2_001)).toBe(true);
	});

	it("keeps selection while its annotation is active", () => {
		expect(shouldClearSelectedAnnotation([annotation], annotation.id, 1_500)).toBe(false);
	});
});
