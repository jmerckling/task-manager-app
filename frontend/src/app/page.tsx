import Link from 'next/link';
import styles from './page.module.css'; // Import CSS module

const Home = () => {
  return (
    <div className={styles.page}>
      <h1>Welcome to the Task Manager</h1>
      <Link href="/tasks">Go to Tasks</Link>
    </div>
  );
};

export default Home;
