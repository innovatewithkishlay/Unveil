import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useScopedT } from "@/contexts/I18nContext";
import {
	GIF_FRAME_RATES,
	GIF_SIZE_PRESETS,
	type GifFrameRate,
	type GifSizePreset,
} from "@/lib/exporter/types";

interface GifOptionsPanelProps {
	frameRate: GifFrameRate;
	onFrameRateChange: (rate: GifFrameRate) => void;
	loop: boolean;
	onLoopChange: (loop: boolean) => void;
	sizePreset: GifSizePreset;
	onSizePresetChange: (preset: GifSizePreset) => void;
	outputDimensions: { width: number; height: number };
	disabled?: boolean;
}

export function GifOptionsPanel({
	frameRate,
	onFrameRateChange,
	loop,
	onLoopChange,
	sizePreset,
	onSizePresetChange,
	outputDimensions,
	disabled = false,
}: GifOptionsPanelProps) {
	const t = useScopedT("editor");
	const sizePresetOptions = Object.entries(GIF_SIZE_PRESETS).map(([key, value]) => ({
		value: key as GifSizePreset,
		label: value.label,
	}));

	return (
		<div className="space-y-3 animate-in slide-in-from-bottom-2 duration-200">
			{/* Frame Rate */}
			<div className="flex flex-col gap-2 rounded-2xl border border-foreground/10 bg-editor-surface p-3.5">
				<label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
					<span className="h-2.5 w-[3px] rounded-full bg-[#6D4FD1]" aria-hidden="true" />
					{t("gifOptions.frameRate")}
				</label>
				<Select
					value={String(frameRate)}
					onValueChange={(value) => onFrameRateChange(Number(value) as GifFrameRate)}
					disabled={disabled}
				>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{GIF_FRAME_RATES.map((rate) => (
							<SelectItem key={rate.value} value={String(rate.value)}>
								{rate.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Size Preset */}
			<div className="flex flex-col gap-2 rounded-2xl border border-foreground/10 bg-editor-surface p-3.5">
				<label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
					<span className="h-2.5 w-[3px] rounded-full bg-[#6D4FD1]" aria-hidden="true" />
					{t("gifOptions.outputSize")}
				</label>
				<Select
					value={sizePreset}
					onValueChange={(value) => onSizePresetChange(value as GifSizePreset)}
					disabled={disabled}
				>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{sizePresetOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className="text-xs text-muted-foreground/70">
					{t("gifOptions.outputDimensions", undefined, {
						width: String(outputDimensions.width),
						height: String(outputDimensions.height),
					})}
				</div>
			</div>

			{/* Loop Toggle */}
			<div className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-editor-surface p-3.5">
				<div>
					<label className="text-sm font-medium text-foreground">
						{t("gifOptions.loopAnimation")}
					</label>
					<p className="text-xs text-muted-foreground/70">
						{t("gifOptions.loopDescription")}
					</p>
				</div>
				<Switch checked={loop} onCheckedChange={onLoopChange} disabled={disabled} />
			</div>
		</div>
	);
}
