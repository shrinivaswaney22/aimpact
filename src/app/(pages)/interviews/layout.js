import { Suspense } from "react"
import { MoonLoader } from "react-spinners";

const InterviewLayout = ({ children }) => {
    return <div className="px-5">
        <Suspense fallback={<MoonLoader className="mt-4" width={"100"} color="gray"/>}>{children}</Suspense>
        </div>
}

export default InterviewLayout;