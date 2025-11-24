import { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Profile } from '../App';
import { ProfileModal } from './ProfileModal';
import { getProfileIcon } from '../utils/icons';

interface ProfileSelectorProps {
  profiles: Profile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onAddProfile: (profile: Omit<Profile, 'id'>) => void;
  onUpdateProfile: (id: string, updates: Omit<Profile, 'id'>) => void;
  onDeleteProfile: (id: string) => void;
}

export function ProfileSelector({
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
}: ProfileSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: Record<string, { bg: string; activeBg: string; text: string; activeText: string }> = {
      blue: {
        bg: 'bg-blue-100',
        activeBg: 'bg-blue-600',
        text: 'text-blue-700',
        activeText: 'text-white',
      },
      purple: {
        bg: 'bg-purple-100',
        activeBg: 'bg-purple-600',
        text: 'text-purple-700',
        activeText: 'text-white',
      },
      green: {
        bg: 'bg-green-100',
        activeBg: 'bg-green-600',
        text: 'text-green-700',
        activeText: 'text-white',
      },
      red: {
        bg: 'bg-red-100',
        activeBg: 'bg-red-600',
        text: 'text-red-700',
        activeText: 'text-white',
      },
      orange: {
        bg: 'bg-orange-100',
        activeBg: 'bg-orange-600',
        text: 'text-orange-700',
        activeText: 'text-white',
      },
      pink: {
        bg: 'bg-pink-100',
        activeBg: 'bg-pink-600',
        text: 'text-pink-700',
        activeText: 'text-white',
      },
      indigo: {
        bg: 'bg-indigo-100',
        activeBg: 'bg-indigo-600',
        text: 'text-indigo-700',
        activeText: 'text-white',
      },
    };
    const colorClass = colors[color] || colors.blue;
    return isActive
      ? `${colorClass.activeBg} ${colorClass.activeText}`
      : `${colorClass.bg} ${colorClass.text}`;
  };

  const handleOpenAddModal = () => {
    setEditingProfile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (profile: Profile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProfile(null);
  };

  const handleSubmit = (profile: Omit<Profile, 'id'>) => {
    if (editingProfile) {
      onUpdateProfile(editingProfile.id, profile);
    } else {
      onAddProfile(profile);
    }
    handleCloseModal();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfileId;
          const Icon = getProfileIcon(profile.icon);
          
          return (
            <div key={profile.id} className="relative group">
              <button
                onClick={() => onSelectProfile(profile.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${getColorClasses(profile.color, isActive)}
                  ${isActive ? 'shadow-sm' : 'hover:opacity-80'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{profile.name}</span>
              </button>
              {isActive && (
                <button
                  onClick={(e) => handleOpenEditModal(profile, e)}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gray-800 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md hover:bg-gray-900"
                  aria-label="プロファイルを編集・削除"
                  title="プロファイルを編集・削除"
                >
                  <Settings className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
        
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all"
          aria-label="プロファイル追加"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">追加</span>
        </button>
      </div>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={editingProfile ? () => onDeleteProfile(editingProfile.id) : undefined}
        editingProfile={editingProfile}
        canDelete={profiles.length > 1}
      />
    </>
  );
}