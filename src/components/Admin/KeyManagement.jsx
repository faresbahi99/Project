// components/Admin/KeyManagement.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Admin.module.css';

const KeyManagement = () => {
  const { adminSystem } = useAuth();
  const [activeTab, setActiveTab] = useState('keys');
  const [newKeyPermissions, setNewKeyPermissions] = useState(['basic']);
  const [newKeyHours, setNewKeyHours] = useState(24);
  const [generatedKey, setGeneratedKey] = useState('');

  const allKeys = adminSystem.getAllKeys();

  const generateNewKey = () => {
    const key = adminSystem.generateTempKey(newKeyPermissions, newKeyHours);
    setGeneratedKey(key);
  };

  const revokeKey = (key) => {
    adminSystem.revokeTempKey(key);
    // إعادة تحميل المفاتيح
    setGeneratedKey('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Key copied to clipboard!');
  };

  return (
    <div className={styles.keyManagement}>
      <div className={styles.sectionHeader}>
        <h2>Admin Key Management</h2>
        <p>Manage and generate admin access keys</p>
      </div>

      <div className={styles.keyTabs}>
        <button
          className={`${styles.keyTab} ${activeTab === 'keys' ? styles.active : ''}`}
          onClick={() => setActiveTab('keys')}
        >
          <i className="fas fa-key"></i>
          Current Keys
        </button>
        <button
          className={`${styles.keyTab} ${activeTab === 'generate' ? styles.active : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          <i className="fas fa-plus"></i>
          Generate New Key
        </button>
        <button
          className={`${styles.keyTab} ${activeTab === 'permanent' ? styles.active : ''}`}
          onClick={() => setActiveTab('permanent')}
        >
          <i className="fas fa-shield-alt"></i>
          Permanent Keys
        </button>
      </div>

      <div className={styles.keyContent}>
        {activeTab === 'keys' && (
          <div className={styles.keysList}>
            <h3>Active Admin Keys</h3>
            {allKeys.length > 0 ? (
              <div className={styles.keysTable}>
                <div className={styles.tableHeader}>
                  <span>Key</span>
                  <span>Type</span>
                  <span>Level</span>
                  <span>Permissions</span>
                  <span>Expires</span>
                  <span>Actions</span>
                </div>
                {allKeys.map((keyData, index) => (
                  <div key={index} className={styles.tableRow}>
                    <div className={styles.keyCell}>
                      <code>{keyData.key}</code>
                      <button 
                        className={styles.copyBtn}
                        onClick={() => copyToClipboard(keyData.key)}
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                    <div className={styles.typeCell}>
                      <span className={`${styles.typeBadge} ${keyData.type === 'permanent' ? styles.permanent : styles.temporary}`}>
                        {keyData.type}
                      </span>
                    </div>
                    <div className={styles.levelCell}>
                      <span className={styles.levelBadge}>{keyData.level}</span>
                    </div>
                    <div className={styles.permissionsCell}>
                      {keyData.permissions.slice(0, 2).map((perm, i) => (
                        <span key={i} className={styles.permissionTag}>{perm}</span>
                      ))}
                      {keyData.permissions.length > 2 && (
                        <span className={styles.moreTag}>+{keyData.permissions.length - 2}</span>
                      )}
                    </div>
                    <div className={styles.expiresCell}>
                      {keyData.type === 'permanent' ? 'Never' : keyData.expires}
                    </div>
                    <div className={styles.actionsCell}>
                      {keyData.type === 'temporary' && (
                        <button 
                          className={`btn btn-outline ${styles.smallBtn}`}
                          onClick={() => revokeKey(keyData.key)}
                        >
                          <i className="fas fa-ban"></i>
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noKeys}>No active keys found</p>
            )}
          </div>
        )}

        {activeTab === 'generate' && (
          <div className={styles.generateKey}>
            <h3>Generate Temporary Admin Key</h3>
            
            <div className={styles.keyForm}>
              <div className={styles.formGroup}>
                <label>Permissions</label>
                <div className={styles.permissionsGrid}>
                  {['basic', 'manage_users', 'view_analytics', 'manage_records', 'system_settings'].map(permission => (
                    <label key={permission} className={styles.permissionOption}>
                      <input
                        type="checkbox"
                        checked={newKeyPermissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewKeyPermissions([...newKeyPermissions, permission]);
                          } else {
                            setNewKeyPermissions(newKeyPermissions.filter(p => p !== permission));
                          }
                        }}
                      />
                      <span>{permission.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Expires After (hours)</label>
                <select 
                  value={newKeyHours} 
                  onChange={(e) => setNewKeyHours(parseInt(e.target.value))}
                >
                  <option value={1}>1 Hour</option>
                  <option value={24}>24 Hours</option>
                  <option value={168}>1 Week</option>
                  <option value={720}>30 Days</option>
                </select>
              </div>

              <button className="btn btn-primary" onClick={generateNewKey}>
                <i className="fas fa-key"></i>
                Generate Admin Key
              </button>
            </div>

            {generatedKey && (
              <div className={styles.generatedKey}>
                <h4>Generated Admin Key</h4>
                <div className={styles.keyDisplay}>
                  <code>{generatedKey}</code>
                  <button 
                    className="btn btn-outline"
                    onClick={() => copyToClipboard(generatedKey)}
                  >
                    <i className="fas fa-copy"></i>
                    Copy Key
                  </button>
                </div>
                <div className={styles.keyWarning}>
                  <i className="fas fa-exclamation-triangle"></i>
                  <p>Save this key securely! It will not be shown again.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'permanent' && (
          <div className={styles.permanentKeys}>
            <h3>Permanent Admin Keys</h3>
            <div className={styles.permanentKeysInfo}>
              <div className={styles.infoCard}>
                <i className="fas fa-info-circle"></i>
                <div>
                  <h4>Permanent Keys</h4>
                  <p>These keys have unlimited access and should be stored securely. 
                     They are defined in the system configuration.</p>
                </div>
              </div>

              <div className={styles.keysList}>
                {Object.entries(adminSystem.ADMIN_KEYS).map(([key, data]) => (
                  <div key={key} className={styles.permanentKeyItem}>
                    <div className={styles.keyInfo}>
                      <div className={styles.keyHeader}>
                        <code className={styles.keyCode}>{key}</code>
                        <span className={`${styles.levelBadge} ${data.level === 'super' ? styles.superBadge : styles.adminBadge}`}>
                          {data.level}
                        </span>
                      </div>
                      <div className={styles.keyPermissions}>
                        {data.permissions.map((perm, index) => (
                          <span key={index} className={styles.permissionTag}>
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.keyStatus}>
                      <span className={styles.statusActive}>Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyManagement;