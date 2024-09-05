import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from "moment";

import { ReusableInput, ReusableSelect } from "../form";
import { Branch, ContactOptionType, Office, OfficeResponse, OptionType, Order } from "@/domain";
import { useOrderForm } from "@/useCases";
import { Autocomplete, TextField } from '@mui/material';


interface OrderFormProps {
    orderId: number | null;
    onSubmit: (order: Order) => void;
}

interface BranchOptionType extends OptionType {
    address: string;
    office: Office;
}

const tranformOffices = (offices: OfficeResponse[]): readonly OptionType[] => {
    return offices.map(office => ({ value: office.id, label: office.name }));
}

export const OrderForm = ({ orderId, onSubmit }: OrderFormProps) => {

    const { values,
        order,
        branchesOrigin,
        contacts,
        statusOrderList,
        couriersList,
        isClient,
        isAdmin,
        client,
        offices,
        found,
        officeDestination,
        handleBranchChange,
        handleBranchDestinationChange,
        handleOfficeAutoComplete,
        handleContactChange,
        handleStatusChange,
        handleCouriersChange,
        handleInputChange,
        handleDateChange,
        handleSubmit,
        handleChange,
        onFocus } = useOrderForm(orderId);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const submittedData = handleSubmit();
    
        if (submittedData) {
            onSubmit(submittedData);
        }
    }

    return(
        <>
            {
                (values && order) && (
                    <>
                        <form onSubmit={handleFormSubmit} className="row g-4 pt-3">
                            <div className='row'>
                                <div className='col-6'>
                                        <ReusableSelect<OptionType> 
                                            label='Select Origin Office:'
                                            value={order.originBranch?.office ? { value: order.originBranch.office.id, label: order.originBranch.office.name }: null }
                                            options={[]}
                                            onChange={() => {}}
                                            isMulti={false}
                                            isDisabled={true}
                                        />
                                </div>
                                <div className='col-6'>
                                        <ReusableSelect<BranchOptionType>
                                            label='Select Origin Branche:'
                                            value={order.originBranch ? { value: order.originBranch.id, label: `${order.originBranch.city}\n${order.originBranch.address}`, address: order.originBranch.address, office: { id: order.originBranch.office.id, name: order.originBranch.office.name } } : null}
                                            options={client ? branchesOrigin.map(branch => ({ value: (branch as Branch).id, label: `${branch.city}\n${branch.address}`, address: branch.address, office: { id: client.office.id, name: client.office.name } })) : []}
                                            onChange={handleBranchChange}
                                            isMulti={false}
                                            isDisabled={!isClient}
                                        />
                                </div>
                            </div>
                            <div className="row pt-3">
                                <div className="col-6">
                                    <Autocomplete
                                        onInputChange={handleInputChange}
                                        onChange={handleOfficeAutoComplete}
                                        options={tranformOffices(offices)}
                                        getOptionLabel={(option) => option.label}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Search for a destination office"
                                                placeholder="Search for a destination office"
                                                variant="outlined"
                                                fullWidth
                                                disabled={!isClient}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-6">
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DatePicker 
                                            label="Delivery Date"
                                            value={moment(values.deliveryDate.value, 'DD/MM/YYYY')}
                                            onChange={handleDateChange}
                                            minDate={moment()}
                                            format="DD/MM/YYYY"
                                            disabled={!isClient}
                                        />
                                        {
                                            values.deliveryDate.error?.map((error, index) => (
                                                <div key={index} className={`text-danger ${error === '' ? 'd-none' : ''}`}>{error}</div>
                                            ))
                                        }
                                    </LocalizationProvider>
                                </div>
                            </div>
                            { found && (
                                <div className="row pt-3">
                                    <div className="col-6">
                                        <ReusableSelect<BranchOptionType>
                                            label='Select Destination Branch:'
                                            value={order.destinationBranch && order.destinationBranch.office ? { value: order.destinationBranch.id, label: `${order.destinationBranch.city}\n${order.destinationBranch.address}`, address: order.destinationBranch.address, office: order.destinationBranch.office } : null}
                                            options={officeDestination ? officeDestination.branches.map(branch => ({ value: (branch as Branch).id, label: `${branch.city}\n${branch.address}`, address: branch.address, office: {id: officeDestination.id, name: officeDestination.name } })) : []}
                                            onChange={handleBranchDestinationChange}
                                            isMulti={false}
                                            isDisabled={isAdmin || !isClient}
                                        />
                                    </div>
                                    <div className="col">
                                                <ReusableSelect<ContactOptionType>
                                                    label='Select Contact:'
                                                    value={order.contacts.map(contact => ({ value: contact.id, label: `${contact.name} ${contact.lastName}`, phone: contact.phone, office: contact.office, branches: contact.branches}))}
                                                    options={[ { value: 0, label: 'Select All', phone: '', office: {id: 0, name: ''}, branches: []}, ...(contacts ? contacts.map(contact => ({ value: contact.id, label: `${contact.name} ${contact.lastName}`, phone: contact.phone, office: contact.office, branches: contact.branches})) : [])]}
                                                    onChange={handleContactChange}
                                                    isMulti={true}
                                                    isDisabled={isClient && order.destinationBranch !== null ? false : true}
                                                />
                                            </div>
                                </div>
                            )}
                            { (isClient && !found && values.receiverName && values.receiverPhone && values.destinationAddress) && (
                                <>
                                    <div className="row pt-3">
                                        <div className='col-6'>
                                            <ReusableInput
                                                inputProps={{
                                                    label: 'Receiver Name',
                                                    name: 'receiverName',
                                                    type: 'text',
                                                    value: values.receiverName.value,
                                                    placeholder: 'Receiver Full Name'
                                                }}
                                                onChange={handleChange}
                                                onFocus={onFocus}
                                                errorsMessage={values.receiverName.error}
                                            />    
                                        </div>
                                        <div className='col-6'>
                                            <ReusableInput
                                                inputProps={{
                                                    label: 'Receiver Phone',
                                                    name: 'receiverPhone',
                                                    type: 'text',
                                                    value: values.receiverPhone.value,
                                                    placeholder: 'Receiver Phone'
                                                }}
                                                onChange={handleChange}
                                                onFocus={onFocus}
                                                errorsMessage={values.receiverPhone.error}
                                            />
                                        </div>
                                    </div>
                                    <div className="row pt-3">
                                        <div className="col">
                                            <ReusableInput
                                                inputProps={{
                                                    label: 'Destination Address',
                                                    name: 'destinationAddress',
                                                    type: 'text',
                                                    value: values.destinationAddress.value,
                                                    placeholder: 'Destination Address'
                                                }}
                                                onChange={handleChange}
                                                onFocus={onFocus}
                                                errorsMessage={values.destinationAddress.error}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            {
                                !isClient && (
                                    <div className="row pt-3">
                                        <div className="col-6">
                                            <ReusableSelect<OptionType>
                                                label='Select Status Order:'
                                                value={order.currentStatus ? { value: order.currentStatus.id, label: order.currentStatus.name } : null}
                                                options={statusOrderList.map(statusOrder => ({ value: statusOrder.id, label: statusOrder.name }))}
                                                onChange={handleStatusChange}
                                                isMulti={false}
                                                isDisabled={false}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <ReusableSelect<OptionType>
                                                label='Select Courier:'
                                                value={order.couriers.length > 0 ? order.couriers.map(courier => ({ value: courier.id, label: `${courier.name} ${courier.lastName}` })) : null}
                                                options={couriersList.map(courier => ({ value: courier.id, label: `${courier.name} ${courier.lastName}` }))}
                                                onChange={handleCouriersChange}
                                                isMulti={true}
                                                isDisabled={!isAdmin}
                                            />
                                        </div>
                                    </div>
                                )
                            }
                            <div className="row">
                                <div className='col pt-3 text-center'>
                                    <button className='btn btn-primary' type='submit'>Save</button>
                                </div>
                            </div>
                        </form>
                    </>
                )
            }
        </>
    )

}