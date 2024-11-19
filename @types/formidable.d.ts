declare module 'formidable' {

    interface Fields {
        [key: string]: string | string[];
    }

    interface Files {
        [key: string]: File;
    }

    export interface File {
        size: number;
        path: string;
        name: string;
        filepath: string;
        type: string;
        lastModifiedDate?: Date;
        hash?: string;
    }

    interface IncomingForm {
        parse(req: IncomingMessage, callback: (err: Error, fields: Fields, files: Files) => void): void;
        uploadDir: string;
        keepExtensions: boolean;
    }

    const formidable: {
        IncomingForm: new () => IncomingForm;
    };

    export = formidable;
}
