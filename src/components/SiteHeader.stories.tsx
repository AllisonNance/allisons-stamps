import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SiteHeader from "./SiteHeader";

const sampleFilters = [
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
];

const meta: Meta<typeof SiteHeader> = {
  title: "Components/SiteHeader",
  component: SiteHeader,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "site", values: [{ name: "site", value: "#fbfbfb" }] },
  },
};

export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const Desktop: Story = {
  args: { filters: sampleFilters },
};

export const Mobile: Story = {
  args: { filters: sampleFilters },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
