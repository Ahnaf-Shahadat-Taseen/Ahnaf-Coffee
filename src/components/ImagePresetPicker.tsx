import React, { useState } from 'react';
import { COFFEE_PRESETS, BAKERY_PRESETS, PROFILE_PRESETS, DEFAULT_COFFEE_FALLBACK, ImagePreset } from '../data/presetImages';
import { Sparkles, Image as ImageIcon, Check, ExternalLink, Coffee, Croissant, User } from 'lucide-react';

interface ImagePresetPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  defaultCategory?: 'coffee' | 'bakery' | 'profile' | 'all';
}

export const ImagePresetPicker: React.FC<ImagePresetPickerProps> = ({
  value,
  onChange,
  label = 'Image URL & Unsplash Presets',
  defaultCategory = 'all'
}) => {
  const [activeTab, setActiveTab] = useState<'coffee' | 'bakery' | 'profile'>(
    defaultCategory === 'profile' ? 'profile' : defaultCategory === 'bakery' ? 'bakery' : 'coffee'
  );
  const [imgError, setImgError] = useState(false);

  const presetsToDisplay: ImagePreset[] = 
    activeTab === 'coffee' ? COFFEE_PRESETS :
    activeTab === 'bakery' ? BAKERY_PRESETS : PROFILE_PRESETS;

  const currentPreview = value?.trim() ? value : DEFAULT_COFFEE_FALLBACK;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#C68B59] flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          {label}
        </label>
        <span className="text-[11px] text-stone-400">Zero-cost Unsplash CDN</span>
      </div>

      {/* Input URL & Instant Live Thumbnail Preview */}
      <div className="flex gap-3 items-center">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#C68B59]/40 bg-stone-900 shrink-0 shadow-md">
          <img
            src={imgError ? DEFAULT_COFFEE_FALLBACK : currentPreview}
            alt="Preview"
            onError={() => setImgError(true)}
            onLoad={() => setImgError(false)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        </div>

        <div className="flex-1">
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => {
                setImgError(false);
                onChange(e.target.value);
              }}
              placeholder="Paste custom image URL or click presets below..."
              className="w-full bg-[#1e1713] border border-stone-700/70 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#C68B59] focus:ring-1 focus:ring-[#C68B59] transition-all"
            />
            {value && (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-[#C68B59] transition-colors"
                title="Open image in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Preset Category Switcher */}
      <div className="bg-[#1a1410] p-1 rounded-lg flex gap-1 border border-stone-800">
        <button
          type="button"
          onClick={() => setActiveTab('coffee')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeTab === 'coffee'
              ? 'bg-[#C68B59] text-white shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          Coffee Presets (6)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bakery')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeTab === 'bakery'
              ? 'bg-[#C68B59] text-white shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
          }`}
        >
          <Croissant className="w-3.5 h-3.5" />
          Bakery Presets (3)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeTab === 'profile'
              ? 'bg-[#C68B59] text-white shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Avatars (4)
        </button>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
        {presetsToDisplay.map((preset) => {
          const isSelected = value === preset.url;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setImgError(false);
                onChange(preset.url);
              }}
              title={preset.description}
              className={`group relative rounded-lg overflow-hidden aspect-square border-2 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-[#C68B59] ring-2 ring-[#C68B59]/40 scale-[1.02]'
                  : 'border-stone-800 hover:border-stone-600 opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={preset.url}
                alt={preset.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-1.5">
                <span className="text-[10px] font-semibold text-white leading-tight truncate">
                  {preset.name}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1 bg-[#C68B59] text-white rounded-full p-0.5 shadow">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
