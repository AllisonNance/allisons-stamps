import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FilterBar from "./FilterBar";

const meta: Meta<typeof FilterBar> = {
  title: "Components/FilterBar",
  component: FilterBar,
  parameters: {
    layout: "padded",
    backgrounds: { default: "site", values: [{ name: "site", value: "#fbfbfb" }] },
  },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  args: {
    filters: [
      {
        label: "Country",
        items: ["United States", "United Kingdom", "France", "Germany", "Japan", "Canada", "Australia"],
      },
      {
        label: "Year",
        items: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"],
      },
      {
        label: "Topic",
        items: ["Animals", "Architecture", "Art", "Aviation", "Flowers", "History", "Science"],
      },
    ],
  },
};

export const ManyItems: Story = {
  args: {
    filters: [
      {
        label: "Country",
        items: Array.from({ length: 25 }, (_, i) => `Country ${i + 1}`),
      },
      {
        label: "Year",
        items: Array.from({ length: 15 }, (_, i) => `${2024 - i}`),
      },
      {
        label: "Topic",
        items: Array.from({ length: 20 }, (_, i) => `Topic ${i + 1}`),
      },
    ],
  },
};
