import type { AnnotationRegion } from "../types";

/** Return whether an annotation is composited at the supplied media timestamp. */
export function isAnnotationActiveAtTime(
	annotation: Pick<AnnotationRegion, "startMs" | "endMs">,
	timeMs: number,
): boolean {
	return (
		Number.isFinite(annotation.startMs) &&
		Number.isFinite(annotation.endMs) &&
		timeMs >= annotation.startMs &&
		timeMs <= annotation.endMs
	);
}

/** Return whether the current playhead has left the selected annotation's range. */
export function shouldClearSelectedAnnotation(
	annotations: AnnotationRegion[],
	selectedAnnotationId: string | null | undefined,
	timeMs: number,
): boolean {
	if (!selectedAnnotationId) {
		return false;
	}

	const selectedAnnotation = annotations.find(
		(annotation) => annotation.id === selectedAnnotationId,
	);
	return Boolean(selectedAnnotation && !isAnnotationActiveAtTime(selectedAnnotation, timeMs));
}
