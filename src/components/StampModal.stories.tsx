import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StampModal from "./StampModal";

const collectionItems = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  src: "/stamp-placeholder.svg",
  alt: `Stamp ${i + 1}`,
}));

const meta: Meta<typeof StampModal> = {
  title: "Components/StampModal",
  component: StampModal,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof StampModal>;

export const Desktop: Story = {
  args: {
    open: true,
    onClose: () => {},
    imageSrc: "/stamp-placeholder.svg",
    imageAlt: "Madonna and Child by Vivarini",
    title: "Madonna and Child by Vivarini",
    details: [
      { label: "Collection", value: "Christmas 1969" },
      { label: "Country", value: "Cayman Islands" },
      { label: "Denomination", value: "1/4 cent" },
      { label: "Year of issue", value: "1969" },
    ],
    description:
      "This stamp was issued by the Cayman Islands as part of its Christmas 1969 issue, during the reign of Queen Elizabeth II, whose royal cypher appears in the upper right corner. The Cayman Islands were still a British Crown Colony at the time; after Jamaica became independent in 1962, Cayman chose to remain tied to Britain and was governed by an administrator reporting to Westminster.\n\nThe artwork shown is Madonna and Child by Alvise Vivarini, a Venetian Renaissance painter. One listing identifies the image as Vivarini's The Virgin and Child, dated 1483, reproduced on the Cayman Islands Christmas issue. The religious subject fits the common mid-century Commonwealth practice of issuing Christmas stamps featuring Nativity imagery or European devotional art.\n\nVivarini was the last major painter of the Murano school, a family dynasty of Venetian glass-makers turned artists. His style blended the soft modeling of Giovanni Bellini with the crisp linearity of Antonello da Messina. This particular composition places the Virgin against a dark background, drawing attention to the luminous skin tones and delicate drapery that were hallmarks of his mature period.\n\nThe stamp's denomination of one-quarter cent reflects the decimal currency system the Cayman Islands adopted in 1969, replacing the old Jamaican pound. Low-denomination Christmas stamps like this one were designed for local postcard rates and were often collected in complete sets by philatelists worldwide. The full Christmas 1969 series comprised several values, each reproducing a different Old Master painting of the Madonna and Child.",
    collection: {
      title: "More in this Collection",
      items: collectionItems,
    },
  },
};

export const Mobile: Story = {
  args: {
    ...Desktop.args,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const NoCollection: Story = {
  args: {
    open: true,
    onClose: () => {},
    imageSrc: "/stamp-placeholder.svg",
    imageAlt: "Sample stamp",
    title: "Republic Centrafricaine Butterfly",
    details: [
      { label: "Country", value: "Central African Republic" },
      { label: "Denomination", value: "0.50 franc" },
    ],
    description: "A colorful butterfly stamp from the Central African Republic.",
  },
};
