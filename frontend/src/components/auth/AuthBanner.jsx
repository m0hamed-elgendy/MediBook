const AuthBanner = () => {
  return (
    <div className="auth-banner">

      {/* Decorative floating shapes */}
      <div className="auth-banner-shape auth-banner-shape-1"></div>
      <div className="auth-banner-shape auth-banner-shape-2"></div>
      <div className="auth-banner-shape auth-banner-shape-3"></div>

      {/* Content */}
      <div className="auth-banner-content">

        {/* Badge */}
        <div className="auth-banner-badge">
          <span className="auth-banner-badge-dot"></span>
          <span>Trusted by 10,000+ patients</span>
        </div>

        {/* Heading */}
        <h1 className="auth-banner-heading">
          Your Health, <br />
          <span className="auth-banner-heading-accent">Our Priority</span>
        </h1>

        {/* Description */}
        <p className="auth-banner-desc">
          Book appointments with trusted doctors, manage your visits, and access quality healthcare anytime, anywhere.
        </p>
      </div>

     

      {/* Image */}
      <div className="auth-banner-image-wrap">
        <img
          src="/images/healthcare.png"
          alt="Healthcare"
          className="auth-banner-image"
        />
      </div>

    </div>
  )
}

export default AuthBanner