import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SearchInput from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Components/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "centered",
    backgrounds: { default: "site", values: [{ name: "site", value: "#fbfbfb" }] },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: { placeholder: "Filter countries" },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};
