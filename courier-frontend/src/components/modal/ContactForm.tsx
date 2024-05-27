import { Contact } from "../../types";

interface ContactFormProps {
    contactId: number | null;
    onSubmit: (contact: Contact) => void;
}

export const ContactForm = ({ contactId, onSubmit }: ContactFormProps) => {


    return(
        <>
        </>
    )
}