const Footer = () => {
  return (
    <footer id="contact" className="px-6 md:px-12 lg:px-20 py-12 border-t border-border">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <span className="font-display text-lg tracking-wide">Md Aidul Islam</span>
        <div className="flex gap-8 font-body text-xs tracking-widest uppercase text-muted-foreground">
          <a href="https://instagram.com/photographs_by_aidul" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-200">
            Instagram
          </a>
          <a href="mailto:aidulislamphotography@gmail.com" className="hover:text-foreground transition-colors duration-200">
            Email
          </a>
        </div>
        <span className="font-body text-xs text-muted-foreground">
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
