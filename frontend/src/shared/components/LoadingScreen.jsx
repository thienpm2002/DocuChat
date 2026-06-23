import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-xl bg-gray-50 border border-gray-100">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm text-gray-600 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;