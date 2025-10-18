import styles from "./WhatsAppBubble.module.css";

type WhatsAppBubbleProps = {
  phoneNumber?: string;
  message?: string;
};

export default function WhatsAppBubble({
  phoneNumber = "5491170264456",
  message = "¡Hola Guadalupe! Quisiera consultar sobre tu plan nutricional",
}: WhatsAppBubbleProps) {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappBubble}
      aria-label="Abrir chat de WhatsApp"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className={styles.whatsappIcon}
      />
    </a>
  );
}
