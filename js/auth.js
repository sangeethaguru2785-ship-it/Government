(function() {
  var user = null;
  try {
    user = JSON.parse(localStorage.getItem('stackly_user'));
  } catch (e) {}

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
    populateTopbar: function() {
      if (!user) return;
      var emailEl = document.getElementById('topbar-email');
      var roleEl = document.getElementById('topbar-role');
      if (emailEl) emailEl.textContent = user.email;
      if (roleEl) {
        var roleLabel = user.role === 'admin' ? 'Admin' : 'Citizen';
        roleEl.textContent = roleLabel;
      }
    }
  };
})();
