import { LightningElement, api, track } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import VanillaCalendarProResource from "@salesforce/resourceUrl/VanillaCalendarPro305";
import VanillaCalendarProTheme from "@salesforce/resourceUrl/VanillaCalendarProTheme";

export default class ProcrewzCalendar extends LightningElement {
  // ============================================
  // API Properties
  // ============================================
  @api selectedDate = null;
  @api selectedDates = [];
  @api minDate = "1970-01-01";
  @api maxDate = "2470-12-31";
  @api locale = "en";
  @api firstWeekday = 0;
  @api selectionMode = "single";
  @api enableWeekNumbers = false;
  @api disabledDates = [];
  @api holidays = [];

  // ============================================
  // Tracked State
  // ============================================
  @track _isLoading = true;
  @track _error = null;

  // ============================================
  // Private Properties
  // ============================================
  _calendar = null;
  _resourcesLoaded = false;

  // ============================================
  // Getters
  // ============================================
  get CalendarClass() {
    return window?.VanillaCalendarPro?.Calendar || undefined;
  }

  get isCalendarLoaded() {
    return !!this.CalendarClass;
  }

  get containerClass() {
    const classes = ["procrewz-calendar"];
    if (this._isLoading) classes.push("procrewz-calendar--loading");
    if (this._error) classes.push("procrewz-calendar--error");
    return classes.join(" ");
  }

  get showLoading() {
    return this._isLoading;
  }

  get showError() {
    return !!this._error;
  }

  get errorMessage() {
    return this._error;
  }

  // ============================================
  // Lifecycle
  // ============================================
  async connectedCallback() {
    await this._loadResources();
  }

  renderedCallback() {
    if (this._resourcesLoaded && !this._calendar) {
      this._initCalendar();
    }
  }

  disconnectedCallback() {
    this._destroyCalendar();
  }

  // ============================================
  // Resource Loading
  // ============================================
  async _loadResources() {
    if (this._resourcesLoaded) return;

    // Check if already loaded (e.g., by Storybook's preview.js)
    if (this.isCalendarLoaded) {
      this._resourcesLoaded = true;
      this._isLoading = false;
      return;
    }

    try {
      // Load CSS and JS
      // CSS is also in component CSS file for Storybook, but we load it here for Salesforce
      // because LWC CSS scoping can interfere with Vanilla Calendar's attribute selectors
      await Promise.all([
        loadScript(this, `${VanillaCalendarProResource}/index.js`),
        loadStyle(this, `${VanillaCalendarProResource}/styles/index.css`),
        loadStyle(this, VanillaCalendarProTheme)
      ]);
      this._resourcesLoaded = true;
      this._isLoading = false;
    } catch (error) {
      console.error("Failed to load Vanilla Calendar Pro:", error);
      this._error = "Failed to load calendar";
      this._isLoading = false;
    }
  }

  // ============================================
  // Calendar Initialization
  // ============================================
  _initCalendar() {
    const container = this.template.querySelector(".calendar-container");
    if (!container || !this.CalendarClass) return;

    // Determine calendar type based on selection mode
    let calendarType = "default";
    if (
      this.selectionMode === "multiple" ||
      this.selectionMode === "multiple-ranged"
    ) {
      calendarType = "multiple";
    }

    const config = {
      CSSClasses: {
        calendar: `vc`
      },
      type: calendarType,
      selectionDatesMode: this.selectionMode,
      settings: {
        lang: this.locale,
        visibility: {
          theme: "light", // Use light theme - we override with our design tokens in CSS
          weekNumbers: this.enableWeekNumbers
        },
        iso8601: this.firstWeekday === 1 // true = Monday first, false = Sunday first
      },
      date: {
        min: this.minDate,
        max: this.maxDate
      },
      selected: {
        dates: this._getInitialSelectedDates(),
        holidays: this.holidays
      },
      actions: {
        clickDay: (_event, calendar) => {
          this._handleDateClick(calendar);
        }
      }
    };

    console.log("Calendar config:", {
      type: calendarType,
      iso8601: config.settings.iso8601,
      firstWeekday: this.firstWeekday
    });

    try {
      this._calendar = new this.CalendarClass(container, config);
      this._calendar.init();
    } catch (error) {
      console.error("Failed to initialize calendar:", error);
      this._error = "Failed to initialize calendar";
    }
  }

  _getInitialSelectedDates() {
    if (this.selectedDates && this.selectedDates.length > 0) {
      return this.selectedDates;
    }
    if (this.selectedDate) {
      return [this.selectedDate];
    }
    return [];
  }

  _destroyCalendar() {
    if (this._calendar) {
      try {
        this._calendar.destroy();
      } catch {
        // Ignore destroy errors
      }
      this._calendar = null;
    }
  }

  // ============================================
  // Event Handlers
  // ============================================
  _handleDateClick(calendar) {
    const selectedDates = calendar.context.selectedDates || [];

    if (this.selectionMode === "single") {
      const value = selectedDates[0] || null;
      this.dispatchEvent(
        new CustomEvent("datechange", {
          detail: { value, selectedDates },
          bubbles: true,
          composed: true
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent("dateschange", {
          detail: {
            selectedDates,
            value:
              selectedDates.length > 0
                ? selectedDates[selectedDates.length - 1]
                : null
          },
          bubbles: true,
          composed: true
        })
      );
    }
  }

  // ============================================
  // Public API Methods
  // ============================================
  @api
  getSelectedDates() {
    if (this._calendar) {
      return this._calendar.context.selectedDates || [];
    }
    return [];
  }

  @api
  setSelectedDates(dates) {
    if (this._calendar) {
      this._calendar.set({ selectedDates: dates }, { dates: true });
    }
  }

  @api
  clearSelection() {
    if (this._calendar) {
      this._calendar.set({ selectedDates: [] }, { dates: true });
    }
  }

  @api
  refresh() {
    if (this._calendar) {
      this._calendar.update({ dates: true });
    }
  }

  @api
  goToDate(date) {
    if (this._calendar) {
      const dateObj = new Date(date);
      this._calendar.set(
        {
          selectedMonth: dateObj.getMonth(),
          selectedYear: dateObj.getFullYear()
        },
        { month: true, year: true }
      );
    }
  }
}
