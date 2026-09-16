import { clampFocusToDepth, ZOOM_DEPTH_SCALES, type ZoomDepth, type ZoomFocus } from "../types";

interface StageSize {
	width: number;
	height: number;
}

function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

function easeIntoBoundary(normalized: number) {
	const t = clamp(normalized, 0, 1);
	return -t * t * t + 2 * t * t;
}

function softClampToRange(value: number, min: number, max: number, softness: number) {
	const clamped = clamp(value, min, max);

	if (softness <= 0 || max <= min) {
		return clamped;
	}

	if (clamped < min + softness) {
		const normalized = (clamped - min) / softness;
		return min + softness * easeIntoBoundary(normalized);
	}

	if (clamped > max - softness) {
		const normalized = (max - clamped) / softness;
		return max - softness * easeIntoBoundary(normalized);
	}

	return clamped;
}

function getFocusBounds(depth: ZoomDepth) {
	const zoomScale = ZOOM_DEPTH_SCALES[depth];
	return getFocusBoundsForScale(zoomScale);
}

function getFocusBoundsForScale(zoomScale: number) {
	const marginX = 1 / (2 * zoomScale);
	const marginY = 1 / (2 * zoomScale);

	return {
		minX: marginX,
		maxX: 1 - marginX,
		minY: marginY,
		maxY: 1 - marginY,
	};
}

export function clampFocusToStage(
	focus: ZoomFocus,
	depth: ZoomDepth,
	_stageSize: StageSize,
): ZoomFocus {
	const baseFocus = clampFocusToDepth(focus, depth);
	const bounds = getFocusBounds(depth);

	return {
		cx: clamp(baseFocus.cx, bounds.minX, bounds.maxX),
		cy: clamp(baseFocus.cy, bounds.minY, bounds.maxY),
	};
}

export interface DrawnZoomBox {
	left: number;
	top: number;
	width: number;
	height: number;
}

export interface BaseMask {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Converts a box drawn on the preview frame into the precise focus point and
 * zoom scale needed to make that exact box fill the frame - "zoom to fit this
 * selection", the same idea as marquee-zoom in image editors. Uses the
 * tighter of the two axis scales so the whole drawn box stays visible after
 * zooming, rather than cropping one edge to fill the other axis exactly.
 *
 * Returns null when the box or base mask is degenerate (zero-sized) - the
 * caller should treat that as "no meaningful selection was drawn".
 */
export function computeZoomFromDrawnBox(
	box: DrawnZoomBox,
	baseMask: BaseMask,
	minScale: number,
	maxScale: number,
): { focus: ZoomFocus; customScale: number } | null {
	if (box.width <= 0 || box.height <= 0 || !baseMask.width || !baseMask.height) {
		return null;
	}

	const centerX = box.left + box.width / 2;
	const centerY = box.top + box.height / 2;
	const rawFocus: ZoomFocus = {
		cx: clamp((centerX - baseMask.x) / baseMask.width, 0, 1),
		cy: clamp((centerY - baseMask.y) / baseMask.height, 0, 1),
	};

	const scaleForWidth = baseMask.width / box.width;
	const scaleForHeight = baseMask.height / box.height;
	const customScale = clamp(Math.min(scaleForWidth, scaleForHeight), minScale, maxScale);

	return {
		focus: clampFocusToScale(rawFocus, customScale),
		customScale,
	};
}

export function clampFocusToScale(focus: ZoomFocus, zoomScale: number): ZoomFocus {
	const baseFocus = {
		cx: clamp(focus.cx, 0, 1),
		cy: clamp(focus.cy, 0, 1),
	};
	const bounds = getFocusBoundsForScale(zoomScale);

	return {
		cx: clamp(baseFocus.cx, bounds.minX, bounds.maxX),
		cy: clamp(baseFocus.cy, bounds.minY, bounds.maxY),
	};
}

export function softenFocusToScale(focus: ZoomFocus, zoomScale: number): ZoomFocus {
	const baseFocus = {
		cx: clamp(focus.cx, 0, 1),
		cy: clamp(focus.cy, 0, 1),
	};
	const bounds = getFocusBoundsForScale(zoomScale);
	const horizontalRange = bounds.maxX - bounds.minX;
	const verticalRange = bounds.maxY - bounds.minY;
	const horizontalSoftness = Math.min(0.12, horizontalRange * 0.35);
	const verticalSoftness = Math.min(0.12, verticalRange * 0.35);

	return {
		cx: softClampToRange(baseFocus.cx, bounds.minX, bounds.maxX, horizontalSoftness),
		cy: softClampToRange(baseFocus.cy, bounds.minY, bounds.maxY, verticalSoftness),
	};
}

/**
 * Edge snap algorithm for cursor-follow camera.
 *
 * Maps cursor position through a clamped linear remap so the camera
 * pins to the edge when the cursor is within `snapToEdgesRatio` of
 * the viewport boundary.
 *
 * With snapToEdgesRatio = 0.25 (default for manual zooms):
 *   cursor ∈ [0, 0.25]   → output 0   (camera pinned to left/top)
 *   cursor ∈ [0.25, 0.75] → linearly maps 0→1 (camera follows)
 *   cursor ∈ [0.75, 1.0]  → output 1   (camera pinned to right/bottom)
 *
 * The result is then mapped back to focus-space bounds for the given
 * zoom scale, so the camera stays within the valid viewport.
 *
 * @param snapToEdgesRatio 0.25 for manual zooms, 0.5 for system/auto zooms
 */
export function edgeSnapFocus(
	cursorFocus: ZoomFocus,
	zoomScale: number,
	snapToEdgesRatio: number,
): ZoomFocus {
	const bounds = getFocusBoundsForScale(zoomScale);

	const snappedX = clampedInterpolate(
		cursorFocus.cx,
		snapToEdgesRatio,
		1 - snapToEdgesRatio + 0.0001,
	);
	const snappedY = clampedInterpolate(
		cursorFocus.cy,
		snapToEdgesRatio,
		1 - snapToEdgesRatio + 0.0001,
	);

	return {
		cx: bounds.minX + snappedX * (bounds.maxX - bounds.minX),
		cy: bounds.minY + snappedY * (bounds.maxY - bounds.minY),
	};
}

/**
 * Clamped linear interpolation: maps `value` from [inMin, inMax] → [0, 1].
 */
function clampedInterpolate(value: number, inMin: number, inMax: number): number {
	if (inMax <= inMin) return 0;
	const t = (value - inMin) / (inMax - inMin);
	return clamp(t, 0, 1);
}

export function stageFocusToVideoSpace(
	focus: ZoomFocus,
	stageSize: StageSize,
	videoSize: { width: number; height: number },
	baseScale: number,
	baseOffset: { x: number; y: number },
): ZoomFocus {
	if (
		!stageSize.width ||
		!stageSize.height ||
		!videoSize.width ||
		!videoSize.height ||
		baseScale <= 0
	) {
		return focus;
	}

	const stageX = focus.cx * stageSize.width;
	const stageY = focus.cy * stageSize.height;

	const videoNormX = (stageX - baseOffset.x) / (videoSize.width * baseScale);
	const videoNormY = (stageY - baseOffset.y) / (videoSize.height * baseScale);

	return {
		cx: videoNormX,
		cy: videoNormY,
	};
}
