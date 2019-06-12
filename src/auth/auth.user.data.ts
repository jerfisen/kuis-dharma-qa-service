import * as firebase_admin from 'firebase-admin';
import { createParamDecorator, Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import AuthService from './auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';

export class AuthData {
    constructor(private readonly decoded_id_token: firebase_admin.auth.DecodedIdToken ){}
    public get uid(): string { return this.decoded_id_token.uid; }
    public get exp(): number { return this.decoded_id_token.exp; }
    public get iat(): number { return this.decoded_id_token.iat; }
    public get auth_time(): number { return this.decoded_id_token.auth_time; }
    public get iss(): string { return this.decoded_id_token.iss; }
    public async getFirebaseUser(): Promise<firebase_admin.auth.UserRecord> { return await firebase_admin.auth().getUser(this.uid); }
    public isAnonymous(): boolean { return this.decoded_id_token.firebase.sign_in_provider === 'anonymous'; }
}
export const AuthUser = createParamDecorator( (data, [root, args, ctx, info]) => new AuthData(ctx.req.user) );

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly auth_service: AuthService,
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        if ( !ctx.getContext().req.headers ) return false;
        if ( ctx.getContext().req.headers.hasOwnProperty('authorization') ) {
            const str_token: string[] = ( ( ctx.getContext().req.headers.authorization ) as string ).split(' ');
            if ( str_token.length !== 2 ) return false;
            try {
                ctx.getContext().req.user = await this.auth_service.validate(str_token[1]);
            } catch ( error ) {
                throw error;
            }
            return true;
        }
        else return false;
    }
}