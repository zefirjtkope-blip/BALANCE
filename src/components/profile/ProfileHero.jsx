// src/components/profile/ProfileHero.jsx
import React from 'react';
import { FaEdit, FaCog } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ProfileHero = ({ userProfile, isSubscribed, onEditProfile, onOpenSettings }) => {
  const { t } = useTranslation();
  const initials = userProfile.name
    ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          background: 'linear-gradient(135deg, #3a8dff, #1864ab)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 600,
          color: '#fff',
        }}>
          {initials}
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
            {userProfile.name || t('profile.default_name')}
          </h2>
          <span style={{
            display: 'inline-block',
            padding: '2px 6px',
            borderRadius: 10,
            background: isSubscribed ? '#2ed47a20' : '#333',
            color: isSubscribed ? '#2ed47a' : '#aaa',
            fontSize: 11,
            fontWeight: 600,
          }}>
            {isSubscribed ? t('pro') : t('free')}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onEditProfile}
          style={{
            width: 36,
            height: 36,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #2a2a2a',
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <FaEdit size={16} />
        </button>
        <button
          onClick={onOpenSettings}
          style={{
            width: 36,
            height: 36,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #2a2a2a',
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <FaCog size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProfileHero;