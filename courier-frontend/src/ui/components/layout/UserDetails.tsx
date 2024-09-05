import { User } from "@/domain";


export const UserDetails = ({ userDetails, dispatch }: { userDetails: User, dispatch: any }) => {
    
    const extractRoleNames = () => {
      const formattedRoles = userDetails.roles.map((role) => role.name.replace(/^ROLE_/, ''));
      return `[${formattedRoles.join(', ')}]`;
    };
  
    const capitalizeFirstLetter = (word: string) => word.replace(/^\w/, (c) => c.toUpperCase());
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      dispatch({ type: 'SHOW_ALERT_DIALOG' });
    };
  
    return (
      <>
        Logged user: <span>{capitalizeFirstLetter(userDetails.name) + ' ' + capitalizeFirstLetter(userDetails.lastName)}</span>
        &nbsp;
        Roles: <span>{extractRoleNames()}</span>
        &nbsp;
        <form onSubmit={handleSubmit}>
          <input type="submit" className="btn btn-sm btn-outline-danger" value="Logout" />
        </form>
      </>
    );
  };