// src/app/page.jsx
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        px-4 sm:px-6 lg:px-8
      "
    >
      {/* Floating Card */}
      <section
        className="
          w-full max-w-2xl xl:max-w-3xl
          bg-white/70 dark:bg-slate-800/80
          backdrop-blur-md
          rounded-3xl
          shadow-xl dark:shadow-2xl
          p-6 sm:p-8 md:p-10 lg:p-12
          text-center
          animate-float
        "
      >
        {/* Title */}
        <h1
          className="
            font-extrabold tracking-tight mb-4
            text-gray-800 dark:text-slate-100
            text-[clamp(1.8rem,4vw,3rem)]
          "
        >
          Student Complaints Platform
        </h1>

        {/* Description */}
        <p
          className="
            text-gray-600 dark:text-slate-300
            mb-10 leading-relaxed
            text-[clamp(0.95rem,2.5vw,1.1rem)]
          "
        >
          Welcome! Please choose how you want to log in.
          <br className="hidden sm:block" />
          Students can submit complaints and suggestions, while
          administrators can review and respond.
        </p>

        {/* Buttons */}
        <div
          className="
            flex flex-col sm:flex-row
            gap-4 sm:gap-6
            justify-center
          "
        >
          {/* Student Login */}
          <Link
            href="/student/login"
            className="
              w-full sm:w-auto
              px-8 py-4 rounded-xl
              font-semibold text-white
              bg-gradient-to-r from-blue-500 to-sky-400
              shadow-lg
              hover:from-blue-600 hover:to-sky-500
              hover:shadow-xl
              transition-all duration-300
              dark:from-sky-500 dark:to-blue-600
            "
          >
            Login as Student
          </Link>

          {/* Admin Login */}
          <Link
            href="/admin/login"
            className="
              w-full sm:w-auto
              px-8 py-4 rounded-xl
              font-semibold
              bg-white text-blue-600
              border border-blue-200
              shadow-md
              hover:bg-blue-50 hover:shadow-lg
              transition-all duration-300
              dark:bg-slate-700 dark:text-slate-100
              dark:border-slate-600 dark:hover:bg-slate-600
            "
          >
            Login as Admin
          </Link>
        </div>
      </section>
    </main>
  );
}
