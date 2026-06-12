const LoginBanner = () => {
    const dots = Array.from({ length: 25 })

    return (
        <div className="login-banner">

            {/* Dot grid decoration */}
            <div className="login-banner__dots">
                {dots.map((_, i) => (
                    <span key={i} />
                ))}
            </div>

            <div className="login-banner__content">

                {/* Logo */}
                <img
                    src="/images/login-banner.png"
                    alt="MediBook"
                    className="h-10 xl:h-12 w-auto mb-6 object-contain"
                />

                {/* Headline */}
                <h1 className="text-2xl xl:text-3xl font-bold leading-snug tracking-tight">
                    Your Health,
                    <br />
                    Our Priority
                </h1>

                {/* Description */}
                <p className="mt-2.5 text-white/65 text-[0.8rem] xl:text-sm leading-relaxed max-w-[260px]">
                    Book appointments with trusted doctors,
                    manage your visits, and access quality
                    healthcare anytime, anywhere.
                </p>

                {/* Illustration */}
                <img
                    src="/images/healthcare.png"
                    alt="Healthcare"
                    className="login-banner__illustration mt-5"
                />

            </div>
        </div>
    )
}

export default LoginBanner