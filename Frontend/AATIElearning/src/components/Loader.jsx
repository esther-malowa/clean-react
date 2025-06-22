import loader from "../assets/loader.svg"

const Loader = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="h-10 w-10 border-4 border-t-transparent border-green-600 rounded-full animate-spin"></div>
        </div>
    );
}

export default Loader;