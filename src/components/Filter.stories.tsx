import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Filter from "./Filter";

const meta: Meta<typeof Filter> = {
  title: "Components/Filter",
  component: Filter,
  parameters: {
    layout: "centered",
    backgrounds: { default: "site", values: [{ name: "site", value: "#fbfbfb" }] },
  },
  argTypes: {
    label: { control: "text" },
    count: { control: "number" },
    selected: { control: "boolean" },
    onToggle: { action: "toggled" },
  },
};

export default meta;
type Story = StoryObj<typeof Filter>;

export const Default: Story = {
  args: { label: "Sales" },
};

export const WithCount: Story = {
  args: { label: "Sales", count: 1 },
};

export const Selected: Story = {
  args: { label: "Sales", selected: true },
};

export const SelectedWithCount: Story = {
  args: { label: "Sales", count: 1, selected: true },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-8">
        <span className="w-20 text-sm text-[var(--color-icon)]">Default</span>
        <Filter label="Sales" />
        <Filter label="Sales" count={1} />
      </div>
      <div className="flex items-center gap-8">
        <span className="w-20 text-sm text-[var(--color-icon)]">Selected</span>
        <Filter label="Sales" selected />
        <Filter label="Sales" count={1} selected />
      </div>
    </div>
  ),
};
