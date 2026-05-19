import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pagination from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    backgrounds: { default: "site", values: [{ name: "site", value: "#fbfbfb" }] },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const LargeBeginning: Story = {
  name: "Large screens - beginning",
  args: { currentPage: 1, totalPages: 20, size: "large" },
};

export const LargeMiddle: Story = {
  name: "Large screens - middle",
  args: { currentPage: 12, totalPages: 20, size: "large" },
};

export const SmallBeginning: Story = {
  name: "Small screens - beginning",
  args: { currentPage: 1, totalPages: 20, size: "small" },
};

export const SmallMiddle: Story = {
  name: "Small screens - middle",
  args: { currentPage: 12, totalPages: 20, size: "small" },
};
