// src/components/Settings/appearance/FontSizeSelector.jsx
import React from 'react';
import SettingsSection from '../common/SettingsSection';

const FontSizeSelector = ({ value, onChange }) => {
    const sizes = ['small', 'medium', 'large'];

    return (
        <SettingsSection title="Font Size">
            <div className="flex space-x-2">
                {sizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => onChange(size)}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                            value === size
                                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                        }`}
                    >
                        <span className={`block text-center capitalize ${
                            size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg'
                        }`}>
                            {size}
                        </span>
                    </button>
                ))}
            </div>
        </SettingsSection>
    );
};

export default FontSizeSelector;