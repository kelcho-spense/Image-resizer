interface QualitySliderProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function QualitySlider({ value, onChange, disabled = false }: QualitySliderProps) {
  return (
    <div className="relative">
      <input
        type="range"
        min="1"
        max="100"
        value={value}
        onChange={(e) => onChange(Number.parseInt(e.target.value))}
        disabled={disabled}
        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${disabled ? 'opacity-50' : ''}`}
        style={{
          background: disabled ? '#e5e7eb' : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  )
}

