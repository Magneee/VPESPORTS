/**
 * Profile Edit Functionality
 * Handles editing of username, email, and avatar
 * Ready for WordPress integration
 */

class ProfileEditor {
  constructor() {
    this.originalData = {};
    this.changedData = {};
    this.isEditing = false;
    
    this.init();
  }

  init() {
    // Store original data
    this.storeOriginalData();
    
    // Bind event listeners
    this.bindEvents();
    
    // Initialize WordPress integration if available
    this.initWordPressIntegration();
  }

  storeOriginalData() {
    // Store original values
    this.originalData = {
      username: this.getFieldValue('username-field'),
      email: this.getFieldValue('email-field'),
      avatar: this.getAvatarSrc()
    };
  }

  bindEvents() {
    // Edit buttons
    const editUsernameBtn = document.getElementById('edit-username-button');
    const editEmailBtn = document.getElementById('edit-email-button');
    const editAvatarBtn = document.getElementById('edit-avatar-button');
    
    // Action buttons
    const cancelBtn = document.getElementById('cancel-button');
    const saveBtn = document.getElementById('save-button');

    if (editUsernameBtn) {
      editUsernameBtn.addEventListener('click', () => this.makeFieldEditable('username-field'));
    }
    
    if (editEmailBtn) {
      editEmailBtn.addEventListener('click', () => this.makeFieldEditable('email-field'));
    }
    
    if (editAvatarBtn) {
      editAvatarBtn.addEventListener('click', () => this.handleAvatarEdit());
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cancelChanges());
    }
    
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveChanges());
    }
  }

  getFieldValue(fieldId) {
    const field = document.getElementById(fieldId);
    return field ? field.textContent.trim() : '';
  }

  getAvatarSrc() {
    const avatar = document.querySelector('#profile img[alt="Profile Avatar"]');
    return avatar ? avatar.src : '';
  }

  makeFieldEditable(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field || field.tagName === 'INPUT') return;

    const currentValue = field.textContent.trim();
    const fieldType = fieldId === 'email-field' ? 'email' : 'text';
    
    // Create input element
    const input = document.createElement('input');
    input.type = fieldType;
    input.value = currentValue;
    input.className = 'flex-1 bg-transparent text-white text-base font-normal font-primary outline-none';
    input.id = `${fieldId}-input`;
    
    // Add validation for email
    if (fieldType === 'email') {
      input.pattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$';
      input.title = 'Please enter a valid email address';
    }
    
    // Replace field with input
    field.replaceWith(input);
    input.focus();
    input.select();
    
    // Handle input events
    this.handleInputEvents(input, fieldId, currentValue);
    
    this.isEditing = true;
    this.updateSaveButtonState();
  }

  handleInputEvents(input, fieldId, originalValue) {
    // Handle blur (save on blur)
    input.addEventListener('blur', () => {
      this.saveFieldValue(input, fieldId, originalValue);
    });
    
    // Handle Enter key
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
    
    // Handle Escape key
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        input.value = originalValue;
        input.blur();
      }
    });
    
    // Handle input change for real-time validation
    input.addEventListener('input', () => {
      this.validateField(input, fieldId);
    });
  }

  validateField(input, fieldId) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (fieldId === 'email-field') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
      errorMessage = 'Please enter a valid email address';
    } else if (fieldId === 'username-field') {
      isValid = value.length >= 3 && value.length <= 20;
      errorMessage = 'Username must be between 3 and 20 characters';
    }
    
    // Visual feedback
    if (!isValid && value) {
      input.style.borderColor = '#ff4444';
      input.title = errorMessage;
    } else {
      input.style.borderColor = '';
      input.title = '';
    }
    
    return isValid;
  }

  saveFieldValue(input, fieldId, originalValue) {
    const newValue = input.value.trim();
    const isValid = this.validateField(input, fieldId);
    
    // Create new field element
    const newField = document.createElement('div');
    newField.className = 'flex-1 text-white text-base font-normal font-primary';
    newField.id = fieldId;
    
    if (isValid && newValue !== originalValue) {
      // Value changed and is valid
      newField.textContent = newValue;
      this.changedData[fieldId] = newValue;
      this.showNotification('Field updated successfully', 'success');
    } else if (!isValid) {
      // Invalid value, revert to original
      newField.textContent = originalValue;
      this.showNotification('Invalid value, reverted to original', 'error');
    } else {
      // No change
      newField.textContent = originalValue;
    }
    
    // Replace input with field
    input.replaceWith(newField);
    
    this.isEditing = false;
    this.updateSaveButtonState();
  }

  handleAvatarEdit() {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.processAvatarFile(file);
      }
    });
    
    // Trigger file selection
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  processAvatarFile(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
      this.showNotification('Please select a valid image file', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      this.showNotification('Image size must be less than 5MB', 'error');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.updateAvatarPreview(e.target.result);
      this.changedData.avatar = file;
      this.showNotification('Avatar updated successfully', 'success');
    };
    reader.readAsDataURL(file);
  }

  updateAvatarPreview(src) {
    const avatar = document.querySelector('#profile img[alt="Profile Avatar"]');
    if (avatar) {
      avatar.src = src;
    }
  }

  cancelChanges() {
    // Revert all changes
    this.revertField('username-field');
    this.revertField('email-field');
    this.revertAvatar();
    
    // Clear changed data
    this.changedData = {};
    this.isEditing = false;
    this.updateSaveButtonState();
    
    this.showNotification('Changes cancelled', 'info');
  }

  revertField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field && this.originalData[fieldId.replace('-field', '')]) {
      field.textContent = this.originalData[fieldId.replace('-field', '')];
    }
  }

  revertAvatar() {
    const avatar = document.querySelector('#profile img[alt="Profile Avatar"]');
    if (avatar && this.originalData.avatar) {
      avatar.src = this.originalData.avatar;
    }
  }

  async saveChanges() {
    if (Object.keys(this.changedData).length === 0) {
      this.showNotification('No changes to save', 'info');
      return;
    }
    
    try {
      // Show loading state
      this.setSaveButtonLoading(true);
      
      // Prepare data for WordPress
      const dataToSave = {
        username: this.changedData['username-field'] || this.originalData.username,
        email: this.changedData['email-field'] || this.originalData.email,
        avatar: this.changedData.avatar || null
      };
      
      // Save to WordPress (if available)
      const success = await this.saveToWordPress(dataToSave);
      
      if (success) {
        // Update original data
        this.originalData = { ...this.originalData, ...dataToSave };
        this.changedData = {};
        this.isEditing = false;
        this.updateSaveButtonState();
        
        this.showNotification('Profile updated successfully!', 'success');
      } else {
        this.showNotification('Failed to save changes', 'error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      this.showNotification('Error saving changes', 'error');
    } finally {
      this.setSaveButtonLoading(false);
    }
  }

  async saveToWordPress(data) {
    // WordPress integration
    if (typeof wp !== 'undefined' && wp.ajax) {
      try {
        const response = await wp.ajax.post('update_user_profile', {
          username: data.username,
          email: data.email,
          avatar: data.avatar
        });
        return response.success;
      } catch (error) {
        console.error('WordPress AJAX error:', error);
        return false;
      }
    } else {
      // Fallback for non-WordPress environment
      console.log('Saving profile data:', data);
      return true; // Simulate success
    }
  }

  updateSaveButtonState() {
    const saveBtn = document.getElementById('save-button');
    if (saveBtn) {
      const hasChanges = Object.keys(this.changedData).length > 0;
      saveBtn.style.opacity = hasChanges ? '1' : '0.5';
      saveBtn.style.cursor = hasChanges ? 'pointer' : 'not-allowed';
    }
  }

  setSaveButtonLoading(loading) {
    const saveBtn = document.getElementById('save-button');
    if (saveBtn) {
      if (loading) {
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
      } else {
        saveBtn.textContent = 'Save Changes';
        saveBtn.disabled = false;
      }
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transition-all duration-300 ${
      type === 'success' ? 'bg-success' :
      type === 'error' ? 'bg-error' :
      'bg-info'
    }`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  initWordPressIntegration() {
    // WordPress specific initialization
    if (typeof wp !== 'undefined') {
      // Add WordPress nonce for security
      this.wpNonce = wp.ajax.settings.nonce;
      
      // Listen for WordPress events
      if (wp.hooks) {
        wp.hooks.addAction('profile_updated', 'vpesports', (data) => {
          this.showNotification('Profile updated via WordPress', 'success');
        });
      }
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ProfileEditor();
});

// Export for WordPress integration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProfileEditor;
} 