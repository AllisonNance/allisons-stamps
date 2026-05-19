import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StampGallery from "./StampGallery";

const placeholders = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1),
  src: "/stamp-placeholder.svg",
  alt: `Stamp ${i + 1}`,
}));

const manyItems = Array.from({ length: 120 }, (_, i) => ({
  id: String(i + 1),
  src: "/stamp-placeholder.svg",
  alt: `Stamp ${i + 1}`,
}));

const meta: Meta<typeof StampGallery> = {
  title: "Components/StampGallery",
  component: StampGallery,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "site", values: [{ name: "site", value: "#fbfbfb" }] },
  },
};

export default meta;
type Story = StoryObj<typeof StampGallery>;

export const Default: Story = {
  args: { items: placeholders },
};

export const WithPagination: Story = {
  args: { items: manyItems },
};
