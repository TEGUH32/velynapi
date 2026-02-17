import Image from "next/image";
import styles from "./home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <div className={styles.badge}>
          <span className={styles.dot}></span>
          <span>V.2.0 Stable Release</span>
        </div>
        
        <h1 className={styles.title}>
          Api Teguh <span className={styles.highlight}>Pro</span>
        </h1>
        
        <p className={styles.desc}>
          Solusi REST API modern, gratis, dan tanpa batas untuk developer Indonesia. 
          Nikmati kecepatan akses data tingkat tinggi dengan struktur respons yang bersih, 
          mudah dipahami, dan siap digunakan untuk produksi.
        </p>
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <h3>99.9%</h3>
            <p>Uptime</p>
          </div>
          <div className={styles.statItem}>
            <h3>50ms</h3>
            <p>Latency</p>
          </div>
          <div className={styles.statItem}>
            <h3>100%</h3>
            <p>Gratis</p>
          </div>
        </div>

        <div className={styles.buttons}>
          <a href="/docs" className={styles.primaryButton}>Mulai Dokumentasi</a>
          <a href="/contact" className={styles.secondaryButton}>Hubungi Kami</a>
        </div>
      </div>
      
      <div className={styles.imgContainer}>
        <div className={styles.imageWrapper}>
          <Image 
            src="/rex.png" 
            alt="Api Teguh Illustration" 
            fill 
            className={styles.rex}
            priority
          />
          {/* Elemen dekoratif latar belakang gambar */}
          <div className={styles.blurCircle}></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
