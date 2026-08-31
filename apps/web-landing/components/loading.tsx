export function LoadingPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-3 text-center max-w-xl mx-auto">
                <div className="h-6 w-32 bg-slate-200 rounded-full mx-auto" />
                <div className="h-9 w-3/4 bg-slate-200 rounded-xl mx-auto" />
                <div className="h-4 w-1/2 bg-slate-200 rounded-lg mx-auto" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 gap-8">
                <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
                    <div className="h-12 bg-slate-100 rounded-xl w-full" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-12 bg-slate-100 rounded-xl" />
                        <div className="h-12 bg-slate-100 rounded-xl" />
                    </div>
                    <div className="h-32 bg-slate-100 rounded-xl w-full" />
                </div>

                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 h-64" />
            </div>
        </div>
    );
}

export default LoadingPage;