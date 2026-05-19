import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Checkbox from "./Checkbox";
import CheckboxGroup from "./CheckboxGroup";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    backgrounds: { default: "site", values: [{ name: "site", value: "#fbfbfb" }] },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Active: Story = {
  args: { label: "Active", checked: false },
};

export const Selected: Story = {
  args: { label: "Selected", checked: true },
};

export const Group: StoryObj = {
  render: () => (
    <div style={{ width: 250 }}>
      <CheckboxGroup
        items={["United States", "United Kingdom", "France", "Germany"]}
        selected={["France"]}
      />
    </div>
  ),
};

export const GroupWithScroll: StoryObj = {
  render: () => (
    <div style={{ width: 250 }}>
      <CheckboxGroup
        items={[
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
        ]}
      />
    </div>
  ),
};

export const SearchableGroup: StoryObj = {
  render: () => (
    <div style={{ width: 300 }}>
      <CheckboxGroup
        searchable
        items={[
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
        ]}
      />
    </div>
  ),
};
