/**
 * ProCrewz Calendar Component Stories
 *
 * A powerful date picker calendar component built on Vanilla Calendar Pro.
 * Uses the ProCrewz design system theme with brand colors.
 */

export default {
  title: "Components/Calendar",
  component: "c-procrewz-calendar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## ProCrewz Calendar

A standalone calendar component powered by [Vanilla Calendar Pro](https://vanilla-calendar.pro/).
Styled with ProCrewz design tokens for consistent branding.

### Features
- 📅 Single, multiple, and range date selection
- 🌍 Full internationalization support
- 🎨 ProCrewz branded theme with design tokens
- ♿ Accessible with keyboard navigation
- 📱 Responsive design

### Usage in Salesforce LWC

\`\`\`html
<!-- Basic single date selection -->
<c-procrewz-calendar ondatechange={handleDateChange}></c-procrewz-calendar>

<!-- Date range selection -->
<c-procrewz-calendar
  selection-mode="multiple-ranged"
  ondateschange={handleRangeChange}
></c-procrewz-calendar>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    selectionMode: {
      control: "select",
      options: ["single", "multiple", "multiple-ranged"],
      description: "Date selection mode",
      table: {
        defaultValue: { summary: "single" },
        category: "Selection"
      }
    },
    locale: {
      control: "select",
      options: ["en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh"],
      description: "Locale for month/day names",
      table: {
        defaultValue: { summary: "en" },
        category: "Localization"
      }
    },
    firstWeekday: {
      control: "select",
      options: [
        { label: "Sunday", value: 0 },
        { label: "Monday", value: 1 }
      ],
      description: "First day of the week (0 = Sunday, 1 = Monday)",
      table: {
        defaultValue: { summary: "0" },
        category: "Localization"
      }
    },
    enableWeekNumbers: {
      control: "boolean",
      description: "Show week numbers",
      table: {
        defaultValue: { summary: "false" },
        category: "Display"
      }
    },
    minDate: {
      control: "text",
      description: "Minimum selectable date (YYYY-MM-DD)",
      table: {
        defaultValue: { summary: "1970-01-01" },
        category: "Constraints"
      }
    },
    maxDate: {
      control: "text",
      description: "Maximum selectable date (YYYY-MM-DD)",
      table: {
        defaultValue: { summary: "2470-12-31" },
        category: "Constraints"
      }
    },
    selectedDate: {
      control: "text",
      description: "Pre-selected date (YYYY-MM-DD)",
      table: {
        category: "Selection"
      }
    }
  }
};

// Template helper
const createCalendar = (args) => {
  const calendar = document.createElement("c-procrewz-calendar");

  // Apply all args as attributes
  Object.entries(args).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Convert camelCase to kebab-case for attributes
      const attrName = key.replace(/([A-Z])/g, "-$1").toLowerCase();

      if (typeof value === "boolean") {
        if (value) calendar.setAttribute(attrName, "");
      } else if (Array.isArray(value)) {
        calendar[key] = value;
      } else {
        calendar.setAttribute(attrName, value);
      }
    }
  });

  // Add event listeners for demonstration
  calendar.addEventListener("datechange", (e) => {
    console.log("Date selected:", e.detail.value);
  });

  calendar.addEventListener("dateschange", (e) => {
    console.log("Dates selected:", e.detail.selectedDates);
  });

  return calendar;
};

// ============================================
// STORIES
// ============================================

/**
 * Default calendar with single date selection and ProCrewz theme.
 */
export const Default = {
  render: (args) => createCalendar(args),
  args: {
    selectionMode: "single",
    locale: "en",
    firstWeekday: 0
  }
};

/**
 * Select multiple individual dates.
 */
export const MultipleSelection = {
  render: (args) => createCalendar(args),
  args: {
    selectionMode: "multiple",
    locale: "en",
    firstWeekday: 0
  },
  parameters: {
    docs: {
      description: {
        story:
          "Allows selecting multiple individual dates. Click dates to toggle selection."
      }
    }
  }
};

/**
 * Select a date range with start and end dates.
 */
export const DateRange = {
  render: (args) => createCalendar(args),
  args: {
    selectionMode: "multiple-ranged",
    locale: "en",
    firstWeekday: 0
  },
  parameters: {
    docs: {
      description: {
        story:
          "Select a date range by clicking start and end dates. Great for booking systems and scheduling."
      }
    }
  }
};

/**
 * Calendar with week numbers displayed.
 */
export const WithWeekNumbers = {
  render: (args) => createCalendar(args),
  args: {
    selectionMode: "single",
    enableWeekNumbers: true,
    locale: "en",
    firstWeekday: 0
  },
  parameters: {
    docs: {
      description: {
        story: "Shows ISO week numbers alongside the calendar dates."
      }
    }
  }
};

/**
 * Calendar starting weeks on Monday (European style).
 */
export const MondayStart = {
  render: (args) => createCalendar(args),
  args: {
    selectionMode: "single",
    firstWeekday: 1,
    locale: "en"
  },
  parameters: {
    docs: {
      description: {
        story: "Calendar with Monday as the first day of the week."
      }
    }
  }
};

/**
 * Calendar with min and max date constraints.
 */
export const WithConstraints = {
  render: (args) => createCalendar(args),
  args: {
    selectionMode: "single",
    locale: "en",
    firstWeekday: 0,
    minDate: new Date().toISOString().split("T")[0], // Today
    maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0] // 30 days
  },
  parameters: {
    docs: {
      description: {
        story:
          "Calendar restricted to select dates between today and 30 days from now. Past dates are disabled."
      }
    }
  }
};

/**
 * Interactive playground with all controls available.
 */
export const Playground = {
  render: (args) => createCalendar(args),
  args: {
    selectionMode: "single",
    locale: "en",
    firstWeekday: 0,
    enableWeekNumbers: false,
    minDate: "",
    maxDate: ""
  },
  parameters: {
    docs: {
      description: {
        story:
          "Fully interactive calendar - try different combinations using the controls panel."
      }
    }
  }
};
