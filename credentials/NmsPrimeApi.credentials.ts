import type {
  ICredentialType,
  INodeProperties,
  Icon,
} from 'n8n-workflow';

export class NmsPrimeApi implements ICredentialType {
  name = 'nmsPrimeApi';

  displayName = 'NMS Prime API';

  icon: Icon = 'file:nmsPrime.svg';

  documentationUrl = 'https://www.nmsprime.com';

  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://your-nmsprime.example.com',
      placeholder: 'https://api.example.com',
      description: 'Root URL of your NMS Prime instance (no trailing slash)',
      required: true,
    },
    {
      displayName: 'Bearer Token',
      name: 'bearerToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'API bearer token',
      required: true,
    },
  ];
}
