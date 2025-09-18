"use client";
import { useRouter } from "next/navigation";

export default function ReviewPage({ searchParams }) {
  const router = useRouter();

  // البيانات جاية من query params (أو ممكن من state)
  const { name, email, complaint, fileName } = searchParams;

  const handleConfirm = async () => {
    try {
      // TODO: Send final data to backend API (POST request to Flask)
      // example:
      // await axios.post("http://localhost:5000/api/complaints", { name, email, complaint, fileName });

      alert("Complaint submitted successfully!");
      router.push("/complaint/success");
    } catch (error) {
      console.error(error);
      alert("Error submitting complaint");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4 text-black">Review Your Complaint</h1>

      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Complaint:</strong> {complaint}</p>
      <p><strong>Uploaded File:</strong> {fileName}</p>

      <div className="flex justify-between mt-6">
        {/* Back to Edit */}
        <button
          onClick={() => router.push("/complaint/form")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Edit
        </button>

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
