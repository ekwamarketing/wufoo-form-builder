/**
 * Ekwa Vanilla Datepicker
 * Lightweight custom datepicker with no external dependencies.
 * Supports: disable past/future dates, disable weekends, min/max date,
 * placeholder, keyboard navigation, full accessibility.
 */
(function () {
    'use strict';

    var MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    var DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // ── helpers ──────────────────────────────────────────────────────────

    function toDateOnly(d) {
        var dt = d ? new Date(d) : new Date();
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    }

    function formatISO(date) {
        var y = date.getFullYear();
        var m = String(date.getMonth() + 1).padStart(2, '0');
        var d = String(date.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + d;
    }

    function formatDisplay(date) {
        return MONTH_NAMES[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    }

    function parseDate(str) {
        if (!str) return null;
        var parts = str.split('-');
        if (parts.length !== 3) return null;
        var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        return isNaN(d.getTime()) ? null : d;
    }

    function datesEqual(a, b) {
        if (!a || !b) return false;
        return a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();
    }

    // ── calendar builder ────────────────────────────────────────────────

    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    }

    // ── datepicker class ────────────────────────────────────────────────

    function EkwaDatepicker(input) {
        this.input = input;
        this.hiddenInput = null;
        this.calendar = null;
        this.isOpen = false;
        this.selectedDate = null;
        this.viewYear = 0;
        this.viewMonth = 0;
        this.focusedDay = null;

        // read config from data attributes
        this.disablePast = input.getAttribute('data-disable-past') === 'true';
        this.disableFuture = input.getAttribute('data-disable-future') === 'true';
        this.disableWeekends = input.getAttribute('data-disable-weekends') === 'true';
        this.minDate = parseDate(input.getAttribute('min'));
        this.maxDate = parseDate(input.getAttribute('max'));

        this._init();
    }

    EkwaDatepicker.prototype._init = function () {
        var self = this;
        var input = this.input;

        // Create a hidden input that carries the ISO value for form submission
        this.hiddenInput = document.createElement('input');
        this.hiddenInput.type = 'hidden';
        this.hiddenInput.name = input.name;
        this.hiddenInput.value = input.value || '';
        // Transfer required to hidden input for native form validation
        if (input.hasAttribute('required')) {
            this.hiddenInput.setAttribute('required', '');
        }
        if (input.hasAttribute('aria-required')) {
            this.hiddenInput.setAttribute('aria-required', input.getAttribute('aria-required'));
        }
        input.parentNode.insertBefore(this.hiddenInput, input.nextSibling);

        // The visible input becomes display-only (shows formatted date)
        input.removeAttribute('name'); // form submits via hidden input
        input.setAttribute('type', 'text');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-haspopup', 'dialog');
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('autocomplete', 'off');
        input.style.cursor = 'pointer';

        // If there's an existing value, display it
        if (input.value) {
            var d = parseDate(input.value);
            if (d) {
                this.selectedDate = d;
                input.value = formatDisplay(d);
                this.hiddenInput.value = formatISO(d);
            }
        }

        // Set initial view to selected date or today
        var now = toDateOnly();
        this.viewYear = this.selectedDate ? this.selectedDate.getFullYear() : now.getFullYear();
        this.viewMonth = this.selectedDate ? this.selectedDate.getMonth() : now.getMonth();

        // Build calendar DOM
        this._buildCalendar();

        // Events on input
        input.addEventListener('click', function (e) {
            e.stopPropagation();
            self.toggle();
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                if (!self.isOpen) self.open();
            }
            if (e.key === 'Escape' && self.isOpen) {
                e.preventDefault();
                self.close();
            }
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (self.isOpen && !self.calendar.contains(e.target) && e.target !== input) {
                self.close();
            }
        });
    };

    // ── build DOM ───────────────────────────────────────────────────────

    EkwaDatepicker.prototype._buildCalendar = function () {
        var cal = document.createElement('div');
        cal.className = 'ekwa-dp-calendar';
        cal.setAttribute('role', 'dialog');
        cal.setAttribute('aria-label', 'Date picker calendar');
        cal.style.display = 'none';

        // Position relative to the form-datepicker container or input parent
        var container = this.input.closest('.form-datepicker') || this.input.parentNode;
        container.style.position = 'relative';
        container.appendChild(cal);

        this.calendar = cal;
        this._render();
    };

    EkwaDatepicker.prototype._render = function () {
        var self = this;
        var cal = this.calendar;
        cal.innerHTML = '';

        // Header
        var header = document.createElement('div');
        header.className = 'ekwa-dp-header';

        var prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'ekwa-dp-prev';
        prevBtn.setAttribute('aria-label', 'Previous month');
        prevBtn.innerHTML = '&#8249;';
        prevBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            self._changeMonth(-1);
        });

        var title = document.createElement('span');
        title.className = 'ekwa-dp-title';
        title.textContent = MONTH_NAMES[this.viewMonth] + ' ' + this.viewYear;

        var nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'ekwa-dp-next';
        nextBtn.setAttribute('aria-label', 'Next month');
        nextBtn.innerHTML = '&#8250;';
        nextBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            self._changeMonth(1);
        });

        header.appendChild(prevBtn);
        header.appendChild(title);
        header.appendChild(nextBtn);
        cal.appendChild(header);

        // Day-of-week labels
        var dowRow = document.createElement('div');
        dowRow.className = 'ekwa-dp-dow';
        for (var i = 0; i < 7; i++) {
            var dow = document.createElement('span');
            dow.textContent = DAY_LABELS[i];
            dow.setAttribute('aria-hidden', 'true');
            dowRow.appendChild(dow);
        }
        cal.appendChild(dowRow);

        // Days grid
        var grid = document.createElement('div');
        grid.className = 'ekwa-dp-grid';
        grid.setAttribute('role', 'grid');
        grid.setAttribute('aria-label', MONTH_NAMES[this.viewMonth] + ' ' + this.viewYear);

        var daysInMonth = getDaysInMonth(this.viewYear, this.viewMonth);
        var firstDay = getFirstDayOfMonth(this.viewYear, this.viewMonth);
        var today = toDateOnly();

        // leading blanks
        for (var b = 0; b < firstDay; b++) {
            var blank = document.createElement('span');
            blank.className = 'ekwa-dp-blank';
            grid.appendChild(blank);
        }

        for (var d = 1; d <= daysInMonth; d++) {
            var date = new Date(this.viewYear, this.viewMonth, d);
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'ekwa-dp-day';
            btn.textContent = d;
            btn.setAttribute('role', 'gridcell');
            btn.setAttribute('data-date', formatISO(date));
            btn.setAttribute('tabindex', '-1');

            var disabled = this._isDisabled(date);
            if (disabled) {
                btn.classList.add('ekwa-dp-disabled');
                btn.setAttribute('aria-disabled', 'true');
                btn.disabled = true;
            }
            if (datesEqual(date, today)) {
                btn.classList.add('ekwa-dp-today');
            }
            if (datesEqual(date, this.selectedDate)) {
                btn.classList.add('ekwa-dp-selected');
                btn.setAttribute('aria-selected', 'true');
            }

            if (!disabled) {
                (function (dateVal) {
                    btn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        self._select(dateVal);
                    });
                })(date);
            }

            grid.appendChild(btn);
        }

        cal.appendChild(grid);

        // Keyboard nav on the grid
        grid.addEventListener('keydown', function (e) {
            self._handleGridKeydown(e);
        });
    };

    // ── date restriction check ──────────────────────────────────────────

    EkwaDatepicker.prototype._isDisabled = function (date) {
        var today = toDateOnly();
        if (this.disablePast && date < today) return true;
        if (this.disableFuture && date > today) return true;
        if (this.disableWeekends && (date.getDay() === 0 || date.getDay() === 6)) return true;
        if (this.minDate && date < this.minDate) return true;
        if (this.maxDate && date > this.maxDate) return true;
        return false;
    };

    // ── actions ─────────────────────────────────────────────────────────

    EkwaDatepicker.prototype._select = function (date) {
        this.selectedDate = date;
        this.input.value = formatDisplay(date);
        this.hiddenInput.value = formatISO(date);
        // Dispatch change on the hidden input so form-validation picks it up
        this.hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
        clearDateWarning(this.input);
        this.close();
        this.input.focus();
    };

    EkwaDatepicker.prototype._changeMonth = function (delta) {
        this.viewMonth += delta;
        if (this.viewMonth > 11) { this.viewMonth = 0; this.viewYear++; }
        if (this.viewMonth < 0) { this.viewMonth = 11; this.viewYear--; }
        this._render();
        if (this.isOpen) this._focusFirstAvailable();
    };

    EkwaDatepicker.prototype.open = function () {
        if (this.isOpen) return;
        // Reset view to selected or current month
        if (this.selectedDate) {
            this.viewYear = this.selectedDate.getFullYear();
            this.viewMonth = this.selectedDate.getMonth();
        }
        this._render();
        this.calendar.style.display = '';
        this.isOpen = true;
        this.input.setAttribute('aria-expanded', 'true');
        this._focusFirstAvailable();
    };

    EkwaDatepicker.prototype.close = function () {
        if (!this.isOpen) return;
        this.calendar.style.display = 'none';
        this.isOpen = false;
        this.input.setAttribute('aria-expanded', 'false');
    };

    EkwaDatepicker.prototype.toggle = function () {
        this.isOpen ? this.close() : this.open();
    };

    // ── keyboard navigation ─────────────────────────────────────────────

    EkwaDatepicker.prototype._focusFirstAvailable = function () {
        var sel = this.calendar.querySelector('.ekwa-dp-selected:not(.ekwa-dp-disabled)')
            || this.calendar.querySelector('.ekwa-dp-today:not(.ekwa-dp-disabled)')
            || this.calendar.querySelector('.ekwa-dp-day:not(.ekwa-dp-disabled)');
        if (sel) {
            sel.setAttribute('tabindex', '0');
            sel.focus();
        }
    };

    EkwaDatepicker.prototype._handleGridKeydown = function (e) {
        var focused = document.activeElement;
        if (!focused || !focused.classList.contains('ekwa-dp-day')) {
            if (e.key === 'Escape') { e.preventDefault(); this.close(); this.input.focus(); }
            return;
        }

        var days = Array.prototype.slice.call(
            this.calendar.querySelectorAll('.ekwa-dp-day')
        );
        var idx = days.indexOf(focused);

        switch (e.key) {
            case 'ArrowRight': e.preventDefault(); this._moveFocus(days, idx, 1); break;
            case 'ArrowLeft': e.preventDefault(); this._moveFocus(days, idx, -1); break;
            case 'ArrowDown': e.preventDefault(); this._moveFocus(days, idx, 7); break;
            case 'ArrowUp': e.preventDefault(); this._moveFocus(days, idx, -7); break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (!focused.classList.contains('ekwa-dp-disabled')) {
                    focused.click();
                }
                break;
            case 'Escape':
                e.preventDefault();
                this.close();
                this.input.focus();
                break;
            case 'PageDown':
                e.preventDefault();
                this._changeMonth(e.shiftKey ? 12 : 1);
                break;
            case 'PageUp':
                e.preventDefault();
                this._changeMonth(e.shiftKey ? -12 : -1);
                break;
            case 'Home':
                e.preventDefault();
                this._focusDayAt(days, 0, 1);
                break;
            case 'End':
                e.preventDefault();
                this._focusDayAt(days, days.length - 1, -1);
                break;
            case 'Tab':
                this.close();
                break;
        }
    };

    EkwaDatepicker.prototype._moveFocus = function (days, current, offset) {
        var target = current + offset;
        if (target < 0) { this._changeMonth(-1); return; }
        if (target >= days.length) { this._changeMonth(1); return; }

        var step = offset > 0 ? 1 : -1;
        var attempts = 0;
        while (target >= 0 && target < days.length && days[target].classList.contains('ekwa-dp-disabled') && attempts < 31) {
            target += step;
            attempts++;
        }
        if (target >= 0 && target < days.length && !days[target].classList.contains('ekwa-dp-disabled')) {
            days.forEach(function (d) { d.setAttribute('tabindex', '-1'); });
            days[target].setAttribute('tabindex', '0');
            days[target].focus();
        }
    };

    EkwaDatepicker.prototype._focusDayAt = function (days, start, step) {
        var i = start;
        while (i >= 0 && i < days.length) {
            if (!days[i].classList.contains('ekwa-dp-disabled')) {
                days.forEach(function (d) { d.setAttribute('tabindex', '-1'); });
                days[i].setAttribute('tabindex', '0');
                days[i].focus();
                return;
            }
            i += step;
        }
    };

    // ── warning helpers ─────────────────────────────────────────────────

    function showDateWarning(input, message) {
        clearDateWarning(input);
        var container = input.closest('.form-datepicker');
        if (container) {
            var warning = document.createElement('span');
            warning.className = 'date-warning';
            warning.style.cssText = 'color: #ff9800; font-size: 11px; margin-top: 2px; display: block;';
            warning.textContent = message;
            container.appendChild(warning);
            setTimeout(function () { clearDateWarning(input); }, 5000);
        }
    }

    function clearDateWarning(input) {
        var container = input.closest('.form-datepicker');
        if (container) {
            var w = container.querySelector('.date-warning');
            if (w) w.remove();
        }
    }

    // ── bootstrap ───────────────────────────────────────────────────────

    function initializeDatepickers() {
        var inputs = document.querySelectorAll('input.ekwa-datepicker');
        inputs.forEach(function (input) {
            if (!input.hasAttribute('data-datepicker-setup')) {
                new EkwaDatepicker(input);
                input.setAttribute('data-datepicker-setup', 'true');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', initializeDatepickers);

    // Handle dynamically added datepickers
    if (window.MutationObserver) {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1 && node.querySelectorAll) {
                            if (node.querySelectorAll('input.ekwa-datepicker').length > 0) {
                                setTimeout(initializeDatepickers, 100);
                            }
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.EkwaDatepicker = {
        initializeDatepickers: initializeDatepickers
    };

})();