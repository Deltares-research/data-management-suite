import tracer from 'dd-trace'
import { name, version } from '../package.json'

tracer.init({
  logInjection: true,
  service: name,
  hostname: 'datadog-agent',
  version: version,
}) // initialized in a different file to avoid hoisting.
export default tracer
