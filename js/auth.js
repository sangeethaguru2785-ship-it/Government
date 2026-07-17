(function() {
  var user = null;
  try {
    user = JSON.parse(localStorage.getItem('stackly_user'));
  } catch (e) {}

  var initialsColors = [
    '#2563EB', '#7C3AED', '#059669', '#D97706',
    '#DC2626', '#0891B2', '#4F46E5', '#C026D3'
  ];

  function getColorForName(name) {
    if (!name) return initialsColors[0];
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return initialsColors[Math.abs(hash) % initialsColors.length];
  }

  window.StacklyAuth = {
    getUser: function() { return user; },
    isLoggedIn: function() { return user && user.email && user.role; },
    logout: function() {
      localStorage.removeItem('stackly_user');
      window.location.href = 'login.html';
    },
    guard: function(expectedRole) {
      if (!this.isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
      }
      if (expectedRole && user.role !== expectedRole) {
        window.location.href = user.role === 'admin' ? 'admin-dashboard.html' : 'citizen-dashboard.html';
        return false;
      }
      return true;
    },
    getName: function() {
      if (!user) return '';
      return user.name || user.email || '';
    },
    getUsername: function() {
      if (!user || !user.email) return 'User';
      var local = user.email.split('@')[0];
      if (!local) return 'User';
      return local.charAt(0).toUpperCase() + local.slice(1);
    },
    getInitials: function() {
      var name = this.getName();
      if (!name) return '?';
      var parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    },
    getInitialsColor: function() {
      return getColorForName(this.getName());
    },
    populateTopbar: function() {
      if (!user) return;
      var emailEl = document.getElementById('topbar-email');
      var roleEl = document.getElementById('topbar-role');
      if (emailEl) emailEl.textContent = this.getName();
      if (roleEl) {
        var roleLabel = user.role === 'admin' ? 'Admin' : 'Citizen';
        roleEl.textContent = roleLabel;
      }
    },
    populateSidebarProfile: function() {
      if (!user) return;
      var avatar = document.getElementById('sidebar-profile-avatar');
      var nameEl = document.getElementById('sidebar-profile-name');
      var emailEl = document.getElementById('sidebar-profile-email');
      var roleEl = document.getElementById('sidebar-profile-role');
      var initials = this.getInitials();
      var color = this.getInitialsColor();
      var displayName = this.getName();
      var roleLabel = user.role === 'admin' ? 'Administrator' : 'Citizen';
      if (avatar) {
        avatar.textContent = initials;
        avatar.style.background = color;
      }
      if (nameEl) nameEl.textContent = displayName;
      if (emailEl) emailEl.textContent = user.email;
      if (roleEl) roleEl.textContent = roleLabel;
    }
  };
})();
