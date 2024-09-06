import styles from './Popup.module.css';

const Popup = ({ popup_message, messageBtn, onClose }) => {
  return (
    <div className={styles.popup-overlay}>
      <div className={styles.popup-content}>
        <button className={styles.popup-close} onClick={onClose}>&times;</button>
        <p>{popup_message}</p>
        <button className={styles.popup-button} onClick={onClose}>{messageBtn}</button>
      </div>
    </div>
  );
};

export default Popup;
