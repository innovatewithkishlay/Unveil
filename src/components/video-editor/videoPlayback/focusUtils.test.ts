import { describe, expect, it } from "vitest";
import { computeZoomFromDrawnBox } from "./focusUtils";

describe("computeZoomFromDrawnBox", () => {
	const baseMask = { x: 0, y: 0, width: 1000, height: 500 };

	it("centers the focus point exactly on the drawn box's center", () => {
		const result = computeZoomFromDrawnBox(
			{ left: 400, top: 200, width: 100, height: 60 },
			baseMask,
			1.05,
			8,
		);

		expect(result).not.toBeNull();
		// box spans x:400-500, y:200-260 -> center (450, 230)
		expect(result?.focus.cx).toBeCloseTo(450 / 1000, 5);
		expect(result?.focus.cy).toBeCloseTo(230 / 500, 5);
	});

	it("uses the tighter of the two axis scales so the whole box stays visible", () => {
		// A box that is proportionally much narrower than the frame (relative to
		// its height) should be scale-limited by its width, not its height.
		const result = computeZoomFromDrawnBox(
			{ left: 450, top: 150, width: 50, height: 200 },
			baseMask,
			1.05,
			20,
		);

		expect(result).not.toBeNull();
		const scaleForWidth = baseMask.width / 50; // 20
		const scaleForHeight = baseMask.height / 200; // 2.5
		expect(result?.customScale).toBeCloseTo(Math.min(scaleForWidth, scaleForHeight), 5);
		expect(result?.customScale).toBeCloseTo(scaleForHeight, 5);
	});

	it("clamps the computed scale to the provided minimum", () => {
		// A box nearly as large as the whole frame implies a scale barely above
		// 1x - should be floored at the minimum rather than producing <1x.
		const result = computeZoomFromDrawnBox(
			{ left: 10, top: 10, width: 980, height: 480 },
			baseMask,
			1.5,
			8,
		);

		expect(result).not.toBeNull();
		expect(result?.customScale).toBe(1.5);
	});

	it("clamps the computed scale to the provided maximum", () => {
		// A tiny box would imply an extreme zoom multiplier - should be capped.
		const result = computeZoomFromDrawnBox(
			{ left: 500, top: 250, width: 20, height: 15 },
			baseMask,
			1.05,
			8,
		);

		expect(result).not.toBeNull();
		expect(result?.customScale).toBe(8);
	});

	it("returns null for a zero-width or zero-height box", () => {
		expect(
			computeZoomFromDrawnBox({ left: 100, top: 100, width: 0, height: 50 }, baseMask, 1.05, 8),
		).toBeNull();
		expect(
			computeZoomFromDrawnBox({ left: 100, top: 100, width: 50, height: 0 }, baseMask, 1.05, 8),
		).toBeNull();
	});

	it("returns null when the base mask itself is degenerate", () => {
		const result = computeZoomFromDrawnBox(
			{ left: 10, top: 10, width: 50, height: 50 },
			{ x: 0, y: 0, width: 0, height: 0 },
			1.05,
			8,
		);
		expect(result).toBeNull();
	});

	it("keeps the focus point within the valid bounds for the resulting scale", () => {
		// A box drawn right at the frame's edge should still produce a focus
		// point that respects the standard "can't center past the visible
		// edge" clamp used everywhere else in the zoom system.
		const result = computeZoomFromDrawnBox(
			{ left: 0, top: 0, width: 100, height: 100 },
			baseMask,
			1.05,
			8,
		);

		expect(result).not.toBeNull();
		expect(result?.focus.cx).toBeGreaterThanOrEqual(0);
		expect(result?.focus.cy).toBeGreaterThanOrEqual(0);
		expect(result?.focus.cx).toBeLessThanOrEqual(1);
		expect(result?.focus.cy).toBeLessThanOrEqual(1);
	});
});
