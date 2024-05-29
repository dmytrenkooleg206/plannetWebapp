import axiosClient from '../../lib/axiosClient';
import { ValidatePromoCode } from './promoCode.types';


export default {
  promoCodeValidate: (code: ValidatePromoCode) =>
    axiosClient.post('api/promoCode/validate', code),
};
