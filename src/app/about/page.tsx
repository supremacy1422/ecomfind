import NavHeader from "@/components/NavHeader";
import Link from "next/link";

export const metadata = {
  title: "About — RevenueAI",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavHeader />

      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">Built by Someone Who Understands Business</h1>
          <p className="text-slate-400">Technology, marketing, and entrepreneurship — combined.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 mb-10">
          <div className="flex flex-col items-center text-center">
            {/* Profile Photo */}
            <div className="mb-6 h-32 w-32 overflow-hidden rounded-full border-2 border-slate-700 bg-slate-800">
              <img
                src="/oladoja.png"
                alt="Oladoja Paul"
                className="h-full w-full object-cover"
              />
            </div>

            <h2 className="text-2xl font-bold text-white">Oladoja Paul</h2>
            <p className="text-sm font-medium text-emerald-400 mt-1">
              Software Developer, Entrepreneur & Digital Marketer
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Founder of{" "}
              <a
                href="https://www.supremacyteam.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Supremacy Digital Marketing Agency
              </a>
            </p>
          </div>

          <div className="mt-8 space-y-4 text-sm leading-7 text-slate-300">
            <p>
              I'm Oladoja Paul, a software developer, entrepreneur, and digital marketer passionate about building
              technology that helps businesses work smarter and grow faster.
            </p>
            <p>
              With a background in full-stack web development, AI-powered automation, and digital marketing, I enjoy
              creating products that solve real business challenges. My focus is on developing practical software that
              improves efficiency, simplifies workflows, and delivers measurable results.
            </p>
            <p>
              Alongside my software projects, I founded{" "}
              <strong className="text-white">Supremacy Digital Marketing Agency</strong>, where I help businesses grow
              their online presence through modern digital marketing strategies, automation, and technology-driven
              solutions. Learn more at{" "}
              <a
                href="https://www.supremacyteam.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                www.supremacyteam.com
              </a>
              .
            </p>
            <p>
              The SaaS products I build are inspired by real-world business needs. Rather than creating software for the
              sake of technology, I believe every product should solve a meaningful problem, save time, reduce manual
              work, or help businesses make better decisions.
            </p>
            <p>
              My work combines software engineering, artificial intelligence, automation, and digital marketing to create
              solutions that are practical, scalable, and easy to use.
            </p>
            <p>
              Whether you're using one of my SaaS products or working with my agency, my goal is the same: to build
              technology that helps businesses operate more efficiently and achieve sustainable growth.
            </p>
            <p className="text-white font-medium">Thank you for being part of the journey.</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Full-Stack Dev", "AI & Automation", "Digital Marketing", "Product Strategy"].map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-center text-xs font-medium text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/discover"
            className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Run Free Audit
          </Link>
        </div>

        <footer className="mt-16 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/" className="hover:text-slate-300">Home</Link>
            <Link href="/discover" className="hover:text-slate-300">Audit</Link>
            <Link href="/outreach" className="hover:text-slate-300">Outreach</Link>
            <Link href="/about" className="hover:text-slate-300">About</Link>
          </div>
          <p>Built by Oladoja Paul</p>
        </footer>
      </main>
    </div>
  );
}