import { Injectable } from '@nestjs/common';
import * as firebase_admin from 'firebase-admin';

@Injectable()
export default class AuthService {
    async validate(token: string): Promise<firebase_admin.auth.DecodedIdToken> {
        try {
            return await firebase_admin.auth().verifyIdToken(token, true);
        } catch ( error ) {
            throw error;
        }
    }
}