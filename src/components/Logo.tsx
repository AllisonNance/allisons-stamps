import styles from "./Logo.module.css";

interface LogoProps {
  height?: number;
}

export default function Logo({ height = 120 }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt="Allison's Stamp Collection"
      className={styles.logo}
      style={{ height }}
    />
  );
}
