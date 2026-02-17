const Footer = () => {
  return (
    <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-soft)' }}>
      <div className="container">
        <p style={{ color: 'var(--text-muted)' }}>&copy; 2024 Bookstore. Proyecto Final Full Stack.</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'rgba(255,255,255,0.3)' }}>Desarrollado con React + Node.js + MongoDB</p>
      </div>
    </footer>
  );
};

export default Footer;
