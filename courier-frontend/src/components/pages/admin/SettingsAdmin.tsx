import { useAuth } from "../../../hooks";
import { RolePartial } from "../../partials";


export const SettingsAdmin = () => {

    const { userDetails } = useAuth();


    return (
        <>
            {
                userDetails && (
                    <div className="container">
                        <RolePartial userDetails={userDetails} />
                    </div>
                )
            }
        </>
    );
}