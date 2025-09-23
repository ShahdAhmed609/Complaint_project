// src/app/complaints/review/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ComplaintData { title: string; department: string; description: string; fileName: string; }

export default function ReviewComplaintPage() {
  const [data, setData] = useState<ComplaintData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = sessionStorage.getItem('complaintData');
    if (storedData) setData(JSON.parse(storedData));
    else router.push('/complaints/new');
  }, [router]);

  if (!data) return <p>Loading...</p>;

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">Review Submission</h1>
        <div className="space-y-4">
          <div><h2>Title:</h2><p>{data.title}</p></div>
          <div><h2>Department:</h2><p>{data.department}</p></div>
          <div><h2>Description:</h2><p>{data.description}</p></div>
          <div><h2>File:</h2><p>{data.fileName}</p></div>
        </div>
        <div className="mt-8 flex justify-between gap-4">
          <button onClick={() => router.back()} className="flex-1 rounded-lg bg-gray-300 px-4 py-3 font-semibold">Back to Edit</button>
          <button onClick={() => alert("Confirmed!")} className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white">Confirm & Submit</button>
        </div>
      </div>
    </main>
  );
}