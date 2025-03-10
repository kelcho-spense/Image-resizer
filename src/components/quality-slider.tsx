interface QualitySliderProps {
  value: number
  onChange: (value: number) => void
}

export function QualitySlider({ value, onChange }: QualitySliderProps) {
  return (
    <div className="relative">
      <input
        type="range"
        min="1"
        max="100"
        value={value}
        onChange={(e) => onChange(Number.parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  )
}

