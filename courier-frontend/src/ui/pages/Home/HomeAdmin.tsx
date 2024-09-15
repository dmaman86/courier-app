
import { User } from "@/domain";



export const HomeAdmin = ({ userDetails }: { userDetails: User }) => {

    return(
        <>
            <h1>Home Admin {userDetails.name}</h1>
        </>
    )
}