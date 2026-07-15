const LoadingScreen = () => {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-muted" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;