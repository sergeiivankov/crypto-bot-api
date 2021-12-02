import {
  ApiMethod, ConfirmPaymentBackendOptions, GetInvoicesBackendOptions,
  GetPaymentsOptions, isValidUrl,
} from '../helpers/utils';
import request from '../request/http';

/**
 * Make backend API calls
 */
export default class Transport {
  /** RegExp to check API key */
  static KEY_CHECK_REGEXP: RegExp = /\d{1,}:[a-zA-Z0-9]{35}/;

  /** Api key */
  private _apiKey: string;

  /** Backend API endpoint base url */
  private _baseUrl: string;

  /**
   * Create class instance
   *
   * @param apiKey - Crypto Bot API key, looks like '1234:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
   * @param endpoint - API endpoint url or 'mainnet' or 'testnet'
   *                   for hardcoded in library endpoint urls
   *
   * @throws Error - If passed invalid API key or endpoint
   */
  constructor(apiKey: string, endpoint: string) {
    if (!Transport.KEY_CHECK_REGEXP.test(apiKey)) {
      throw new Error('API key looks like invalid');
    }

    let url: string;

    // Mainnet disabled during api testing stage
    if (endpoint === 'mainnet' || endpoint === 'https://pay.crypt.bot/api') {
      throw new Error(
        'Mainnet disabled during api testing stage,'
        + "pass 'testnet' or endpoint url in second parameter",
      );
    } else if (endpoint === 'testnet') {
      url = 'https://testnet-pay.crypt.bot/api';
    } else if (!isValidUrl(endpoint)) {
      throw new Error('Endpoint parameter not contain valid URL');
    } else {
      url = endpoint;
    }

    this._apiKey = apiKey;
    this._baseUrl = `${url}/`;
  }

  /**
   * Make request to backend API, handle errors and return result
   *
   * @param method - Backend API method name
   * @param parameters - Method parameters object
   *
   * @throws Error - If response have errors
   *
   * @returns Promise, what resolved to API response `result` field
   */
  call(
    method: ApiMethod,
    parameters: ConfirmPaymentBackendOptions | GetInvoicesBackendOptions | GetPaymentsOptions = {},
  ): Promise<any> {
    // Format url query part from passed parameters object
    let qs = '';
    Object.keys(parameters).forEach((name): void => {
      let value = parameters[name];

      if (Array.isArray(value)) value = value.join(',');
      else value = value.toString();

      qs += `&${name}=${encodeURIComponent(value)}`;
    });

    return request(this._baseUrl + method + (qs.length ? `?${qs.substr(1)}` : ''), this._apiKey)
      .then((rawResponse: string): any => {
        let response: any;
        try {
          response = JSON.parse(rawResponse);
        } catch (err) {
          throw new Error(`Response parse error, raw reponse:\n${rawResponse}`);
        }

        if (response.ok !== true) {
          if (!response.error) throw new Error('Api response unknown error');
          throw new Error(`Api response error ${JSON.stringify(response.error)}`);
        }

        return response.result;
      });
  }
}
