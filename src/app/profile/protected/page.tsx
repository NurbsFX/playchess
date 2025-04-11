export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Protected Page</h1>
            <p className="text-lg">This page is protected and requires authentication.</p>
        </div>
    );
}