declare module 'busboy' {
    import { IncomingHttpHeaders } from 'http';
    import { Readable } from 'stream';

    interface BusboyConfig {
        headers: IncomingHttpHeaders;
    }

    class Busboy extends Readable {
        constructor(config: BusboyConfig);
        on(event: 'file', listener: (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) => void): this;
        on(event: 'field', listener: (fieldname: string, value: string, fieldnameTruncated: boolean, valueTruncated: boolean, encoding: string, mimetype: string) => void): this;
        on(event: 'finish', listener: () => void): this;
        on(event: 'error', listener: (error: Error) => void): this;
    }

    export default Busboy;
}
