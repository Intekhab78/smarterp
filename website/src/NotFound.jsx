import { ImSad } from "react-icons/im";

export default function NotFound() {
    return (
        <div className="h-screen flex items-center justify-center bg-white">
            <div className="text-center text-gray-500">

                {/* Sad Icon */}
                <div className="flex justify-center text-7xl mb-6">
                    <ImSad />

                </div>

                {/* 404 */}
                <h1 className="font-semibold text-gray-600"><span className="text-[35px]"> 404</span></h1>

                {/* Title */}
                <p className="mt-2 text-xl text-gray-500">
                    Page not found
                </p>

                {/* Description */}
                <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                    The page you are looking for does not exist.
                    <br />
                    Please go back to the previous page.
                </p>

                {/* Go Back Link */}
                <p
                    onClick={() => window.history.back()}
                    className="mt-4 text-xs text-gray-500 underline cursor-pointer hover:text-gray-700"
                >
                    Go to previous page
                </p>

            </div>
        </div>
    );
}
