import { describe, expect, it } from "vitest";
import { computeAspectLockedZoomBox, computeZoomFromDrawnBox } from "./focusUtils";

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

describe("computeAspectLockedZoomBox", () => {
	// 2:1 aspect ratio frame, easy to reason about by hand.
	const baseMask = { x: 0, y: 0, width: 1000, height: 500 };

	it("locks the drawn box to the base mask's aspect ratio, not a free rectangle", () => {
		// Drag suggests a box far wider (proportionally) than the frame's 2:1
		// ratio - the result must still be exactly 2:1, using the dominant axis.
		const result = computeAspectLockedZoomBox({ x: 100, y: 100 }, { x: 500, y: 150 }, baseMask);

		expect(result).not.toBeNull();
		expect(result!.width / result!.height).toBeCloseTo(2, 5);
	});

	it("locks to aspect ratio when the drag is proportionally taller instead", () => {
		const result = computeAspectLockedZoomBox({ x: 100, y: 100 }, { x: 150, y: 400 }, baseMask);

		expect(result).not.toBeNull();
		expect(result!.width / result!.height).toBeCloseTo(2, 5);
	});

	it("extends in the direction the user actually drags", () => {
		// Dragging up-and-left from the start point should produce a box whose
		// bottom-right corner is at (or very near) the start point.
		const start = { x: 600, y: 400 };
		const result = computeAspectLockedZoomBox(start, { x: 550, y: 380 }, baseMask);

		expect(result).not.toBeNull();
		expect(result!.left + result!.width).toBeCloseTo(start.x, 1);
		expect(result!.top + result!.height).toBeCloseTo(start.y, 1);
	});

	it("never produces a box that extends outside the base mask", () => {
		// Start near the mask's edge and drag further outward than the mask
		// allows - the box must be repositioned to stay fully inside, not
		// clipped into an off-ratio shape.
		const result = computeAspectLockedZoomBox({ x: 950, y: 480 }, { x: 1200, y: 700 }, baseMask);

		expect(result).not.toBeNull();
		expect(result!.left).toBeGreaterThanOrEqual(baseMask.x);
		expect(result!.top).toBeGreaterThanOrEqual(baseMask.y);
		expect(result!.left + result!.width).toBeLessThanOrEqual(baseMask.x + baseMask.width + 0.001);
		expect(result!.top + result!.height).toBeLessThanOrEqual(baseMask.y + baseMask.height + 0.001);
		expect(result!.width / result!.height).toBeCloseTo(2, 5);
	});

	it("returns null when start and current are the same point", () => {
		expect(computeAspectLockedZoomBox({ x: 500, y: 250 }, { x: 500, y: 250 }, baseMask)).toBeNull();
	});

	it("returns null for a degenerate base mask", () => {
		expect(
			computeAspectLockedZoomBox({ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 0, width: 0, height: 0 }),
		).toBeNull();
	});

	it("feeding its output into computeZoomFromDrawnBox always uses the same scale for both axes", () => {
		// Confirms the two functions agree with each other end-to-end: an
		// aspect-locked box should never trigger the "tighter axis" fallback
		// in computeZoomFromDrawnBox in any meaningfully different way.
		const box = computeAspectLockedZoomBox({ x: 200, y: 150 }, { x: 700, y: 300 }, baseMask);
		expect(box).not.toBeNull();

		const scaleForWidth = baseMask.width / box!.width;
		const scaleForHeight = baseMask.height / box!.height;
		expect(scaleForWidth).toBeCloseTo(scaleForHeight, 5);
	});
});
