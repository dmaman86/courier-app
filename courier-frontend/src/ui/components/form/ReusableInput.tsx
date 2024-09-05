import { GenericInputProps } from "@/domain";

export const ReusableInput = ({ inputProps, onChange, onFocus, errorsMessage }: GenericInputProps) => {


    return (
        <>
            {
                inputProps.label && (
                    <label className="form-label">{inputProps.label}:</label>
                )
            }
            {
                inputProps.type === 'textarea' ? (
                    <textarea
                        {...inputProps}
                        className="form-control"
                        autoComplete="off"
                        onChange={onChange}
                        onFocus={() => onFocus(inputProps.name)}
                    />
                ) : (
                    <input
                        {...inputProps}
                        className="form-control"
                        autoComplete="off"
                        onChange={onChange}
                        onFocus={() => onFocus(inputProps.name)}
                    />
                )
            }
            {
                errorsMessage?.map((error, index) => (
                    <div key={index} className={`text-danger ${error === '' ? 'd-none' : ''}`}>{error}</div>
                ))
            }
        </>
    );
}