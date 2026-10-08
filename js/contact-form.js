/**
 * TPS Empire - Contact Form Handler & Interactive Success Popup Controller
 * Prevents page refresh/redirect and displays a modern, animated confirmation modal.
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var subjectInput = document.getElementById('subject');
    var messageInput = document.getElementById('message');
    var submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');

    // Create Modal Elements if not already present
    var modalOverlay = document.getElementById('tpsContactPopup');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'tpsContactPopup';
      modalOverlay.className = 'tps-popup-overlay';
      modalOverlay.setAttribute('role', 'dialog');
      modalOverlay.setAttribute('aria-modal', 'true');
      modalOverlay.setAttribute('aria-labelledby', 'tpsPopupTitle');
      modalOverlay.setAttribute('aria-hidden', 'true');

      modalOverlay.innerHTML = [
        '<div class="tps-popup-card">',
        '  <button type="button" class="tps-popup-close-btn" id="tpsPopupCloseX" aria-label="Close message dialog">',
        '    <svg viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        '  </button>',
        '  <div class="tps-popup-icon-box">',
        '    <div class="tps-popup-ripple-1"></div>',
        '    <div class="tps-popup-ripple-2"></div>',
        '    <svg class="tps-popup-svg-check" viewBox="0 0 52 52">',
        '      <circle class="tps-check-circle" cx="26" cy="26" r="25" fill="none"/>',
        '      <path class="tps-check-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>',
        '    </svg>',
        '  </div>',
        '  <h3 class="tps-popup-title" id="tpsPopupTitle">Message Sent!</h3>',
        '  <p class="tps-popup-desc" id="tpsPopupDesc">Thank you! Your message has been successfully delivered. Our team will review your inquiry and get back to you shortly.</p>',
        '  <div class="tps-popup-meta-box">',
        '    <div class="tps-popup-meta-item">',
        '      <span class="tps-popup-meta-label">From:</span>',
        '      <span class="tps-popup-meta-value" id="tpsPopupMetaName">-</span>',
        '    </div>',
        '    <div class="tps-popup-meta-item">',
        '      <span class="tps-popup-meta-label">Subject:</span>',
        '      <span class="tps-popup-meta-value" id="tpsPopupMetaSubject">-</span>',
        '    </div>',
        '  </div>',
        '  <button type="button" class="tps-popup-action-btn" id="tpsPopupCloseBtn">',
        '    <span>Awesome, Got It!</span>',
        '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        '  </button>',
        '</div>'
      ].join('\n');

      document.body.appendChild(modalOverlay);
    }

    var popupCloseX = document.getElementById('tpsPopupCloseX');
    var popupCloseBtn = document.getElementById('tpsPopupCloseBtn');
    var popupDesc = document.getElementById('tpsPopupDesc');
    var popupMetaName = document.getElementById('tpsPopupMetaName');
    var popupMetaSubject = document.getElementById('tpsPopupMetaSubject');

    // Validation helper functions
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function clearFieldError(input) {
      if (!input) return;
      input.classList.remove('tps-input-error');
      var formGroup = input.closest('.form-group');
      if (formGroup) {
        var existingMsg = formGroup.querySelector('.tps-field-error-msg');
        if (existingMsg) existingMsg.remove();
      }
    }

    function showFieldError(input, message) {
      if (!input) return;
      clearFieldError(input);
      input.classList.add('tps-input-error');
      var formGroup = input.closest('.form-group');
      if (formGroup) {
        var errorMsg = document.createElement('div');
        errorMsg.className = 'tps-field-error-msg';
        errorMsg.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ' + message;
        formGroup.appendChild(errorMsg);
      }
    }

    // Attach real-time input error clearing
    [nameInput, emailInput, subjectInput, messageInput].forEach(function(input) {
      if (!input) return;
      input.addEventListener('input', function() {
        clearFieldError(input);
      });
    });

    // Open Modal
    function openPopup(senderName, senderEmail, senderSubject) {
      if (popupMetaName) popupMetaName.textContent = senderName || 'Valued Visitor';
      if (popupMetaSubject) popupMetaSubject.textContent = senderSubject || 'General Inquiry';
      if (popupDesc) {
        popupDesc.innerHTML = 'Thank you, <strong>' + (senderName ? escapeHtml(senderName) : 'Friend') + '</strong>! Your message has been sent successfully. We will reach out to you via <em>' + (senderEmail ? escapeHtml(senderEmail) : 'email') + '</em> soon.';
      }

      modalOverlay.classList.add('is-visible');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('tps-popup-open');

      if (popupCloseBtn) {
        setTimeout(function() {
          popupCloseBtn.focus();
        }, 150);
      }
    }

    // Close Modal
    function closePopup() {
      modalOverlay.classList.remove('is-visible');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('tps-popup-open');
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Event listeners for closing
    if (popupCloseX) popupCloseX.addEventListener('click', closePopup);
    if (popupCloseBtn) popupCloseBtn.addEventListener('click', closePopup);

    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        closePopup();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('is-visible')) {
        closePopup();
      }
    });

    // Handle Form Submit Event
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();

      var hasError = false;
      var firstErrorInput = null;

      var nameVal = nameInput ? nameInput.value.trim() : '';
      var emailVal = emailInput ? emailInput.value.trim() : '';
      var subjectVal = subjectInput ? subjectInput.value.trim() : '';
      var messageVal = messageInput ? messageInput.value.trim() : '';

      // Validate Name
      if (!nameVal || nameVal.length < 2) {
        showFieldError(nameInput, 'Please enter your full name (at least 2 characters)');
        hasError = true;
        if (!firstErrorInput) firstErrorInput = nameInput;
      }

      // Validate Email
      if (!emailVal || !isValidEmail(emailVal)) {
        showFieldError(emailInput, 'Please provide a valid email address');
        hasError = true;
        if (!firstErrorInput) firstErrorInput = emailInput;
      }

      // Validate Subject
      if (!subjectVal) {
        showFieldError(subjectInput, 'Please specify a subject for your message');
        hasError = true;
        if (!firstErrorInput) firstErrorInput = subjectInput;
      }

      // Validate Message
      if (!messageVal || messageVal.length < 5) {
        showFieldError(messageInput, 'Please write your message (at least 5 characters)');
        hasError = true;
        if (!firstErrorInput) firstErrorInput = messageInput;
      }

      if (hasError) {
        if (firstErrorInput) firstErrorInput.focus();
        return;
      }

      // Show Loading State on Submit Button
      var originalBtnValue = submitBtn ? (submitBtn.tagName === 'INPUT' ? submitBtn.value : submitBtn.innerHTML) : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('tps-btn-loading');
        if (submitBtn.tagName === 'INPUT') {
          submitBtn.value = 'Sending...';
        } else {
          submitBtn.innerHTML = '<span class="tps-btn-spinner"></span> Sending...';
        }
      }

      // Simulate asynchronous send / dispatch
      setTimeout(function() {
        // Reset submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('tps-btn-loading');
          if (submitBtn.tagName === 'INPUT') {
            submitBtn.value = originalBtnValue;
          } else {
            submitBtn.innerHTML = originalBtnValue;
          }
        }

        // Open confirmation popup
        openPopup(nameVal, emailVal, subjectVal);

        // Reset form inputs
        form.reset();
      }, 600);
    });
  });
})();
