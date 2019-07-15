import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.user.data';

@Module({
    providers: [
        AuthGuard,
    ],
    exports: [
        AuthGuard,
    ],
})
export class AuthModule{}