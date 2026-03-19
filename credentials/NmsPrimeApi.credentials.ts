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
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      description: 'HTTP Basic Auth username',
      required: true,
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'HTTP Basic Auth password',
      required: true,
    },
    {
      displayName: 'Ignore SSL Issues (Insecure)',
      name: 'skipSslCertificateValidation',
      type: 'boolean',
      default: false,
      description:
        'If true, TLS certificate errors are ignored (same idea as curl -k). Use only for self-signed or internal CAs when you cannot add the CA to n8n/Node. Prefer fixing trust: install the root CA or run Node with --use-system-ca (Node 22+).',
    },
  ];
}
