import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Profile } from '../App';
import { getProfileIcon, iconOptions } from '../utils/icons';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profile: Omit<Profile, 'id'>) => void;
  onDelete?: () => void;
  editingProfile: Profile | null;
  canDelete: boolean;
}

const colorOptions = [
  { value: 'blue', label: '青', class: 'bg-blue-600' },
  { value: 'purple', label: '紫', class: 'bg-purple-600' },
  { value: 'green', label: '緑', class: 'bg-green-600' },
  { value: 'red', label: '赤', class: 'bg-red-600' },
  { value: 'orange', label: 'オレンジ', class: 'bg-orange-600' },
  { value: 'pink', label: 'ピンク', class: 'bg-pink-600' },
  { value: 'indigo', label: 'インディゴ', class: 'bg-indigo-600' },
];

export function ProfileModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  editingProfile,
  canDelete,
}: ProfileModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('blue');
  const [icon, setIcon] = useState('briefcase');

  useEffect(() => {
    if (editingProfile) {
      setName(editingProfile.name);
      setColor(editingProfile.color);
      setIcon(editingProfile.icon);
    } else {
      setName('');
      setColor('blue');
      setIcon('briefcase');
    }
  }, [editingProfile, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name: name.trim(), color, icon });
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('このプロファイルを削除しますか？関連するタスクもすべて削除されます。')) {
      onDelete();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">
            {editingProfile ? 'プロファイル編集' : '新規プロファイル'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="閉じる"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              プロファイル名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：仕事、趣味、勉強など"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
              required
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              アイコン
            </label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((option) => {
                const IconComponent = getProfileIcon(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setIcon(option.value)}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                      ${
                        icon === option.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    title={option.label}
                  >
                    <IconComponent className="w-5 h-5 text-gray-700" />
                    <span className="text-xs text-gray-600 mt-1">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              カラー
            </label>
            <div className="grid grid-cols-7 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`
                    w-10 h-10 rounded-lg ${option.class} transition-all
                    ${
                      color === option.value
                        ? 'ring-4 ring-gray-300 scale-110'
                        : 'hover:scale-105'
                    }
                  `}
                  title={option.label}
                  aria-label={option.label}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {editingProfile && canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border-2 border-red-200"
              >
                削除
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingProfile ? '更新' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}