/* Field validation — shared across the site */
(function () {
  'use strict';

  var CONTAINER_SEL = '.col-md-6, .col-12, .col-lg-6, .mb-3, .mb-4, .input-group, form, div';

  var NAME_RE    = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  var EMAIL_RE   = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  var PHONE_RE   = /^[6-9]\d{9}$/;
  var AADHAAR_RE = /^\d{12}$/;

  var MSG_NAME    = 'Name should contain only letters.';
  var MSG_EMAIL   = 'Please enter a valid email address using only letters, numbers, @, and . (e.g., example@gmail.com).';
  var MSG_PHONE   = 'Phone number must be a valid 10-digit Indian mobile number starting with 6-9.';
  var MSG_AADHAAR = 'Aadhaar number must be exactly 12 digits.';
  var MSG_EMAIL_OR_AADHAAR = 'Please enter a valid email address or 12-digit Aadhaar number.';

  /* ---------- helpers ---------- */

  function getContainer(input) {
    return input.closest(CONTAINER_SEL);
  }

  function showError(input, msg) {
    input.classList.add('is-invalid');
    var c = getContainer(input);
    if (!c) return;
    var existing = c.querySelector('.invalid-feedback');
    if (existing) {
      existing.textContent = msg;
    } else {
      var el = document.createElement('div');
      el.className = 'invalid-feedback';
      el.textContent = msg;
      c.appendChild(el);
    }
  }

  function clearError(input) {
    input.classList.remove('is-invalid');
    var c = getContainer(input);
    if (c) {
      var fb = c.querySelector('.invalid-feedback');
      if (fb) fb.remove();
    }
  }

  /* ---------- sanitizers & validators ---------- */

  function sanitizeName(value) {
    var v = value.trim().replace(/[^A-Za-z ]/g, '').replace(/ {2,}/g, ' ');
    return v;
  }

  function sanitizeEmail(value) {
    var v = value.replace(/[^a-zA-Z0-9.@]/g, '');
    v = v.replace(/\.{2,}/g, '.');
    return v;
  }

  function sanitizePhone(value) {
    return value.replace(/[^0-9]/g, '');
  }

  function sanitizeAadhaar(value) {
    return value.replace(/[^0-9]/g, '').slice(0, 12);
  }

  function checkPasswordRequirements(val) {
    return {
      length:  val.length >= 8,
      upper:   /[A-Z]/.test(val),
      lower:   /[a-z]/.test(val),
      number:  /[0-9]/.test(val),
      special: /[@#$%&*!\^]/.test(val)
    };
  }

  function updatePasswordUI(input, checks) {
    var container = input.closest('.input-group') ? input.closest('.input-group').parentElement : input.parentElement;
    var reqs = container.querySelectorAll('.pw-req');
    var allPassed = true;

    reqs.forEach(function (el) {
      var key = el.getAttribute('data-req');
      if (checks[key]) {
        el.classList.add('pw-req-met');
        el.classList.remove('pw-req-fail');
        el.querySelector('i').className = 'bi bi-check-circle-fill';
      } else {
        el.classList.remove('pw-req-met');
        el.classList.add('pw-req-fail');
        el.querySelector('i').className = 'bi bi-circle';
        allPassed = false;
      }
    });

    return allPassed;
  }

  function buildPasswordMessage(checks) {
    var missing = [];
    if (!checks.length)  missing.push('at least 8 characters');
    if (!checks.upper)   missing.push('one uppercase letter');
    if (!checks.lower)   missing.push('one lowercase letter');
    if (!checks.number)  missing.push('one number');
    if (!checks.special) missing.push('one special character');
    return 'Password must contain ' + missing.join(', ') + '.';
  }

  function validateField(input) {
    var type = input.getAttribute('data-validate');
    var val  = input.value;

    if (type === 'password') {
      if (val === '') {
        clearError(input);
        var container = input.closest('.input-group') ? input.closest('.input-group').parentElement : input.parentElement;
        var reqs = container.querySelectorAll('.pw-req');
        reqs.forEach(function (el) {
          el.classList.remove('pw-req-met', 'pw-req-fail');
          el.querySelector('i').className = 'bi bi-circle';
        });
        return true;
      }
      var checks = checkPasswordRequirements(val);
      var allMet = updatePasswordUI(input, checks);
      if (!allMet) {
        showError(input, buildPasswordMessage(checks));
        return false;
      }
      clearError(input);
      return true;
    }

    // Empty — let native 'required' handle it
    if (val.trim() === '') { clearError(input); return true; }

    if (type === 'name') {
      if (!NAME_RE.test(val)) { showError(input, MSG_NAME); return false; }
      clearError(input);
      return true;
    }

    if (type === 'email') {
      if (!EMAIL_RE.test(val)) { showError(input, MSG_EMAIL); return false; }
      clearError(input);
      return true;
    }

    if (type === 'phone') {
      if (!PHONE_RE.test(val)) { showError(input, MSG_PHONE); return false; }
      clearError(input);
      return true;
    }

    if (type === 'aadhaar') {
      if (!AADHAAR_RE.test(val)) { showError(input, MSG_AADHAAR); return false; }
      clearError(input);
      return true;
    }

    if (type === 'email-or-aadhaar') {
      if (/@/.test(val)) {
        if (!EMAIL_RE.test(val)) { showError(input, MSG_EMAIL); return false; }
        clearError(input);
        return true;
      }
      if (/^\d+$/.test(val)) {
        if (!AADHAAR_RE.test(val)) { showError(input, MSG_AADHAAR); return false; }
        clearError(input);
        return true;
      }
      showError(input, MSG_EMAIL_OR_AADHAAR);
      return false;
    }

    clearError(input);
    return true;
  }

  /* ---------- init ---------- */

  function init() {
    var selectors = '[data-validate="name"], [data-validate="email"], [data-validate="password"], [data-validate="phone"], [data-validate="aadhaar"], [data-validate="email-or-aadhaar"]';
    var fields = document.querySelectorAll(selectors);

    fields.forEach(function (input) {
      var type = input.getAttribute('data-validate');

      input.addEventListener('input', function () {
        if (type === 'name') {
          var cursorPos = this.selectionStart;
          var before = this.value;
          this.value = sanitizeName(before);
          if (this.value.length !== before.length) {
            var diff = before.length - this.value.length;
            this.setSelectionRange(cursorPos - diff, cursorPos - diff);
          }
        } else if (type === 'email') {
          var cursorPos = this.selectionStart;
          var before = this.value;
          this.value = sanitizeEmail(before);
          if (this.value.length !== before.length) {
            var diff = before.length - this.value.length;
            this.setSelectionRange(cursorPos - diff, cursorPos - diff);
          }
        } else if (type === 'phone') {
          this.value = sanitizePhone(this.value);
        } else if (type === 'aadhaar') {
          this.value = sanitizeAadhaar(this.value);
        } else if (type === 'email-or-aadhaar') {
          // No sanitization — free-form input, validated on blur/input
        }
        validateField(this);
      });

      input.addEventListener('blur', function () {
        validateField(this);
      });

      input.addEventListener('focus', function () {
        if (type !== 'password') clearError(this);
      });
    });

    document.querySelectorAll('form').forEach(function (form) {
      var validated = form.querySelectorAll(selectors);
      if (validated.length === 0) return;

      form.addEventListener('submit', function (e) {
        var allValid = true;
        validated.forEach(function (input) {
          if (!validateField(input)) allValid = false;
        });
        if (!allValid) {
          e.preventDefault();
          e.stopPropagation();
          var first = form.querySelector('.is-invalid');
          if (first) first.focus();
        }
      });
    });
  }

  /* ---------- bootstrap ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
