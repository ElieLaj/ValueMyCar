import { Request } from 'express';

export interface EncodedRequest extends Request {
    decoded: {
        user: {
            id: string;
            email: string;
        }
    };
}