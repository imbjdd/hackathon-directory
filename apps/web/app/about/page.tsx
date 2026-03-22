import { Navbar } from "../navbar";
import { AboutShaderCard } from "./about-shader-card";
import styles from "./page.module.css";

const ABOUT_IMAGES = [
  "https://workers.paper.design/file-assets/01KJWG05P9GR2DMJC7YTYBMJZG/01KJXG98XYZ0H4ZAS93CREDECD.jpg",
  "https://workers.paper.design/file-assets/01KJWG05P9GR2DMJC7YTYBMJZG/01KJXG9YTBNGSMWDTXVGMX8PEX.jpg",
  "https://workers.paper.design/file-assets/01KJWG05P9GR2DMJC7YTYBMJZG/01KJXGAF3KE8GPM6JZTR3ATSHA.jpg",
  "https://workers.paper.design/file-assets/01KJWG05P9GR2DMJC7YTYBMJZG/01KJXGDEAFXZS1Z91HQ76J62SS.jpg",
] as const;

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <Navbar />

      <main className={styles.aboutMain}>
        <section className={styles.aboutIntro}>
          <h1 className={styles.aboutTitle}>Hey, I&apos;m Salim</h1>
          <p className={styles.aboutBody}>
            I did a lot of hackathons.
            <br />
            <br />
            Maybe +20...
            <br />
            But when I began to participate in hackathons,
            <br />
            <br />
            it was very difficult to find them.
            <br />
            <br />
            It&apos;s why I&apos;ve decided to create this platform.
            <br />
            <br />
            Here&apos;s my Linkedin:{" "}
            <a href="https://www.linkedin.com/in/salim-boujaddi/" target="_blank" rel="noreferrer">
              linkedin.com/in/salim-boujaddi
            </a>
            <br />
            <br />
            And my X:{" "}
            <a href="https://x.com/salimboujaddi" target="_blank" rel="noreferrer">
              x.com/salimboujaddi
            </a>
          </p>
        </section>

        <section className={styles.gallery} aria-label="Hackathon moments">
          <AboutShaderCard image={ABOUT_IMAGES[0]} className={`${styles.card} ${styles.cardA}`} />
          <AboutShaderCard image={ABOUT_IMAGES[1]} className={`${styles.card} ${styles.cardB}`} />
          <AboutShaderCard image={ABOUT_IMAGES[2]} className={`${styles.card} ${styles.cardC}`} />
          <AboutShaderCard image={ABOUT_IMAGES[3]} className={`${styles.card} ${styles.cardD}`} />
        </section>
      </main>
    </div>
  );
}
