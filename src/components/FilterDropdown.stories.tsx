import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FilterDropdown from "./FilterDropdown";

const meta: Meta<typeof FilterDropdown> = {
  title: "Components/FilterDropdown",
  component: FilterDropdown,
  parameters: {
    layout: "padded",
    backgrounds: { default: "site", values: [{ name: "site", value: "#fbfbfb" }] },
  },
};

export default meta;
type Story = StoryObj<typeof FilterDropdown>;

export const FewItems: Story = {
  args: {
    label: "Countries",
    items: [
      "United States",
      "United Kingdom",
      "France",
      "Germany",
      "Japan",
      "Canada",
      "Australia",
      "Brazil",
      "India",
    ],
  },
};

export const ManyItems: Story = {
  args: {
    label: "Countries",
    items: [
      "United States",
      "United Kingdom",
      "France",
      "Germany",
      "Japan",
      "Canada",
      "Australia",
      "Brazil",
      "India",
      "China",
      "Mexico",
      "South Korea",
      "Italy",
      "Spain",
      "Netherlands",
    ],
    selected: ["France"],
  },
};

export const WithSelections: Story = {
  args: {
    label: "Countries",
    items: [
      "United States",
      "United Kingdom",
      "France",
      "Germany",
      "Japan",
    ],
    selected: ["France", "Germany"],
  },
};
