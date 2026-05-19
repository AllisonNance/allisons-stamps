import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CollectionBlock from "./CollectionBlock";

const meta: Meta<typeof CollectionBlock> = {
  title: "Components/CollectionBlock",
  component: CollectionBlock,
  parameters: {
    layout: "padded",
    backgrounds: { default: "site", values: [{ name: "site", value: "#fbfbfb" }] },
  },
};

export default meta;
type Story = StoryObj<typeof CollectionBlock>;

export const Default: Story = {
  args: {
    title: "More In This Collection",
    items: Array.from({ length: 5 }, (_, i) => ({
      id: String(i + 1),
      src: "/stamp-placeholder.svg",
      alt: `Stamp ${i + 1}`,
    })),
  },
};

export const Carousel: Story = {
  args: {
    title: "More In This Collection",
    items: Array.from({ length: 12 }, (_, i) => ({
      id: String(i + 1),
      src: "/stamp-placeholder.svg",
      alt: `Stamp ${i + 1}`,
    })),
  },
};
