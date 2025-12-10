import { useState, useEffect } from 'react';
import { X, Check, Palette, User, Glasses, Smile, Shirt } from 'lucide-react';

// Avatar customization options
const skinTones = [
  { id: 'fair', color: '#fdebd0', name: 'Fair' },
  { id: 'light', color: '#f5cba7', name: 'Light' },
  { id: 'medium', color: '#d4a574', name: 'Medium' },
  { id: 'tan', color: '#c68642', name: 'Tan' },
  { id: 'brown', color: '#8d5524', name: 'Brown' },
  { id: 'dark', color: '#5c3317', name: 'Dark' },
];

const hairColors = [
  { id: 'black', color: '#1a1a2e', name: 'Black' },
  { id: 'brown', color: '#5c4033', name: 'Brown' },
  { id: 'blonde', color: '#d4a574', name: 'Blonde' },
  { id: 'red', color: '#a52a2a', name: 'Red' },
  { id: 'gray', color: '#808080', name: 'Gray' },
  { id: 'white', color: '#f5f5f5', name: 'White' },
  { id: 'blue', color: '#4a90d9', name: 'Blue' },
  { id: 'pink', color: '#ff69b4', name: 'Pink' },
  { id: 'purple', color: '#9b59b6', name: 'Purple' },
];

const hairStyles = [
  { id: 'short', name: 'Short', path: 'M20,15 Q25,5 35,5 Q45,5 50,15 L48,20 Q40,18 35,18 Q30,18 22,20 Z' },
  { id: 'medium', name: 'Medium', path: 'M15,15 Q20,0 35,0 Q50,0 55,15 L55,35 Q50,30 35,30 Q20,30 15,35 Z' },
  { id: 'long', name: 'Long', path: 'M12,15 Q18,-5 35,-5 Q52,-5 58,15 L60,55 Q55,50 35,50 Q15,50 10,55 Z' },
  { id: 'curly', name: 'Curly', path: 'M15,20 Q10,10 20,5 Q30,0 40,5 Q50,0 55,10 Q60,20 55,25 L50,22 Q45,15 35,15 Q25,15 20,22 Z' },
  { id: 'bald', name: 'Bald', path: '' },
  { id: 'buzz', name: 'Buzz Cut', path: 'M22,18 Q27,12 35,12 Q43,12 48,18 L46,20 Q40,17 35,17 Q30,17 24,20 Z' },
];

const eyeColors = [
  { id: 'brown', color: '#5c4033', name: 'Brown' },
  { id: 'blue', color: '#4a90d9', name: 'Blue' },
  { id: 'green', color: '#228b22', name: 'Green' },
  { id: 'hazel', color: '#8e7618', name: 'Hazel' },
  { id: 'gray', color: '#708090', name: 'Gray' },
  { id: 'amber', color: '#ffbf00', name: 'Amber' },
];

const accessories = [
  { id: 'none', name: 'None', icon: null },
  { id: 'glasses', name: 'Glasses', icon: Glasses },
  { id: 'sunglasses', name: 'Sunglasses', icon: Glasses },
];

const expressions = [
  { id: 'smile', name: 'Smile', mouthPath: 'M25,42 Q35,50 45,42' },
  { id: 'neutral', name: 'Neutral', mouthPath: 'M28,44 L42,44' },
  { id: 'grin', name: 'Grin', mouthPath: 'M25,42 Q35,52 45,42 Q35,48 25,42' },
  { id: 'serious', name: 'Serious', mouthPath: 'M28,46 L42,44' },
];

const backgroundColors = [
  { id: 'coral', colors: ['#f97316', '#ec4899'], name: 'Coral' },
  { id: 'ocean', colors: ['#0ea5e9', '#06b6d4'], name: 'Ocean' },
  { id: 'forest', colors: ['#22c55e', '#10b981'], name: 'Forest' },
  { id: 'sunset', colors: ['#f59e0b', '#ef4444'], name: 'Sunset' },
  { id: 'lavender', colors: ['#a855f7', '#6366f1'], name: 'Lavender' },
  { id: 'midnight', colors: ['#1e293b', '#475569'], name: 'Midnight' },
  { id: 'rose', colors: ['#f43f5e', '#fb7185'], name: 'Rose' },
  { id: 'mint', colors: ['#14b8a6', '#5eead4'], name: 'Mint' },
];

interface AvatarConfig {
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  accessory: string;
  expression: string;
  backgroundColor: string;
}

interface AvatarBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (avatarData: string) => void;
  initialConfig?: AvatarConfig;
}

type TabType = 'skin' | 'hair' | 'eyes' | 'accessories' | 'expression' | 'background';

const tabs: { id: TabType; name: string; icon: React.ElementType }[] = [
  { id: 'skin', name: 'Skin', icon: User },
  { id: 'hair', name: 'Hair', icon: Palette },
  { id: 'eyes', name: 'Eyes', icon: Smile },
  { id: 'accessories', name: 'Accessories', icon: Glasses },
  { id: 'expression', name: 'Expression', icon: Smile },
  { id: 'background', name: 'Background', icon: Palette },
];

export default function AvatarBuilder({ isOpen, onClose, onSave, initialConfig }: AvatarBuilderProps) {
  const [activeTab, setActiveTab] = useState<TabType>('skin');
  const [config, setConfig] = useState<AvatarConfig>({
    skinTone: 'medium',
    hairColor: 'brown',
    hairStyle: 'short',
    eyeColor: 'brown',
    accessory: 'none',
    expression: 'smile',
    backgroundColor: 'ocean',
  });

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  if (!isOpen) return null;

  const currentSkin = skinTones.find(s => s.id === config.skinTone) || skinTones[2];
  const currentHairColor = hairColors.find(h => h.id === config.hairColor) || hairColors[1];
  const currentHairStyle = hairStyles.find(h => h.id === config.hairStyle) || hairStyles[0];
  const currentEyeColor = eyeColors.find(e => e.id === config.eyeColor) || eyeColors[0];
  const currentExpression = expressions.find(e => e.id === config.expression) || expressions[0];
  const currentBackground = backgroundColors.find(b => b.id === config.backgroundColor) || backgroundColors[1];

  const handleSave = () => {
    // Encode the avatar config as a JSON string for storage
    const avatarData = JSON.stringify(config);
    onSave(avatarData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create Your Avatar</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Avatar Preview */}
          <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-center bg-gray-50">
            <div
              className="w-48 h-48 rounded-full overflow-hidden shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${currentBackground.colors[0]}, ${currentBackground.colors[1]})`
              }}
            >
              <svg viewBox="0 0 70 70" className="w-full h-full">
                {/* Face */}
                <ellipse cx="35" cy="38" rx="18" ry="20" fill={currentSkin.color} />
                
                {/* Hair */}
                {currentHairStyle.path && (
                  <path d={currentHairStyle.path} fill={currentHairColor.color} />
                )}
                
                {/* Eyes */}
                <ellipse cx="28" cy="36" rx="3" ry="3.5" fill="white" />
                <ellipse cx="42" cy="36" rx="3" ry="3.5" fill="white" />
                <circle cx="28" cy="36" r="1.8" fill={currentEyeColor.color} />
                <circle cx="42" cy="36" r="1.8" fill={currentEyeColor.color} />
                <circle cx="28.5" cy="35.5" r="0.6" fill="white" />
                <circle cx="42.5" cy="35.5" r="0.6" fill="white" />
                
                {/* Eyebrows */}
                <path d="M24,31 Q28,29 32,31" stroke={currentHairColor.color} strokeWidth="1.5" fill="none" />
                <path d="M38,31 Q42,29 46,31" stroke={currentHairColor.color} strokeWidth="1.5" fill="none" />
                
                {/* Nose */}
                <path d="M35,38 L35,43 Q33,45 35,45 Q37,45 35,45" stroke={`${currentSkin.color}99`} strokeWidth="1" fill="none" />
                
                {/* Mouth */}
                <path d={currentExpression.mouthPath} stroke="#c9184a" strokeWidth="2" fill="none" strokeLinecap="round" />
                
                {/* Accessories */}
                {config.accessory === 'glasses' && (
                  <>
                    <rect x="22" y="32" width="10" height="8" rx="2" fill="none" stroke="#374151" strokeWidth="1.5" />
                    <rect x="38" y="32" width="10" height="8" rx="2" fill="none" stroke="#374151" strokeWidth="1.5" />
                    <path d="M32,36 L38,36" stroke="#374151" strokeWidth="1.5" />
                    <path d="M22,36 L17,34" stroke="#374151" strokeWidth="1.5" />
                    <path d="M48,36 L53,34" stroke="#374151" strokeWidth="1.5" />
                  </>
                )}
                {config.accessory === 'sunglasses' && (
                  <>
                    <rect x="21" y="32" width="12" height="9" rx="3" fill="#1a1a2e" stroke="#374151" strokeWidth="1" />
                    <rect x="37" y="32" width="12" height="9" rx="3" fill="#1a1a2e" stroke="#374151" strokeWidth="1" />
                    <path d="M33,36 L37,36" stroke="#374151" strokeWidth="2" />
                    <path d="M21,36 L16,34" stroke="#374151" strokeWidth="1.5" />
                    <path d="M49,36 L54,34" stroke="#374151" strokeWidth="1.5" />
                  </>
                )}
                
                {/* Ears */}
                <ellipse cx="17" cy="38" rx="2" ry="3" fill={currentSkin.color} />
                <ellipse cx="53" cy="38" rx="2" ry="3" fill={currentSkin.color} />
              </svg>
            </div>
            <p className="mt-4 text-sm text-gray-500">Preview of your avatar</p>
          </div>

          {/* Customization Options */}
          <div className="w-full md:w-1/2 border-l border-gray-100">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-100 px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 h-64 overflow-y-auto">
              {activeTab === 'skin' && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Skin Tone</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {skinTones.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setConfig({ ...config, skinTone: tone.id })}
                        className={`w-10 h-10 rounded-full transition-all ${
                          config.skinTone === tone.id
                            ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: tone.color }}
                        title={tone.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'hair' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Hair Color</h3>
                    <div className="grid grid-cols-6 gap-2">
                      {hairColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setConfig({ ...config, hairColor: color.id })}
                          className={`w-10 h-10 rounded-full transition-all ${
                            config.hairColor === color.id
                              ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.color }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Hair Style</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {hairStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setConfig({ ...config, hairStyle: style.id })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            config.hairStyle === style.id
                              ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {style.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'eyes' && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Eye Color</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {eyeColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setConfig({ ...config, eyeColor: color.id })}
                        className={`w-10 h-10 rounded-full transition-all ${
                          config.eyeColor === color.id
                            ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'accessories' && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Accessories</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {accessories.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => setConfig({ ...config, accessory: acc.id })}
                        className={`px-3 py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                          config.accessory === acc.id
                            ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {acc.icon ? <acc.icon className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        {acc.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'expression' && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Expression</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {expressions.map((expr) => (
                      <button
                        key={expr.id}
                        onClick={() => setConfig({ ...config, expression: expr.id })}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          config.expression === expr.id
                            ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {expr.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'background' && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Background Color</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {backgroundColors.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => setConfig({ ...config, backgroundColor: bg.id })}
                        className={`w-12 h-12 rounded-lg transition-all ${
                          config.backgroundColor === bg.id
                            ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${bg.colors[0]}, ${bg.colors[1]})`
                        }}
                        title={bg.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper component to render a saved avatar
export function AvatarDisplay({ avatarData, size = 48 }: { avatarData: string; size?: number }) {
  let config: AvatarConfig;
  
  try {
    config = JSON.parse(avatarData);
  } catch {
    // Default fallback if invalid data
    return (
      <div
        className="rounded-full flex items-center justify-center text-white font-semibold"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)'
        }}
      >
        <User className="w-1/2 h-1/2" />
      </div>
    );
  }

  const currentSkin = skinTones.find(s => s.id === config.skinTone) || skinTones[2];
  const currentHairColor = hairColors.find(h => h.id === config.hairColor) || hairColors[1];
  const currentHairStyle = hairStyles.find(h => h.id === config.hairStyle) || hairStyles[0];
  const currentEyeColor = eyeColors.find(e => e.id === config.eyeColor) || eyeColors[0];
  const currentExpression = expressions.find(e => e.id === config.expression) || expressions[0];
  const currentBackground = backgroundColors.find(b => b.id === config.backgroundColor) || backgroundColors[1];

  return (
    <div
      className="rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${currentBackground.colors[0]}, ${currentBackground.colors[1]})`
      }}
    >
      <svg viewBox="0 0 70 70" className="w-full h-full">
        <ellipse cx="35" cy="38" rx="18" ry="20" fill={currentSkin.color} />
        {currentHairStyle.path && (
          <path d={currentHairStyle.path} fill={currentHairColor.color} />
        )}
        <ellipse cx="28" cy="36" rx="3" ry="3.5" fill="white" />
        <ellipse cx="42" cy="36" rx="3" ry="3.5" fill="white" />
        <circle cx="28" cy="36" r="1.8" fill={currentEyeColor.color} />
        <circle cx="42" cy="36" r="1.8" fill={currentEyeColor.color} />
        <circle cx="28.5" cy="35.5" r="0.6" fill="white" />
        <circle cx="42.5" cy="35.5" r="0.6" fill="white" />
        <path d="M24,31 Q28,29 32,31" stroke={currentHairColor.color} strokeWidth="1.5" fill="none" />
        <path d="M38,31 Q42,29 46,31" stroke={currentHairColor.color} strokeWidth="1.5" fill="none" />
        <path d={currentExpression.mouthPath} stroke="#c9184a" strokeWidth="2" fill="none" strokeLinecap="round" />
        {config.accessory === 'glasses' && (
          <>
            <rect x="22" y="32" width="10" height="8" rx="2" fill="none" stroke="#374151" strokeWidth="1.5" />
            <rect x="38" y="32" width="10" height="8" rx="2" fill="none" stroke="#374151" strokeWidth="1.5" />
            <path d="M32,36 L38,36" stroke="#374151" strokeWidth="1.5" />
          </>
        )}
        {config.accessory === 'sunglasses' && (
          <>
            <rect x="21" y="32" width="12" height="9" rx="3" fill="#1a1a2e" stroke="#374151" strokeWidth="1" />
            <rect x="37" y="32" width="12" height="9" rx="3" fill="#1a1a2e" stroke="#374151" strokeWidth="1" />
            <path d="M33,36 L37,36" stroke="#374151" strokeWidth="2" />
          </>
        )}
        <ellipse cx="17" cy="38" rx="2" ry="3" fill={currentSkin.color} />
        <ellipse cx="53" cy="38" rx="2" ry="3" fill={currentSkin.color} />
      </svg>
    </div>
  );
}

