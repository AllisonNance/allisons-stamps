import styles from "./Logo.module.css";

interface LogoProps {
  width?: number;
  height?: number;
}

export default function Logo({ width, height }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt="Allison's Stamp Collection"
      className={styles.logo}
      style={{ width, height }}
    />
  );
}
