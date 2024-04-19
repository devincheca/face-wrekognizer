export default function NavBar() {
  return (
    <nav role="navigation" aria-label="main navigation" className="navbar">
      <div className="navbar-brand">
        <a href="https://face-wrekognizer.name" className="navbar-item">
          {/* icon image here
          <img src="https://i2k6x8h9.stackpathcdn.com/img/icons/apple-touch-icon-152x152.png">
          */}
        </a>
      </div>
      <div className="navbar-menu bg-gray-500 text-white px-5">
        <div className="flex justify-between w-80">
          <a href="https://devincheca.github.io/face-wrekognizer/" target="_blank" className="flex-initial w-15">
            Documentation
          </a>
          <a href="https://github.com/devincheca/face-wrekognizer" target="_blank" className="flex-initial w-15">
            GitHub
          </a>
          <a href="https://youtu.be/GuY_nT4-aZM" target="_blank" className="flex-initial w-15">
            Tech Demo
          </a>
        </div>
      </div>
    </nav>
  );
}
