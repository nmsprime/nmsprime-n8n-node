import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import {
  N8NPropertiesBuilder,
  type N8NPropertiesBuilderConfig,
} from '@devlikeapro/n8n-openapi-node';
import * as doc from './openapi.json';

const config: N8NPropertiesBuilderConfig = {};
const parser = new N8NPropertiesBuilder(doc as object, config);
const properties = parser.build();

export class NmsPrime implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'NMS Prime',
    name: 'nmsPrime',
    icon: 'file:nmsPrime.svg',
    group: ['transform'],
    version: 1,
    subtitle:
      '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Call the NMS Prime API (generated from OpenAPI)',
    defaults: {
      name: 'NMS Prime',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'nmsPrimeApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: '={{$credentials.baseUrl}}',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: "={{ 'Bearer ' + $credentials.bearerToken }}",
      },
    },
    properties,
  };
}
