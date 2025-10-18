import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CVMatch - AI-Powered ATS Resume Analysis" },
    { name: "description", content: "AI-powered ATS resume analysis and smart feedback to land your dream job." },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ));

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col">
      <Navbar />

      <section className="main-section flex-grow">
        <div className="page-heading py-16">
          <h1>AI-Powered ATS Resume Analysis</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resume found. Upload your first resume to get AI-driven ATS feedback.</h2>
          ) : (
            <h2>Get instant insights to make your resume stand out and pass ATS filters.</h2>
          )}
        </div>

        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center justify-center py-8 bg-white mt-10">
        <span className="text-gray-600 mb-2">Developed by</span>
        <a href="https://mindshiftdigital.pt" target="_blank">
          <img src="/logo.png" alt="Company Logo" className="h-12 w-auto" />
        </a>
      </footer>
    </main>
  );
}
