import { useNavigate } from "react-router";

export const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold mb-4">403</h1>
      <h2 className="text-2xl mb-4">Access Denied</h2>
      <p className="mb-6">
        You don&apos;t have the necessary permissions to view this page.
      </p>
      <button
        className="px-4 py-2 bg-blue-600 text rounded"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
};
