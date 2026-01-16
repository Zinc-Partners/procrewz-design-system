// Load external libraries synchronously before LWC components

// Cleave.js - Sets window.Cleave
import "../force-app/main/default/staticresources/cleave.js";

// Vanilla Calendar Pro - Sets window.VanillaCalendarPro
import "../force-app/main/default/staticresources/VanillaCalendarPro305/index.js";

import { registerLWC } from "../stories/index.js";

registerLWC();

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      // Show code panel on individual stories (Canvas view)
      source: {
        type: "dynamic", // Dynamically generate code from args
        language: "html"
      }
    },
    options: {
      storySort: {
        order: [
          "About",
          ["Introduction", "Getting Started"],
          "Foundation",
          ["Design Principles", "Design Tokens"],
          "Content",
          "Components"
        ]
      }
    }
  }
};

export default preview;
