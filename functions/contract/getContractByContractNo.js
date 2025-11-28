import { GET_CONTRACT_BY_CONTRACT_NO } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getContractByContractNo(
    dispatch,
    enqueueSnackbar,
    setState,
    contractNo
) {
    try {
        const result = await dispatch(GET_CONTRACT_BY_CONTRACT_NO(contractNo));
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default getContractByContractNo;
