import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useRef, memo, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SliderControlProps {
	label: string;
	value: number;
	defaultValue: number;
	min: number;
	max: number;
	step: number;
	onChange: (value: number) => void;
	formatValue: (value: number) => string;
	parseInput: (text: string) => number | null;
	accentColor?: "purple" | "blue";
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function quantizeToStep(value: number, min: number, step: number) {
	if (!(step > 0)) {
		return value;
	}

	return min + Math.round((value - min) / step) * step;
}

export const SliderControl = memo(function SliderControl({
	label,
	value,
	defaultValue: _defaultValue,
	min,
	max,
	step,
	onChange,
	formatValue,
	parseInput: _parseInput,
	accentColor: _accentColor,
}: SliderControlProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const valueTextRef = useRef<HTMLSpanElement | null>(null);
	const boundsRef = useRef<DOMRect | null>(null);
	const requestRef = useRef<number | null>(null);

	const pct = Math.min(100, Math.max(0, ((value - min) / (max - min || 1)) * 100));

	// Sync initial and prop-driven changes to CSS variable
	useEffect(() => {
		if (rootRef.current) {
			rootRef.current.style.setProperty("--slider-pct", String(pct / 100));
		}
	}, [pct]);

	const updateValue = useCallback(
		(clientX: number) => {
			const bounds = boundsRef.current;
			if (!bounds || bounds.width <= 6) {
				return;
			}

			const normalized = clamp((clientX - (bounds.left + 8)) / (bounds.width - 16), 0, 1);
			const rawValue = min + normalized * (max - min);
			const nextValue = clamp(quantizeToStep(rawValue, min, step), min, max);
			const finalValue = Number(nextValue.toFixed(6));
			const finalPct = (((finalValue - min) / (max - min || 1)) * 100).toFixed(4);

			// Direct DOM update for instant feedback
			if (rootRef.current) {
				rootRef.current.style.setProperty("--slider-pct", String(Number(finalPct) / 100));
				rootRef.current.setAttribute("aria-valuenow", String(finalValue));
				rootRef.current.setAttribute("aria-valuetext", formatValue(finalValue));
			}
			if (valueTextRef.current) {
				valueTextRef.current.textContent = formatValue(finalValue);
			}

			// Notify parent
			onChange(finalValue);
		},
		[max, min, onChange, step, formatValue],
	);

	const handlePointerDown = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			event.preventDefault();
			const pointerId = event.pointerId;
			const target = event.currentTarget;

			// Cache bounds to avoid layout thrashing during move
			boundsRef.current = target.getBoundingClientRect();

			target.setPointerCapture(pointerId);
			updateValue(event.clientX);

			const handlePointerMove = (moveEvent: PointerEvent) => {
				if (moveEvent.pointerId !== pointerId) {
					return;
				}

				if (requestRef.current) {
					cancelAnimationFrame(requestRef.current);
				}

				requestRef.current = requestAnimationFrame(() => {
					updateValue(moveEvent.clientX);
				});
			};

			const finishPointer = (finishEvent: PointerEvent) => {
				if (finishEvent.pointerId !== pointerId) {
					return;
				}

				if (requestRef.current) {
					cancelAnimationFrame(requestRef.current);
					requestRef.current = null;
				}

				if (finishEvent.type === "pointerup") {
					updateValue(finishEvent.clientX);
				}

				target.releasePointerCapture(pointerId);
				target.removeEventListener("pointermove", handlePointerMove);
				target.removeEventListener("pointerup", finishPointer);
				target.removeEventListener("pointercancel", finishPointer);
				boundsRef.current = null;
			};

			target.addEventListener("pointermove", handlePointerMove);
			target.addEventListener("pointerup", finishPointer);
			target.addEventListener("pointercancel", finishPointer);
		},
		[updateValue],
	);

	return (
		<div className="flex w-full select-none flex-col gap-1.5">
			<div className="flex items-center justify-between px-0.5">
				<span className="text-[11.5px] font-medium text-muted-foreground">{label}</span>
				<span
					ref={valueTextRef}
					className="rounded-md bg-[#6D4FD1]/10 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-[#6D4FD1]"
				>
					{formatValue(value)}
				</span>
			</div>
			<div
				ref={rootRef}
				role="slider"
				tabIndex={0}
				aria-label={label}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-valuetext={formatValue(value)}
				onPointerDown={handlePointerDown}
				onKeyDown={(event) => {
					if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
						event.preventDefault();
						onChange(clamp(quantizeToStep(value - step, min, step), min, max));
					}

					if (event.key === "ArrowRight" || event.key === "ArrowUp") {
						event.preventDefault();
						onChange(clamp(quantizeToStep(value + step, min, step), min, max));
					}
				}}
				className="relative flex h-4 w-full cursor-pointer select-none items-center outline-none focus-visible:[&_[data-thumb]]:ring-2"
				style={
					{
						"--slider-pct": String(pct / 100),
					} as React.CSSProperties
				}
			>
				<div className="pointer-events-none absolute inset-x-0 h-1.5 rounded-full bg-foreground/10" />
				<div
					className="pointer-events-none absolute h-1.5 rounded-full bg-gradient-to-r from-[#8b6ae8] to-[#6D4FD1] transition-none"
					style={{
						width: "calc(8px + var(--slider-pct) * (100% - 16px))",
					}}
				/>
				<div
					data-thumb
					className={cn(
						"pointer-events-none absolute z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-white ring-2 ring-[#6D4FD1] transition-none",
						"shadow-[0_1px_4px_0_rgba(0,0,0,0.35)] focus-visible:ring-4 focus-visible:ring-[#6D4FD1]/40",
					)}
					style={{
						left: "calc(8px + var(--slider-pct) * (100% - 16px))",
					}}
				/>
			</div>
		</div>
	);
});
