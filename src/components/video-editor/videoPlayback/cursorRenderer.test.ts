import { describe, expect, it } from "vitest";
import type { CursorTelemetryPoint } from "../types";
import { computeCursorIdleAlpha } from "./cursorRenderer";

function sample(
	timeMs: number,
	cx: number,
	cy: number,
	interactionType?: CursorTelemetryPoint["interactionType"],
): CursorTelemetryPoint {
	return { timeMs, cx, cy, interactionType };
}

describe("computeCursorIdleAlpha", () => {
	it("stays fully visible while the cursor keeps moving", () => {
		const samples = [sample(0, 0.1, 0.1), sample(100, 0.2, 0.2), sample(200, 0.3, 0.3)];
		expect(computeCursorIdleAlpha(samples, 200, undefined)).toBe(1);
	});

	it("stays fully visible for the grace period right after the cursor settles", () => {
		const samples = [sample(0, 0.5, 0.5), sample(100, 0.5, 0.5), sample(500, 0.5, 0.5)];
		// Settled at t=0 (no movement across any sample); 500ms later is still
		// under the fade delay.
		expect(computeCursorIdleAlpha(samples, 500, undefined)).toBe(1);
	});

	it("fades out partway through the fade window once idle past the grace period", () => {
		const samples = [sample(0, 0.5, 0.5), sample(900, 0.5, 0.5)];
		// Settled since t=0; querying at t=900 means 900ms idle, which is
		// 200ms into the 450ms fade window after the 700ms delay.
		const alpha = computeCursorIdleAlpha(samples, 900, undefined);
		expect(alpha).toBeGreaterThan(0);
		expect(alpha).toBeLessThan(1);
		expect(alpha).toBeCloseTo(1 - 200 / 450, 5);
	});

	it("reaches fully invisible once idle past the delay plus fade duration", () => {
		const samples = [sample(0, 0.5, 0.5), sample(5000, 0.5, 0.5)];
		expect(computeCursorIdleAlpha(samples, 5000, undefined)).toBe(0);
	});

	it("snaps back to fully visible the instant the cursor moves again", () => {
		const samples = [
			sample(0, 0.5, 0.5),
			sample(2000, 0.5, 0.5),
			// A real movement breaks the stationary run.
			sample(2050, 0.52, 0.52),
		];
		expect(computeCursorIdleAlpha(samples, 2050, undefined)).toBe(1);
	});

	it("ignores jitter smaller than the movement threshold", () => {
		const samples = [
			sample(0, 0.5, 0.5),
			sample(1000, 0.5005, 0.5005),
			sample(2000, 0.5, 0.5),
		];
		// Tiny sub-threshold drift shouldn't count as movement - the cursor
		// should still read as idle since t=0.
		expect(computeCursorIdleAlpha(samples, 2000, undefined)).toBe(0);
	});

	it("treats a click as activity even if the cursor hasn't moved", () => {
		const samples = [sample(0, 0.5, 0.5), sample(900, 0.5, 0.5, "click")];
		// Without the click this would already be fading (200ms into the
		// window); the click should reset it to fully visible.
		expect(computeCursorIdleAlpha(samples, 900, 900)).toBe(1);
	});

	it("returns fully visible when queried before any sample exists", () => {
		expect(computeCursorIdleAlpha([], 1000, undefined)).toBe(1);
	});
});
