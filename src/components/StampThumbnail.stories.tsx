import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StampThumbnail from "./StampThumbnail";

const meta: Meta<typeof StampThumbnail> = {
  title: "Components/StampThumbnail",
  component: StampThumbnail,
  parameters: {
    layout: "centered",
    backgrounds: { default: "site", values: [{ name: "site", value: "#fbfbfb" }] },
  },
};

export default meta;
type Story = StoryObj<typeof StampThumbnail>;

export const Default: Story = {
  args: {
    src: "/stamp-placeholder.svg",
    alt: "Stamp placeholder",
    width: 400,
  },
};

export const Small: Story = {
  args: {
    src: "/stamp-placeholder.svg",
    alt: "Stamp placeholder",
    width: 250,
  },
};
