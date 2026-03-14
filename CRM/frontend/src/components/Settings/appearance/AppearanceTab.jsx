// src/components/Settings/appearance/AppearanceTab.jsx
import DateTimeFormat from "./DateTimeFormat";
import DensitySelector from "./DensitySelector";
import DisplayOptions from "./DisplayOptions";
import FontSizeSelector from "./FontSizeSelector";
import ThemeSelector from "./ThemeSelector";

const AppearanceTab = ({ appearance, onAppearanceChange }) => {
  return (
    <div className="space-y-6">
      <ThemeSelector
        value={appearance.theme}
        onChange={(value) => onAppearanceChange("theme", value)}
      />

      <FontSizeSelector
        value={appearance.fontSize}
        onChange={(value) => onAppearanceChange("fontSize", value)}
      />

      <DensitySelector
        value={appearance.density}
        onChange={(value) => onAppearanceChange("density", value)}
      />

      <DisplayOptions settings={appearance} onChange={onAppearanceChange} />

      <DateTimeFormat settings={appearance} onChange={onAppearanceChange} />
    </div>
  );
};

export default AppearanceTab;
